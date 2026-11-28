// Axie Pals – friendly drawn icons for buttons (instead of emoji).
// Soft, rounded, flat colours with a light shine. 64 x 64 viewBox.
// ic(name) -> '<svg ...>' string.

const S = {
  // food bowl with a worm peeking out
  feed: `<ellipse cx="32" cy="52" rx="22" ry="4" fill="#000" opacity=".12"/>
    <path d="M10 32h44c0 11-9 19-22 19S10 43 10 32z" fill="#ff7aa2"/>
    <path d="M14 36c3 7 10 11 18 11" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".45"/>
    <ellipse cx="32" cy="32" rx="22" ry="6" fill="#ffb3c8"/>
    <ellipse cx="32" cy="32" rx="18" ry="4" fill="#8a5a3c"/>
    <circle cx="24" cy="31" r="2.6" fill="#b07a52"/><circle cx="33" cy="30" r="2.6" fill="#b07a52"/><circle cx="40" cy="32" r="2.4" fill="#b07a52"/>
    <path d="M30 31c-2-8 4-13 9-12 5 1 6 7 2 9" stroke="#f48fb1" stroke-width="5.5" stroke-linecap="round" fill="none"/>
    <circle cx="42" cy="26" r="1.3" fill="#3b2433"/>`,
  // yellow sponge with bubbles
  clean: `<ellipse cx="30" cy="52" rx="20" ry="4" fill="#000" opacity=".12"/>
    <rect x="10" y="24" width="38" height="24" rx="8" fill="#ffd54a"/>
    <rect x="10" y="40" width="38" height="8" rx="4" fill="#5ccf8a"/>
    <circle cx="19" cy="31" r="2.4" fill="#e8b326"/><circle cx="29" cy="35" r="2" fill="#e8b326"/><circle cx="38" cy="30" r="2.6" fill="#e8b326"/><circle cx="23" cy="38" r="1.6" fill="#e8b326"/>
    <path d="M14 28c3-2 8-3 12-3" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
    <circle cx="48" cy="18" r="7" fill="#bfefff" stroke="#fff" stroke-width="2"/><circle cx="38" cy="12" r="4" fill="#bfefff" stroke="#fff" stroke-width="1.6"/><circle cx="54" cy="31" r="3.5" fill="#bfefff" stroke="#fff" stroke-width="1.5"/>
    <circle cx="46" cy="16" r="1.8" fill="#fff"/>`,
  // glowing light bulb
  light: `<circle cx="32" cy="26" r="20" fill="#fff59d" opacity=".45"/>
    <path d="M32 9c-10 0-17 7-17 16 0 6 3 10 7 13 2 2 3 4 3 6h14c0-2 1-4 3-6 4-3 7-7 7-13 0-9-7-16-17-16z" fill="#ffd54a"/>
    <path d="M22 22c1-5 5-8 10-8" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".7"/>
    <rect x="24" y="44" width="16" height="5" rx="2.5" fill="#9ab0c2"/><rect x="25" y="49" width="14" height="5" rx="2.5" fill="#7d93a6"/>
    <path d="M28 54h8l-1 3h-6z" fill="#5f7385"/>`,
  // crescent moon with stars
  moon: `<path d="M40 8a22 22 0 1 0 14 34A18 18 0 0 1 40 8z" fill="#ffe082"/>
    <path d="M22 18c-4 4-6 10-4 16" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>
    <circle cx="26" cy="32" r="2.5" fill="#f2c94c"/><circle cx="33" cy="44" r="3" fill="#f2c94c"/>
    <path d="M50 12l1.6 3.4 3.4 1.6-3.4 1.6L50 22l-1.6-3.4L45 17l3.4-1.6z" fill="#fff"/>
    <path d="M56 30l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#fff"/>`,
  // pill capsule
  medicine: `<ellipse cx="32" cy="52" rx="18" ry="4" fill="#000" opacity=".12"/>
    <g transform="rotate(-40 32 32)"><rect x="12" y="22" width="40" height="20" rx="10" fill="#fff"/><path d="M22 22h10v20H22a10 10 0 0 1 0-20z" fill="#ff6b81"/>
    <rect x="16" y="25" width="14" height="4" rx="2" fill="#fff" opacity=".55"/></g>
    <circle cx="50" cy="14" r="8" fill="#5ccf8a"/><path d="M50 9v10M45 14h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  // game controller
  play: `<ellipse cx="32" cy="52" rx="22" ry="4" fill="#000" opacity=".12"/>
    <path d="M18 20h28c8 0 12 8 13 17 1 8-3 12-7 12-5 0-7-6-12-6H24c-5 0-7 6-12 6-4 0-8-4-7-12 1-9 5-17 13-17z" fill="#9b7bff"/>
    <path d="M14 26c2-3 5-4 9-4" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".5"/>
    <path d="M20 28v10M15 33h10" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="44" cy="29" r="3.2" fill="#ffd54a"/><circle cx="50" cy="35" r="3.2" fill="#ff6b81"/><circle cx="38" cy="35" r="3.2" fill="#5ccf8a"/>`,
  // two friends (little round faces) with a heart
  friends: `<ellipse cx="32" cy="54" rx="24" ry="4" fill="#000" opacity=".12"/>
    <circle cx="22" cy="34" r="14" fill="#ffb3c8"/><circle cx="43" cy="36" r="13" fill="#9fd4ff"/>
    <circle cx="18" cy="32" r="2" fill="#3b2433"/><circle cx="26" cy="32" r="2" fill="#3b2433"/><path d="M18 38q4 3 8 0" stroke="#3b2433" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="39" cy="34" r="2" fill="#23324a"/><circle cx="47" cy="34" r="2" fill="#23324a"/><path d="M39 40q4 3 8 0" stroke="#23324a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32 18c-2-4-8-3-8 1 0 3 4 6 8 9 4-3 8-6 8-9 0-4-6-5-8-1z" fill="#ff4f86"/>
    <circle cx="16" cy="27" r="3" fill="#fff" opacity=".5"/><circle cx="37" cy="29" r="3" fill="#fff" opacity=".5"/>`,
  // present box
  things: `<ellipse cx="32" cy="54" rx="22" ry="4" fill="#000" opacity=".12"/>
    <rect x="12" y="28" width="40" height="24" rx="5" fill="#4fd1c5"/>
    <rect x="9" y="21" width="46" height="10" rx="4" fill="#6fe3d8"/>
    <rect x="28" y="21" width="8" height="31" fill="#ff6b9a"/>
    <path d="M32 21c-4-8-14-10-14-4 0 4 8 5 14 4zM32 21c4-8 14-10 14-4 0 4-8 5-14 4z" fill="#ff6b9a"/>
    <rect x="13" y="23" width="12" height="3" rx="1.5" fill="#fff" opacity=".55"/>`,
  // coat hanger with a little dress
  wardrobe: `<ellipse cx="32" cy="56" rx="18" ry="3.5" fill="#000" opacity=".12"/>
    <path d="M32 14c0-3 2-5 5-5s5 2 5 5-3 4-5 6" stroke="#9ab0c2" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M37 20L10 31h44z" stroke="#9ab0c2" stroke-width="3" stroke-linejoin="round" fill="none"/>
    <path d="M24 28h16l3 6-4 2 6 18H19l6-18-4-2z" fill="#ff7aa2"/>
    <path d="M24 28c2 4 6 5 8 5s6-1 8-5" fill="#ffb3c8"/>
    <circle cx="27" cy="44" r="2" fill="#fff" opacity=".7"/><circle cx="36" cy="48" r="2" fill="#fff" opacity=".7"/><circle cx="33" cy="40" r="1.6" fill="#fff" opacity=".7"/>`,
  // camera
  photo: `<ellipse cx="32" cy="54" rx="22" ry="4" fill="#000" opacity=".12"/>
    <rect x="22" y="14" width="16" height="8" rx="3" fill="#7d93a6"/>
    <rect x="8" y="19" width="48" height="32" rx="9" fill="#5b8def"/>
    <circle cx="32" cy="35" r="12" fill="#e8f1ff"/><circle cx="32" cy="35" r="8" fill="#2b3f6b"/><circle cx="29" cy="32" r="2.6" fill="#fff"/>
    <circle cx="48" cy="26" r="2.6" fill="#ffd54a"/>
    <path d="M12 25c2-2 5-3 8-3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
  // gear
  settings: `<path d="M28 6h8l1.5 6.5 5 2 5.5-3.7 5.6 5.6-3.7 5.5 2 5L58 28v8l-6.5 1.5-2 5 3.7 5.5-5.6 5.6-5.5-3.7-5 2L36 58h-8l-1.5-6.5-5-2-5.5 3.7-5.6-5.6 3.7-5.5-2-5L6 36v-8l6.5-1.5 2-5-3.7-5.5 5.6-5.6 5.5 3.7 5-2z" fill="#a9bdd6"/>
    <circle cx="32" cy="32" r="10" fill="#e8f0fa"/><circle cx="32" cy="32" r="5" fill="#a9bdd6"/>`,
  // gold coin with a star
  coin: `<circle cx="32" cy="33" r="24" fill="#e0a419"/><circle cx="32" cy="31" r="24" fill="#ffd54a"/>
    <circle cx="32" cy="31" r="18" fill="#ffc22e"/>
    <path d="M32 19l3.7 7.5 8.3 1.2-6 5.8 1.4 8.2L32 37.8l-7.4 3.9 1.4-8.2-6-5.8 8.3-1.2z" fill="#fff3c4"/>
    <path d="M16 22c3-5 8-8 14-9" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".6"/>`,
  // needs
  bubbles: `<circle cx="26" cy="36" r="16" fill="#bfefff" stroke="#fff" stroke-width="3"/><circle cx="46" cy="20" r="9" fill="#bfefff" stroke="#fff" stroke-width="2.5"/><circle cx="48" cy="44" r="6" fill="#bfefff" stroke="#fff" stroke-width="2"/>
    <circle cx="20" cy="30" r="4.5" fill="#fff"/><circle cx="43" cy="17" r="2.5" fill="#fff"/>`,
  ball: `<circle cx="32" cy="32" r="22" fill="#fff"/>
    <path d="M32 10a22 22 0 0 1 19 11L32 32z" fill="#ff6b6b"/><path d="M51 21a22 22 0 0 1 0 22L32 32z" fill="#ffd54a"/><path d="M51 43a22 22 0 0 1-19 11V32z" fill="#4fa3ff"/>
    <path d="M32 54a22 22 0 0 1-19-11l19-11z" fill="#5ccf8a"/><path d="M13 43a22 22 0 0 1 0-22l19 11z" fill="#fff"/><path d="M13 21a22 22 0 0 1 19-11v22z" fill="#ff9a3d"/>
    <circle cx="32" cy="32" r="4" fill="#fff"/><ellipse cx="22" cy="20" rx="6" ry="3" fill="#fff" opacity=".6" transform="rotate(-35 22 20)"/>`,
  sleep: `<path d="M38 10a20 20 0 1 0 14 32A16 16 0 0 1 38 10z" fill="#b39dff"/>
    <text x="40" y="26" font-family="Nunito,sans-serif" font-weight="900" font-size="16" fill="#fff">z</text><text x="48" y="16" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="#fff">z</text>`,
  // wardrobe tabs
  hat: `<ellipse cx="32" cy="46" rx="24" ry="7" fill="#5a4a7a"/><rect x="18" y="16" width="28" height="30" rx="4" fill="#6c5a92"/><rect x="18" y="36" width="28" height="6" fill="#ff6b9a"/><rect x="21" y="19" width="5" height="16" rx="2.5" fill="#fff" opacity=".25"/>`,
  glasses: `<circle cx="20" cy="34" r="11" fill="#bfefff" stroke="#5b8def" stroke-width="4"/><circle cx="44" cy="34" r="11" fill="#bfefff" stroke="#5b8def" stroke-width="4"/><path d="M31 33q1-3 2 0" stroke="#5b8def" stroke-width="4" fill="none"/><path d="M15 30l4-3M39 30l4-3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  scarf: `<path d="M12 22c10 6 30 6 40 0v10c-10 6-30 6-40 0z" fill="#ff6b6b"/><path d="M38 30l6 24h-9l-4-22z" fill="#ff6b6b"/><path d="M18 25v9M26 27v9M34 27v9M42 25v9" stroke="#ffd54a" stroke-width="3"/><path d="M37 46h8M38 51h8" stroke="#ffd54a" stroke-width="2.5"/>`,
  back: `<rect x="14" y="16" width="36" height="40" rx="10" fill="#ff9a3d"/><path d="M24 16v-3a8 8 0 0 1 16 0v3" stroke="#e07a1f" stroke-width="4" fill="none"/><rect x="20" y="34" width="24" height="14" rx="5" fill="#ffb86b"/><rect x="29" y="38" width="6" height="3" rx="1.5" fill="#e07a1f"/><rect x="18" y="20" width="6" height="10" rx="3" fill="#fff" opacity=".35"/>`,
  pattern: `<path d="M32 6l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" fill="#ffd54a"/><path d="M50 38l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z" fill="#ff7aa2"/><path d="M14 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#9fd4ff"/>`,
  colour: `<path d="M32 8C17 8 7 18 7 30c0 10 8 17 16 17 5 0 5-4 4-7-1-3 0-6 4-6h7c9 0 15-6 15-13C53 13 44 8 32 8z" fill="#ffe7c2"/>
    <circle cx="20" cy="24" r="5" fill="#ff6b6b"/><circle cx="32" cy="17" r="5" fill="#ffd54a"/><circle cx="44" cy="22" r="5" fill="#5ccf8a"/><circle cx="17" cy="36" r="4.5" fill="#4fa3ff"/>`,
  outfits: `<path d="M32 7l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 24l16-2z" fill="#ffd54a"/><path d="M24 22l4-8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  // playdate
  hug: `<path d="M24 50C10 40 4 32 4 23c0-7 5-12 11-12 4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 12 0 9-6 17-20 27z" fill="#ff7aa2"/>
    <path d="M42 54C30 46 25 39 25 32c0-6 4-10 9-10 3 0 6 2 8 4 2-2 5-4 8-4 5 0 9 4 9 10 0 7-5 14-17 22z" fill="#ffb3c8"/>
    <ellipse cx="13" cy="20" rx="4" ry="2.5" fill="#fff" opacity=".6" transform="rotate(-30 13 20)"/>`,
  race: `<rect x="12" y="8" width="4" height="50" rx="2" fill="#8d6e63"/>
    <path d="M16 10h36l-6 10 6 10H16z" fill="#fff"/>
    <path d="M16 10h9v7h-9zM34 10h9v7h-9zM25 17h9v6h-9zM43 17h6l-3 6h-3zM16 23h9v7h-9zM34 23h9v7h-9z" fill="#2b2b3a"/>`,
  treat: `<ellipse cx="32" cy="54" rx="20" ry="4" fill="#000" opacity=".12"/>
    <path d="M18 30h28l-4 22H22z" fill="#ffcc80"/><path d="M24 32l1 18M32 32v18M40 32l-1 18" stroke="#e09a48" stroke-width="2"/>
    <path d="M14 31c-2-10 6-14 12-13 2-6 10-6 12 0 6-1 14 3 12 13z" fill="#ffb3d9"/>
    <circle cx="32" cy="13" r="5" fill="#ff4f6d"/><path d="M32 8c1-3 4-4 6-3" stroke="#5ccf8a" stroke-width="2" fill="none"/>
    <path d="M22 24l3-1M30 22l3 1M38 25l3-1" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
  // games
  ttt: `<path d="M24 8v48M40 8v48M8 24h48M8 40h48" stroke="#a9bdd6" stroke-width="4" stroke-linecap="round"/><path d="M11 11l10 10M21 11L11 21" stroke="#ff6b81" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="32" r="5.5" fill="none" stroke="#4fa3ff" stroke-width="4.5"/><path d="M27 43l10 10M37 43l-10 10" stroke="#ff6b81" stroke-width="5" stroke-linecap="round"/>`,
  shell: `<path d="M8 44C8 24 18 12 32 12s24 12 24 32z" fill="#ffc7b0"/><path d="M32 44V14M32 44L14 22M32 44L50 22M32 44L9 34M32 44L55 34" stroke="#e58e7a" stroke-width="2.5"/><path d="M24 44h16l-3 8H27z" fill="#f2a48f"/><ellipse cx="22" cy="22" rx="5" ry="2.5" fill="#fff" opacity=".6" transform="rotate(-35 22 22)"/>`,
  cards: `<rect x="8" y="14" width="26" height="36" rx="5" fill="#ff7aa2" transform="rotate(-10 21 32)"/><rect x="30" y="12" width="26" height="36" rx="5" fill="#fff" transform="rotate(8 43 30)"/><path d="M43 24c-2-4-8-3-8 1 0 3 4 6 8 9 4-3 8-6 8-9 0-4-6-5-8-1z" fill="#ff4f86" transform="rotate(8 43 30)"/>`,
  music: `<path d="M24 46V16l26-6v30" stroke="#9b7bff" stroke-width="5" fill="none" stroke-linejoin="round"/><ellipse cx="18" cy="46" rx="8" ry="6" fill="#9b7bff"/><ellipse cx="44" cy="40" rx="8" ry="6" fill="#9b7bff"/><circle cx="14" cy="16" r="4" fill="#ffd54a"/><circle cx="56" cy="52" r="3" fill="#ff7aa2"/>`,
};

export function ic(name, cls = '') {
  const body = S[name];
  return body ? `<svg class="axi ${cls}" viewBox="0 0 64 64" aria-hidden="true">${body}</svg>` : '';
}

export const ICON_CSS = `
.axi { width:70%; height:70%; display:block; filter:drop-shadow(0 2px 2px rgba(0,0,0,.18)); }
.axie-need .axi { width:28px; height:28px; }
.axie-chip .axi { width:24px; height:24px; display:inline-block; vertical-align:middle; }
.axie-chip button .axi { width:28px; height:28px; }
.axie-tabs .axi { width:34px; height:34px; }
.mg-tile .axi { width:56px; height:56px; }
.ui-chip .axi, .tag .axi, small .axi { width:1.2em; height:1.2em; display:inline-block; vertical-align:-0.25em; filter:none; }
.ui-title .axi, .ui-seg .axi, .ui-btn .axi { width:1.25em; height:1.25em; display:inline-block; vertical-align:-0.25em; }
.axie-thumb { width:56px; height:56px; display:block; }
.axie-tray .axie-thumb, .axie-bar .axi { width:78%; height:78%; }
@media (max-width: 640px) { .axie-need .axi { width:24px; height:24px; } .axie-tabs .axi { width:28px; height:28px; } }
`;
