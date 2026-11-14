// Draw a Road – physics simulation.
// No DOM in here: it takes a level + the player's lines and steps the world.
// Fixed time step, so the same lines always give the same result
// (handy later for multiplayer: just send the lines, everyone sees the same run).
import * as planck from '../../js/vendor/planck.mjs';

const { Vec2 } = planck;
export const STEP = 1 / 60;
export const WORLD_W = 32;
export const WORLD_H = 18;
const GRAVITY = 10;

export const CAR = {
  bodyW: 1.8, bodyH: 0.45,
  wheelR: 0.55, wheelX: 0.68, wheelY: -0.55, // big monster truck wheels
  speed: 12, boostSpeed: 28, torque: 22,
};
CAR.rideH = CAR.wheelR - CAR.wheelY; // chassis height above the ground

export function strokeLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return len;
}

const inBox = (x, y, b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

export function createSim(level, strokes) {
  const world = new planck.World({ gravity: Vec2(0, -GRAVITY) });
  const events = [];

  // ---- static stuff ----
  const ground = world.createBody();
  const addChain = (pts, opts = {}) => {
    const clean = [];
    for (const p of pts) {
      const last = clean[clean.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.05) clean.push(p);
    }
    if (clean.length < 2) return;
    ground.createFixture(planck.Chain(clean.map(p => Vec2(p[0], p[1])), false), { friction: 0.9, ...opts });
  };
  (level.ground || []).forEach(g => addChain(g.pts));
  (level.blocks || []).forEach(b => {
    ground.createFixture(planck.Box(b.w / 2, b.h / 2, Vec2(b.x + b.w / 2, b.y + b.h / 2), 0), { friction: 0.6 });
  });
  (level.bouncers || []).forEach(b => {
    ground.createFixture(planck.Box(b.w / 2, 0.15, Vec2(b.x + b.w / 2, b.y - 0.15), 0), { friction: 0.5, userData: { bouncer: b } });
  });
  strokes.forEach(s => addChain(s.pts, { friction: 1 }));

  // ---- car ----
  const sx = level.car.x, sy = level.car.y + CAR.rideH;
  const chassis = world.createBody({ type: 'dynamic', position: Vec2(sx, sy) });
  chassis.createFixture(planck.Box(CAR.bodyW / 2, CAR.bodyH / 2), { density: 1.2, friction: 0.4 });
  chassis.createFixture(planck.Polygon([Vec2(-0.55, 0.2), Vec2(0.35, 0.2), Vec2(0.15, 0.62), Vec2(-0.45, 0.62)]), { density: 0.5, friction: 0.4 });
  // keep the weight low and a bit forward so the car does not flip on hills
  const md = { mass: 0, center: Vec2(), I: 0 };
  chassis.getMassData(md);
  md.center = Vec2(0.1, -0.5);
  chassis.setMassData(md);
  const wheels = [-1, 1].map(side => {
    const w = world.createBody({ type: 'dynamic', position: Vec2(sx + side * CAR.wheelX, sy + CAR.wheelY), bullet: true });
    w.createFixture(planck.Circle(CAR.wheelR), { density: 1, friction: 1.2, restitution: 0.1 });
    return w;
  });
  const engine = level.engine !== false;
  const joints = wheels.map(w => world.createJoint(planck.WheelJoint({
    motorSpeed: 0, maxMotorTorque: CAR.torque, enableMotor: engine,
    frequencyHz: 4, dampingRatio: 0.6,
  }, chassis, w, w.getPosition(), Vec2(0, 1))));
  const parts = [chassis, ...wheels];

  let bounceQueue = null;
  world.on('begin-contact', c => {
    const a = c.getFixtureA().getUserData(), b = c.getFixtureB().getUserData();
    const bo = (a && a.bouncer) || (b && b.bouncer);
    if (bo) bounceQueue = bo;
  });

  const state = {
    status: 'driving', // 'driving' | 'won' | 'lost'
    reason: '',
    time: 0,
    events,
    stuckFor: 0, flipFor: 0, boostFor: 0, portalCool: 0, started: 0.6,
  };

  // pop the car out upright at (x, y) – no spinning out of a portal
  function placeCar(x, y) {
    chassis.setTransform(Vec2(x, y), 0);
    chassis.setAngularVelocity(0);
    wheels.forEach((w, i) => w.setTransform(Vec2(x + (i ? 1 : -1) * CAR.wheelX, y + CAR.wheelY), w.getAngle()));
  }

  function step() {
    if (state.status !== 'driving') return;
    state.time += STEP;
    const pos = chassis.getPosition();

    // engine: small pause at the start so the car settles first
    state.started -= STEP;
    if (engine) {
      const sp = state.started > 0 ? 0 : -(state.boostFor > 0 ? CAR.boostSpeed : CAR.speed);
      joints.forEach(j => {
        j.setMotorSpeed(sp);
        j.setMaxMotorTorque(state.boostFor > 0 ? CAR.torque * 2 : CAR.torque);
      });
    }

    // floaty zones: gravity pushes up instead of down
    (level.floaty || []).forEach(z => {
      parts.forEach(p => {
        const q = p.getPosition();
        if (inBox(q.x, q.y, z)) p.applyForceToCenter(Vec2(0, p.getMass() * (GRAVITY + (z.lift || 5))), true);
      });
    });

    world.step(STEP, 8, 3);

    // trampoline
    if (bounceQueue) {
      const up = bounceQueue.power || 14;
      // big wheels lose speed on the bounce, so give a little push forward too
      const vx = chassis.getLinearVelocity().x;
      const fwd = Math.abs(vx) < 4.5 ? (vx < 0 ? -4.5 : 4.5) : vx;
      parts.forEach(p => p.setLinearVelocity(Vec2(fwd, up)));
      events.push('bounce');
      bounceQueue = null;
    }

    // boosters
    state.boostFor -= STEP;
    (level.boosters || []).forEach(b => {
      if (inBox(pos.x, pos.y, b)) {
        const dir = b.dir || 1;
        const v = chassis.getLinearVelocity();
        if (v.x * dir < 13) parts.forEach(p => {
          const pv = p.getLinearVelocity();
          p.setLinearVelocity(Vec2(13 * dir, pv.y));
        });
        if (state.boostFor <= 0) events.push('boost');
        state.boostFor = 1.2;
      }
    });

    // portals (one way: in → out)
    state.portalCool -= STEP;
    if (state.portalCool <= 0) {
      for (const pt of level.portals || []) {
        if (Math.hypot(pos.x - pt.in.x, pos.y - pt.in.y) < 1.0) {
          placeCar(pt.out.x, pt.out.y);
          const dir = pt.dir || 1;
          const v = chassis.getLinearVelocity();
          const speed = Math.max(Math.hypot(v.x, v.y), 6);
          parts.forEach(p => p.setLinearVelocity(Vec2(speed * dir, 0)));
          events.push('portal');
          state.portalCool = 1;
          break;
        }
      }
    }

    // win?
    const p2 = chassis.getPosition();
    const f = level.flag;
    if (Math.abs(p2.x - f.x) < 1.1 && p2.y > f.y - 0.5 && p2.y < f.y + 3.5) {
      state.status = 'won';
      events.push('win');
      return;
    }

    // lose?
    if (p2.y < -2 || p2.x < -3 || p2.x > WORLD_W + 3 || p2.y > WORLD_H + 12) return lose('fell');
    const speed = chassis.getLinearVelocity().length();
    state.stuckFor = speed < 0.3 && state.started < -1 ? state.stuckFor + STEP : 0;
    if (state.stuckFor > 2.5) return lose('stuck');
    state.flipFor = Math.cos(chassis.getAngle()) < -0.2 ? state.flipFor + STEP : 0;
    if (state.flipFor > 1.8) return lose('flipped');
    if (state.time > 40) return lose('stuck');
  }

  function lose(reason) {
    state.status = 'lost';
    state.reason = reason;
    events.push('lose');
  }

  function car() {
    const p = chassis.getPosition();
    return {
      x: p.x, y: p.y, angle: chassis.getAngle(),
      wheels: wheels.map(w => ({ x: w.getPosition().x, y: w.getPosition().y, angle: w.getAngle() })),
      boosting: state.boostFor > 0,
    };
  }

  return { state, step, car };
}
