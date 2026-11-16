// Drawn icons for the menu tiles (one per game id). 100x100, flat with soft shading.
// gameArt(id) -> SVG string, or '' if there's no drawing (then the emoji icon is used).

const ART = {
  'sky-pilot': `
    <defs>
      <linearGradient id="sp-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b5b"/><stop offset="1" stop-color="#e2412f"/></linearGradient>
    </defs>
    <g fill="#fff">
      <path d="M12 74a8 8 0 0 1 8-8 10 10 0 0 1 19 2 7 7 0 0 1 0 14H20a8 8 0 0 1-8-8z" opacity=".95"/>
      <path d="M64 28a6 6 0 0 1 6-6 8 8 0 0 1 15 1.5 5.5 5.5 0 0 1 0 11H70a6 6 0 0 1-6-6.5z" opacity=".8"/>
    </g>
    <g transform="rotate(-12 50 52)">
      <path d="M44 52 34 30h9l17 22z" fill="#1e88e5"/>
      <path d="M22 50c0-5 4-9 9-9h40c8 0 14 4 16 9-2 5-8 9-16 9H31c-5 0-9-4-9-9z" fill="url(#sp-b)"/>
      <path d="M22 50c0-2 .6-3.8 1.6-5.3L18 34h7l9 7" fill="#e2412f"/>
      <path d="M74 44c4 .5 7.5 2.5 9.5 6h-12z" fill="#bfe9ff"/>
      <path d="M31 47h40" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
      <path d="M46 54 36 74h9l17-20z" fill="#42a5f5"/>
      <circle cx="58" cy="50" r="2.6" fill="#fff"/><circle cx="50" cy="50" r="2.6" fill="#fff"/><circle cx="42" cy="50" r="2.6" fill="#fff"/>
      <rect x="86" y="38" width="5" height="24" rx="2.5" fill="#37474f"/>
      <circle cx="87" cy="50" r="3.4" fill="#ffca28"/>
    </g>`,

  'choo-choo': `
    <g fill="#fff" opacity=".95">
      <circle cx="36" cy="22" r="7"/><circle cx="46" cy="15" r="9"/><circle cx="59" cy="12" r="6"/>
    </g>
    <rect x="12" y="80" width="78" height="5" rx="2.5" fill="#6d4c41" opacity=".55"/>
    <rect x="52" y="30" width="34" height="38" rx="5" fill="#1e88e5"/>
    <rect x="48" y="26" width="42" height="8" rx="4" fill="#1565c0"/>
    <rect x="58" y="38" width="22" height="14" rx="4" fill="#bfe9ff"/>
    <path d="M14 46a8 8 0 0 1 8-8h30v30H18a4 4 0 0 1-4-4z" fill="#e53935"/>
    <path d="M14 52h38" stroke="#ffca28" stroke-width="3"/>
    <rect x="28" y="26" width="10" height="14" rx="2" fill="#37474f"/>
    <rect x="25" y="23" width="16" height="6" rx="3" fill="#455a64"/>
    <circle cx="16" cy="45" r="3.5" fill="#fff59d"/>
    <path d="M8 68h12l-6-6z" fill="#90a4ae"/>
    <g>
      <circle cx="26" cy="72" r="9" fill="#37474f"/><circle cx="26" cy="72" r="3.5" fill="#cfd8dc"/>
      <circle cx="48" cy="72" r="9" fill="#37474f"/><circle cx="48" cy="72" r="3.5" fill="#cfd8dc"/>
      <circle cx="74" cy="72" r="9" fill="#37474f"/><circle cx="74" cy="72" r="3.5" fill="#cfd8dc"/>
    </g>
    <path d="M26 72h48" stroke="#b0bec5" stroke-width="3" stroke-linecap="round"/>`,

  'kits-karts': `
    <g transform="translate(58 12) rotate(12)">
      <rect x="0" y="0" width="3.5" height="44" rx="1.75" fill="#5d4037"/>
      <rect x="3" y="2" width="28" height="20" rx="2" fill="#fff"/>
      <path d="M3 2h7v5H3zM17 2h7v5h-7zM10 7h7v5h-7zM24 7h7v5h-7zM3 12h7v5H3zM17 12h7v5h-7zM10 17h7v5h-7zM24 17h7v5h-7z" fill="#263238"/>
    </g>
    <path d="M16 64c0-4 3-7 7-7h22l8-8h18c6 0 10 4 11 9l1 6z" fill="#43a047"/>
    <path d="M14 66h70a3 3 0 0 1 3 3v2H12v-2a3 3 0 0 1 2-3z" fill="#2e7d32"/>
    <circle cx="44" cy="40" r="11" fill="#ffca28"/>
    <path d="M37 40a7 7 0 0 1 14 0v2H37z" fill="#263238" opacity=".85"/>
    <path d="M38 37.5a6.5 4 0 0 1 9-1.5" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".7"/>
    <path d="M50 52h12" stroke="#263238" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="26" cy="72" r="10" fill="#263238"/><circle cx="26" cy="72" r="4" fill="#ff7043"/>
    <circle cx="74" cy="72" r="10" fill="#263238"/><circle cx="74" cy="72" r="4" fill="#ff7043"/>
    <path d="M4 54h8M2 62h8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>`,

  'race-track': `
    <path d="M6 44h16M2 54h14M8 64h10" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>
    <path d="M24 64l2-12c1-4 4-6 8-6h12l8-8h14c3 0 5 2 6 4l6 10h6c2 0 3 1 3 3v9z" fill="#e53935"/>
    <path d="M18 40h14l-4 12h-8z" fill="#c62828"/>
    <rect x="80" y="60" width="12" height="5" rx="2" fill="#c62828"/>
    <path d="M56 40h11l5 9H54z" fill="#263238" opacity=".85"/>
    <circle cx="63" cy="40" r="6" fill="#fff"/>
    <path d="M57.5 40a5.5 5.5 0 0 1 11 0z" fill="#1e88e5"/>
    <path d="M34 54h16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <text x="40" y="61" font-family="Nunito, sans-serif" font-weight="700" font-size="10" fill="#fff" text-anchor="middle">7</text>
    <circle cx="36" cy="66" r="11" fill="#263238"/><circle cx="36" cy="66" r="4.5" fill="#cfd8dc"/>
    <circle cx="78" cy="66" r="11" fill="#263238"/><circle cx="78" cy="66" r="4.5" fill="#cfd8dc"/>`,

  'space-race': `
    <g fill="#fff">
      <path d="M18 18l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/>
      <path d="M82 66l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/>
      <circle cx="30" cy="80" r="2"/><circle cx="84" cy="22" r="2.2"/><circle cx="12" cy="52" r="1.6"/>
    </g>
    <g transform="rotate(45 50 50)">
      <path d="M43 74h14l-7 20z" fill="#ffca28"/>
      <path d="M45.5 74h9l-4.5 12z" fill="#ff7043"/>
      <path d="M36 62l-8 12h12zM64 62l8 12H60z" fill="#e53935"/>
      <path d="M50 12c10 8 14 22 14 38 0 9-2 18-4 24H40c-2-6-4-15-4-24 0-16 4-30 14-38z" fill="#eceff1"/>
      <path d="M50 12c10 8 14 22 14 38 0 9-2 18-4 24h-6c3-8 4-16 4-25 0-14-3-27-8-37z" fill="#cfd8dc"/>
      <path d="M50 12c5 4 8.5 9.5 11 16H39c2.5-6.5 6-12 11-16z" fill="#e53935"/>
      <circle cx="50" cy="42" r="7.5" fill="#1e88e5" stroke="#90a4ae" stroke-width="3"/>
      <circle cx="47.5" cy="39.5" r="2.2" fill="#bfe9ff"/>
      <rect x="47" y="56" width="6" height="18" rx="3" fill="#e53935"/>
    </g>`,

  'draw-a-road': `
    <path d="M4 84c18-2 26-12 46-12s30 8 46 4" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M24 46c0-4 3-7 7-7h14l6-10h18c4 0 6 2 7 5l3 12h4c2 0 3 1 3 3v8H24z" fill="#ff7043"/>
    <path d="M53 33h14l3 11H47z" fill="#bfe9ff"/>
    <rect x="22" y="54" width="62" height="6" rx="3" fill="#455a64"/>
    <path d="M60 33v11" stroke="#ff7043" stroke-width="2.5"/>
    <g>
      <circle cx="32" cy="66" r="14" fill="#263238"/><circle cx="32" cy="66" r="6" fill="#ffca28"/>
      <circle cx="74" cy="66" r="14" fill="#263238"/><circle cx="74" cy="66" r="6" fill="#ffca28"/>
      <path d="M32 52v4M32 76v4M18 66h4M42 66h4M74 52v4M74 76v4M60 66h4M84 66h4" stroke="#455a64" stroke-width="3" stroke-linecap="round"/>
    </g>
    <circle cx="40" cy="40" r="2.6" fill="#fff"/><circle cx="34" cy="43" r="1.8" fill="#fff"/>
    <g transform="translate(78 8) rotate(40)">
      <rect x="0" y="0" width="9" height="30" rx="1.5" fill="#ffca28"/>
      <rect x="0" y="0" width="9" height="6" rx="1.5" fill="#f48fb1"/>
      <path d="M0 30h9l-4.5 9z" fill="#ffe0b2"/>
      <path d="M2.8 35.6h3.4L4.5 39z" fill="#37474f"/>
    </g>`,

  'beautiful-bells': `
    <defs>
      <linearGradient id="bb-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd54f"/><stop offset=".5" stop-color="#fff3c4"/><stop offset="1" stop-color="#ffb300"/></linearGradient>
    </defs>
    <path d="M40 30c0-6 3-14 10-18 4 3 6 8 6 13v9H40z" fill="#e91e63"/>
    <path d="M47 18c2-2 4-4 6-5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6" fill="none"/>
    <rect x="37" y="32" width="22" height="16" rx="2" fill="url(#bb-g)"/>
    <rect x="34" y="46" width="28" height="42" rx="5" fill="#7b1fa2"/>
    <rect x="38" y="50" width="5" height="34" rx="2.5" fill="#fff" opacity=".25"/>
    <path d="M72 50c-4-6-14-2-10 7l10 9 10-9c4-9-6-13-10-7z" fill="#ff4081"/>
    <path d="M20 22l1.8 4.4 4.4 1.8-4.4 1.8L20 34.4l-1.8-4.4-4.4-1.8 4.4-1.8z" fill="#fff"/>
    <path d="M80 26l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff"/>
    <path d="M18 64l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff"/>`,

  'balloon-pop': `
    <path d="M30 60c4 8-2 14 2 26M50 56c-2 10 4 16 0 30M72 58c-4 8 2 16-2 28" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="30" cy="42" rx="15" ry="18" fill="#ffca28"/>
    <path d="M27 59.5h6l-3 4z" fill="#ffca28"/>
    <ellipse cx="72" cy="40" rx="15" ry="18" fill="#42a5f5"/>
    <path d="M69 57.5h6l-3 4z" fill="#42a5f5"/>
    <ellipse cx="50" cy="34" rx="17" ry="20" fill="#e53935"/>
    <path d="M47 53.5h6l-3 4z" fill="#e53935"/>
    <ellipse cx="43" cy="26" rx="4" ry="6.5" fill="#fff" opacity=".55" transform="rotate(20 43 26)"/>
    <ellipse cx="24" cy="35" rx="3.2" ry="5.5" fill="#fff" opacity=".55" transform="rotate(20 24 35)"/>
    <ellipse cx="66" cy="33" rx="3.2" ry="5.5" fill="#fff" opacity=".55" transform="rotate(20 66 33)"/>`,

  'tank-tantrum': `
    <path d="M70 18l3 6 6-3-2 7 7 2-6 4 4 6-7-1-1 7-4-6-5 4v-7l-7-1 5-5-4-6 7 1z" fill="#ffca28"/>
    <circle cx="71" cy="31" r="5" fill="#fff59d"/>
    <rect x="44" y="40" width="26" height="7" rx="3.5" fill="#558b2f" transform="rotate(-28 44 43.5)"/>
    <path d="M28 52c0-8 6-14 14-14h4c8 0 14 6 14 14z" fill="#7cb342"/>
    <circle cx="44" cy="44" r="3" fill="#33691e" opacity=".5"/>
    <path d="M14 54h68a4 4 0 0 1 4 4v2H10v-2a4 4 0 0 1 4-4z" fill="#689f38"/>
    <rect x="10" y="60" width="76" height="20" rx="10" fill="#37474f"/>
    <g fill="#90a4ae"><circle cx="21" cy="70" r="5"/><circle cx="35" cy="70" r="5"/><circle cx="49" cy="70" r="5"/><circle cx="63" cy="70" r="5"/><circle cx="76" cy="70" r="5"/></g>
    <g fill="#37474f"><circle cx="21" cy="70" r="1.8"/><circle cx="35" cy="70" r="1.8"/><circle cx="49" cy="70" r="1.8"/><circle cx="63" cy="70" r="1.8"/><circle cx="76" cy="70" r="1.8"/></g>`,

  'paint': `
    <path d="M50 14c-22 0-38 15-38 34 0 16 12 26 24 26 7 0 8-6 6-10s0-9 6-9h10c13 0 22-8 22-19 0-12-13-22-30-22z" fill="#fff8e1"/>
    <path d="M50 14c-22 0-38 15-38 34 0 3 .4 6 1.2 8.6C16 40 31 22 52 22c13 0 23 5 27 13C76 23 64 14 50 14z" fill="#fff" opacity=".7"/>
    <circle cx="44" cy="60" r="6" fill="#ffecb3"/>
    <circle cx="32" cy="38" r="7" fill="#e53935"/>
    <circle cx="50" cy="28" r="7" fill="#ffca28"/>
    <circle cx="68" cy="34" r="7" fill="#43a047"/>
    <circle cx="26" cy="56" r="6.5" fill="#1e88e5"/>
    <g transform="translate(66 50) rotate(38)">
      <rect x="-3.5" y="0" width="7" height="34" rx="3.5" fill="#8d6e63"/>
      <rect x="-4.5" y="-6" width="9" height="8" rx="1.5" fill="#b0bec5"/>
      <path d="M-4.5-6c0-6 2-10 4.5-14 2.5 4 4.5 8 4.5 14z" fill="#ab47bc"/>
    </g>`,
};

export function gameArt(id) {
  const a = ART[id];
  return a ? `<svg class="art" viewBox="0 0 100 100" aria-hidden="true">${a}</svg>` : '';
}
