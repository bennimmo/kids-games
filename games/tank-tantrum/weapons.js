// All the silly weapons. ammo: how many each tank starts with (-1 = never runs out).
// noAim: used straight away, no slingshot (the toilet).
export const WEAPONS = [
  { id: 'shell', icon: '💣', name: 'Normal Shell', desc: 'A good old BOOM', ammo: -1 },
  { id: 'chicken', icon: '🐔', name: 'Rubber Chicken', desc: 'Bounces 5 times, then BOOM', ammo: 2 },
  { id: 'cupcake', icon: '🧁', name: 'Cupcake Cluster', desc: 'Bursts into 6 mini cupcakes', ammo: 1 },
  { id: 'sock', icon: '🧦', name: 'Smelly Sock', desc: 'Chases the nearest tank', ammo: 1 },
  { id: 'mole', icon: '🐹', name: 'Mole Missile', desc: 'Digs underground, then pops up', ammo: 2 },
  { id: 'cloud', icon: '🌧️', name: 'Grumpy Cloud', desc: 'Rains on a tank for 3 turns', ammo: 1 },
  { id: 'custard', icon: '🍮', name: 'Custard Wall', desc: 'Builds a wobbly wall', ammo: 2 },
  { id: 'boot', icon: '🥾', name: 'Giant Boot', desc: 'Stomps down from the sky', ammo: 1 },
  { id: 'whoopee', icon: '💨', name: 'Whoopee Blast', desc: 'No damage, but a HUGE push', ammo: 2 },
  { id: 'shrink', icon: '🤏', name: 'Shrink Ray', desc: 'Makes a tank tiny and weak', ammo: 1 },
  { id: 'magnet', icon: '🧲', name: 'Magnet Mine', desc: 'Pulls tanks in, then BOOM', ammo: 1 },
  { id: 'toilet', icon: '🚽', name: 'Teleport Toilet', desc: 'Flush yourself somewhere new', ammo: 1, noAim: true },
  { id: 'firework', icon: '🎆', name: 'Firework Party', desc: 'Showers sparks everywhere', ammo: 1 },
  { id: 'yoyo', icon: '🪀', name: 'Yo-Yo Bomb', desc: 'Drills out, BOOM, zooms back, BOOM', ammo: 2 },
];
export const WEAPON = Object.fromEntries(WEAPONS.map(w => [w.id, w]));
