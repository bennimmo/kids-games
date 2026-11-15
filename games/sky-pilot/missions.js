// Sky Pilot: missions (ready for later).
//
// A mission is plain data + an update function. The game calls:
//   runner.event(name, data)   'takeoff', 'landing' {quality, airport}, 'crash', 'bounce', 'wire', 'splash'
//   runner.update(dt, player)  every frame. player = { pos, speed, alt, agl, onGround, heading, type }
// and the mission can use the api it is given:
//   api.say(text)              show a message
//   api.ring(x, y, z, r)       add a hoop to fly through (returns an id; api.ringDone(id) is true once flown through)
//   api.marker(x, y, z, icon)  a floating icon (returns a function to remove it)
//   api.win(stars) / api.fail()
//
// Example (add to MISSIONS to switch the 🎯 button on in the menu):
//   {
//     id: 'first-landing', name: 'First landing', icon: '🛬', plane: 'cub', start: 'air',
//     setup(api) { api.say('Land at Sunny Bay!'); },
//     event(api, name, d) { if (name === 'landing' && d.airport === 'main') api.win(d.quality === 'butter' ? 3 : 2); },
//   }
export const MISSIONS = [];

export function createMissionRunner(mission, api) {
  const st = {};
  if (mission.setup) mission.setup(api, st);
  return {
    mission,
    event(name, data) { if (mission.event) mission.event(api, name, data, st); },
    update(dt, player) { if (mission.update) mission.update(api, dt, player, st); },
  };
}
