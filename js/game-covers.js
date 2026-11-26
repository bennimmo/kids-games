// Full-picture cover art for the menu tiles (Big Kids games). 320x220, fills the tile picture.
// gameCover(id) -> SVG string, or '' (then the small drawing from game-art.js is used).
// Ids inside each cover are prefixed with the game so covers can sit on one page together.

const C = {
  'sky-pilot': `
    <defs>
      <linearGradient id="spc-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1d2b64"/><stop offset=".55" stop-color="#6a5acd"/><stop offset=".8" stop-color="#ff8a65"/><stop offset="1" stop-color="#ffcc80"/>
      </linearGradient>
      <radialGradient id="spc-sun" cx=".72" cy=".72" r=".35"><stop offset="0" stop-color="#fff3c4"/><stop offset=".25" stop-color="#ffd180" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a65" stop-opacity="0"/></radialGradient>
      <linearGradient id="spc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d3e6"/></linearGradient>
      <linearGradient id="spc-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5a4e"/><stop offset="1" stop-color="#c62828"/></linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#spc-sky)"/>
    <rect width="320" height="220" fill="url(#spc-sun)"/>
    <path d="M0 175 L40 150 L70 160 L110 132 L150 158 L190 140 L230 162 L270 138 L320 160 V220 H0z" fill="#3b2f6b" opacity=".85"/>
    <path d="M0 190 L50 172 L95 184 L140 166 L190 186 L240 170 L290 186 L320 178 V220 H0z" fill="#2a2150"/>
    <rect y="200" width="320" height="20" fill="#1c173a"/>
    <path d="M0 205 H320" stroke="#ffb74d" stroke-width="1.5" opacity=".35"/>
    <g fill="#fff" opacity=".55">
      <ellipse cx="60" cy="70" rx="36" ry="8"/><ellipse cx="80" cy="64" rx="22" ry="9"/>
      <ellipse cx="250" cy="48" rx="30" ry="6"/><ellipse cx="236" cy="44" rx="16" ry="7"/>
    </g>
    <g stroke="#fff" stroke-linecap="round" opacity=".5">
      <path d="M40 128 L118 112" stroke-width="2"/><path d="M58 142 L122 128" stroke-width="1.5"/><path d="M30 116 L102 101" stroke-width="1.2"/>
    </g>
    <g transform="translate(176 104) rotate(-14)">
      <path d="M-18 6 L-46 34 L-30 36 L4 10z" fill="url(#spc-wing)"/>
      <path d="M-64 -2 C-64 -12 -52 -16 -40 -16 H44 C62 -16 76 -8 80 0 C76 8 62 14 44 14 H-40 C-54 14 -64 8 -64 -2z" fill="url(#spc-body)"/>
      <path d="M-64 -2 L-82 -30 L-68 -30 L-48 -12z" fill="url(#spc-wing)"/>
      <path d="M-66 2 L-90 10 L-86 2 L-62 -4z" fill="#c62828"/>
      <path d="M40 -14 C52 -14 62 -9 68 -3 H40z" fill="#4fc3f7"/>
      <path d="M44 -12 C50 -12 56 -10 60 -6" stroke="#e1f5fe" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M-58 0 H66" stroke="#ff5a4e" stroke-width="4"/>
      <path d="M-12 -14 L-44 -52 L-26 -54 L14 -12z" fill="url(#spc-wing)"/>
      <path d="M-26 -54 L14 -12" stroke="#ff8a80" stroke-width="2" opacity=".7"/>
      <ellipse cx="81" cy="-1" rx="3" ry="18" fill="#263238" opacity=".75"/>
      <circle cx="81" cy="-1" r="4" fill="#ffca28"/>
    </g>`,

  'kits-karts': `
    <defs>
      <linearGradient id="kkc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2b5b"/><stop offset="1" stop-color="#3a7bd5"/></linearGradient>
      <linearGradient id="kkc-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f4b"/><stop offset="1" stop-color="#1f232b"/></linearGradient>
      <linearGradient id="kkc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a45"/><stop offset="1" stop-color="#d84315"/></linearGradient>
      <radialGradient id="kkc-glow" cx=".5" cy=".9" r=".6"><stop offset="0" stop-color="#ffd54f" stop-opacity=".45"/><stop offset="1" stop-color="#ffd54f" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="320" height="220" fill="url(#kkc-sky)"/>
    <rect width="320" height="220" fill="url(#kkc-glow)"/>
    <g fill="#fff" opacity=".9"><circle cx="40" cy="30" r="1.2"/><circle cx="120" cy="18" r="1"/><circle cx="270" cy="26" r="1.4"/><circle cx="210" cy="44" r="1"/></g>
    <path d="M0 120 C60 108 120 112 170 104 C230 96 280 104 320 98 V220 H0z" fill="#2e7d32"/>
    <path d="M0 132 C70 124 140 126 200 118 C250 112 290 116 320 112 V220 H0z" fill="#388e3c"/>
    <g transform="translate(40 52)">
      <rect x="0" y="0" width="6" height="74" fill="#cfd8dc"/><rect x="234" y="0" width="6" height="74" fill="#cfd8dc"/>
      <rect x="-4" y="0" width="248" height="22" rx="3" fill="#111"/>
      <path d="M0 0h12v11H0zM24 0h12v11H24zM48 0h12v11H48zM72 0h12v11H72zM96 0h12v11H96zM120 0h12v11h-12zM144 0h12v11h-12zM168 0h12v11h-12zM192 0h12v11h-12zM216 0h12v11h-12zM12 11h12v11H12zM36 11h12v11H36zM60 11h12v11H60zM84 11h12v11H84zM108 11h12v11h-12zM132 11h12v11h-12zM156 11h12v11h-12zM180 11h12v11h-12zM204 11h12v11h-12zM228 11h12v11h-12z" fill="#fff"/>
    </g>
    <path d="M0 150 L320 138 V220 H0z" fill="url(#kkc-road)"/>
    <path d="M0 150 L320 138" stroke="#fff" stroke-width="5" stroke-dasharray="16 16"/>
    <path d="M0 150 L320 138" stroke="#e53935" stroke-width="5" stroke-dasharray="16 16" stroke-dashoffset="16"/>
    <path d="M0 192 L320 182" stroke="#fff" stroke-width="3" stroke-dasharray="22 18" opacity=".5"/>
    <g stroke="#fff" stroke-linecap="round" opacity=".55"><path d="M20 160 H80" stroke-width="3"/><path d="M8 174 H60" stroke-width="2"/><path d="M30 186 H72" stroke-width="2"/></g>
    <ellipse cx="190" cy="196" rx="86" ry="8" fill="#000" opacity=".35"/>
    <g transform="translate(290 112) scale(-1 1)">
      <path d="M150 52 L176 46 L178 58 L152 62z" fill="#263238"/>
      <path d="M156 40 L176 34 L178 46 L158 50z" fill="#ff7a45"/>
      <path d="M6 64 C6 56 12 52 20 52 H150 C160 52 168 56 170 64 V70 H6z" fill="url(#kkc-body)"/>
      <path d="M2 62 H24 V74 H2z" fill="#bf360c"/>
      <path d="M20 56 H140" stroke="#ffccbc" stroke-width="2.5" opacity=".6"/>
      <path d="M96 52 C96 38 104 26 118 26 H130 C138 26 142 32 142 40 V52z" fill="#37474f"/>
      <path d="M62 52 C60 34 66 20 82 18 C96 16 104 26 104 40 V52z" fill="#1e88e5"/>
      <path d="M70 30 L44 40" stroke="#1565c0" stroke-width="9" stroke-linecap="round"/>
      <path d="M36 30 L36 50" stroke="#263238" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="38" cy="30" rx="4" ry="11" fill="none" stroke="#263238" stroke-width="4" transform="rotate(-20 38 30)"/>
      <circle cx="82" cy="4" r="17" fill="#fafafa"/>
      <path d="M66 4 C66 -6 73 -13 82 -13 C91 -13 98 -6 98 4 V6 H66z" fill="#ffca28"/>
      <path d="M64 0 H82 C82 8 78 12 72 12 H66z" fill="#102a43" transform="scale(-1 1) translate(-146 0)"/>
      <path d="M72 2 H80" stroke="#90caf9" stroke-width="2" stroke-linecap="round"/>
      <path d="M66 16 H98" stroke="#e53935" stroke-width="5" stroke-linecap="round"/>
      <circle cx="30" cy="74" r="16" fill="#212121"/><circle cx="30" cy="74" r="6.5" fill="#9e9e9e"/><circle cx="30" cy="74" r="2.5" fill="#424242"/>
      <circle cx="148" cy="72" r="19" fill="#212121"/><circle cx="148" cy="72" r="7.5" fill="#9e9e9e"/><circle cx="148" cy="72" r="3" fill="#424242"/>
    </g>
    <g fill="#bcaaa4" opacity=".55"><circle cx="100" cy="190" r="7"/><circle cx="86" cy="184" r="5"/><circle cx="74" cy="192" r="4"/></g>`,

  'race-track': `
    <defs>
      <linearGradient id="rtc-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e7d32"/><stop offset="1" stop-color="#1b5e20"/></linearGradient>
      <linearGradient id="rtc-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5252"/><stop offset="1" stop-color="#c62828"/></linearGradient>
      <linearGradient id="rtc-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#448aff"/><stop offset="1" stop-color="#1565c0"/></linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#rtc-bg)"/>
    <g fill="#43a047" opacity=".5"><circle cx="30" cy="30" r="14"/><circle cx="290" cy="190" r="18"/><circle cx="300" cy="40" r="10"/><circle cx="20" cy="196" r="12"/></g>
    <path d="M40 150 C40 70 120 40 170 70 C210 94 230 40 270 60 C310 80 300 150 250 170 C200 190 160 160 120 180 C80 200 40 190 40 150z" fill="none" stroke="#fff" stroke-width="54" stroke-linejoin="round"/>
    <path d="M40 150 C40 70 120 40 170 70 C210 94 230 40 270 60 C310 80 300 150 250 170 C200 190 160 160 120 180 C80 200 40 190 40 150z" fill="none" stroke="#e53935" stroke-width="54" stroke-dasharray="10 10" stroke-linejoin="round"/>
    <path d="M40 150 C40 70 120 40 170 70 C210 94 230 40 270 60 C310 80 300 150 250 170 C200 190 160 160 120 180 C80 200 40 190 40 150z" fill="none" stroke="#37474f" stroke-width="44" stroke-linejoin="round"/>
    <path d="M40 150 C40 70 120 40 170 70 C210 94 230 40 270 60 C310 80 300 150 250 170 C200 190 160 160 120 180 C80 200 40 190 40 150z" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="12 12" opacity=".7"/>
    <g transform="translate(18 112)"><path d="M0 0h11v11H0zM22 0h11v11H22zM11 11h11v11H11zM33 11h11v11H33zM0 22h11v11H0zM22 22h11v11H22z" fill="#fff"/><path d="M11 0h11v11H11zM33 0h11v11H33zM0 11h11v11H0zM22 11h11v11H22zM11 22h11v11H11zM33 22h11v11H33z" fill="#111"/></g>
    <g transform="translate(150 60) rotate(28)">
      <ellipse cx="2" cy="4" rx="24" ry="11" fill="#000" opacity=".3"/>
      <rect x="-24" y="-9" width="48" height="18" rx="7" fill="url(#rtc-red)"/>
      <rect x="-28" y="-12" width="8" height="24" rx="2" fill="#b71c1c"/>
      <rect x="20" y="-10" width="6" height="20" rx="2" fill="#b71c1c"/>
      <ellipse cx="2" cy="0" rx="8" ry="5" fill="#102a43"/><circle cx="2" cy="0" r="3.5" fill="#fff"/>
      <rect x="-18" y="-14" width="10" height="5" rx="2" fill="#212121"/><rect x="-18" y="9" width="10" height="5" rx="2" fill="#212121"/>
      <rect x="10" y="-14" width="10" height="5" rx="2" fill="#212121"/><rect x="10" y="9" width="10" height="5" rx="2" fill="#212121"/>
    </g>
    <g transform="translate(102 172) rotate(-160)">
      <ellipse cx="2" cy="4" rx="24" ry="11" fill="#000" opacity=".3"/>
      <rect x="-24" y="-9" width="48" height="18" rx="7" fill="url(#rtc-blue)"/>
      <rect x="-28" y="-12" width="8" height="24" rx="2" fill="#0d47a1"/>
      <rect x="20" y="-10" width="6" height="20" rx="2" fill="#0d47a1"/>
      <ellipse cx="2" cy="0" rx="8" ry="5" fill="#102a43"/><circle cx="2" cy="0" r="3.5" fill="#ffca28"/>
      <rect x="-18" y="-14" width="10" height="5" rx="2" fill="#212121"/><rect x="-18" y="9" width="10" height="5" rx="2" fill="#212121"/>
      <rect x="10" y="-14" width="10" height="5" rx="2" fill="#212121"/><rect x="10" y="9" width="10" height="5" rx="2" fill="#212121"/>
    </g>
    <g transform="translate(190 132) rotate(-35)">
      <rect x="-5" y="-38" width="10" height="44" rx="2" fill="#ffd54f"/>
      <rect x="-5" y="-38" width="10" height="8" fill="#f06292"/>
      <path d="M-5 6 H5 L0 18z" fill="#ffe0b2"/><path d="M-2 13 H2 L0 18z" fill="#37474f"/>
    </g>`,

  'space-race': `
    <defs>
      <radialGradient id="src-bg" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#2a1b5e"/><stop offset=".6" stop-color="#120b33"/><stop offset="1" stop-color="#05030f"/></radialGradient>
      <radialGradient id="src-neb1" cx=".2" cy=".25" r=".45"><stop offset="0" stop-color="#e040fb" stop-opacity=".55"/><stop offset="1" stop-color="#e040fb" stop-opacity="0"/></radialGradient>
      <radialGradient id="src-neb2" cx=".85" cy=".8" r=".45"><stop offset="0" stop-color="#18ffff" stop-opacity=".35"/><stop offset="1" stop-color="#18ffff" stop-opacity="0"/></radialGradient>
      <linearGradient id="src-ship" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eceff1"/><stop offset=".6" stop-color="#ffffff"/><stop offset="1" stop-color="#b0bec5"/></linearGradient>
      <radialGradient id="src-flame" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#ffeb3b"/><stop offset=".7" stop-color="#ff6d00"/><stop offset="1" stop-color="#ff6d00" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="320" height="220" fill="url(#src-bg)"/>
    <rect width="320" height="220" fill="url(#src-neb1)"/>
    <rect width="320" height="220" fill="url(#src-neb2)"/>
    <g fill="#fff">
      <circle cx="22" cy="140" r="1"/><circle cx="60" cy="30" r="1.4"/><circle cx="98" cy="190" r="1"/><circle cx="140" cy="16" r="1"/><circle cx="300" cy="24" r="1.6"/>
      <circle cx="280" cy="120" r="1"/><circle cx="200" cy="200" r="1.3"/><circle cx="250" cy="70" r=".9"/><circle cx="36" cy="80" r=".9"/><circle cx="170" cy="40" r=".8"/>
    </g>
    <g fill="none" stroke-width="2.5">
      <ellipse cx="160" cy="112" rx="150" ry="96" stroke="#7c4dff" opacity=".35"/>
      <ellipse cx="160" cy="112" rx="112" ry="72" stroke="#448aff" opacity=".45"/>
      <ellipse cx="160" cy="112" rx="78" ry="50" stroke="#18ffff" opacity=".55"/>
      <ellipse cx="160" cy="112" rx="48" ry="31" stroke="#18ffff" opacity=".75"/>
      <ellipse cx="160" cy="112" rx="24" ry="15" stroke="#e0f7fa" opacity=".9"/>
    </g>
    <circle cx="160" cy="112" r="10" fill="#e0f7fa" opacity=".8"/>
    <circle cx="276" cy="40" r="20" fill="#ff7043"/><path d="M262 34 C270 30 284 32 292 40" stroke="#ffab91" stroke-width="3" fill="none" opacity=".7"/>
    <ellipse cx="276" cy="42" rx="34" ry="7" fill="none" stroke="#ffcc80" stroke-width="2" opacity=".8" transform="rotate(-15 276 42)"/>
    <g transform="translate(120 150) rotate(-38)">
      <ellipse cx="0" cy="58" rx="13" ry="36" fill="url(#src-flame)"/>
      <path d="M-16 20 L-34 46 L-14 40z" fill="#e53935"/><path d="M16 20 L34 46 L14 40z" fill="#c62828"/>
      <path d="M0 -50 C16 -36 20 -10 18 20 C14 34 10 40 0 42 C-10 40 -14 34 -18 20 C-20 -10 -16 -36 0 -50z" fill="url(#src-ship)"/>
      <path d="M0 -50 C10 -42 14 -32 16 -22 H-16 C-14 -32 -10 -42 0 -50z" fill="#e53935"/>
      <circle cx="0" cy="-2" r="8" fill="#0d47a1" stroke="#90a4ae" stroke-width="3"/>
      <circle cx="-2.5" cy="-4.5" r="2.5" fill="#bbdefb"/>
      <path d="M-6 42 H6 L4 48 H-4z" fill="#546e7a"/>
    </g>
    <g stroke="#fff" stroke-linecap="round" opacity=".45"><path d="M60 210 L96 170" stroke-width="2"/><path d="M80 218 L108 186" stroke-width="1.5"/><path d="M44 196 L74 162" stroke-width="1.2"/></g>`,

  'draw-a-road': `
    <defs>
      <linearGradient id="drc-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d47a1"/><stop offset="1" stop-color="#1565c0"/></linearGradient>
      <pattern id="drc-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" fill="none" stroke="#90caf9" stroke-width=".8" opacity=".35"/></pattern>
      <linearGradient id="drc-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76ff03"/><stop offset="1" stop-color="#33a000"/></linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#drc-bg)"/>
    <rect width="320" height="220" fill="url(#drc-grid)"/>
    <path d="M0 170 C40 172 70 160 100 150 L130 140" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M206 158 C240 166 270 176 320 174" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M130 140 L130 220 M206 158 L206 220" stroke="#90caf9" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/>
    <path d="M118 128 C140 96 180 92 208 110" stroke="#ffeb3b" stroke-width="2" stroke-dasharray="3 6" fill="none" opacity=".9"/>
    <g transform="translate(170 104) rotate(-12)">
      <path d="M-46 -8 C-46 -16 -40 -22 -32 -22 H-6 L4 -36 H30 C38 -36 42 -32 44 -26 L48 -8z" fill="url(#drc-body)"/>
      <path d="M8 -32 H28 C33 -32 36 -29 38 -24 H2z" fill="#b3e5fc"/>
      <rect x="-50" y="-10" width="102" height="10" rx="4" fill="#263238"/>
      <path d="M-38 -16 H-10" stroke="#ccff90" stroke-width="3" opacity=".7"/>
      <g><circle cx="-30" cy="10" r="20" fill="#212121"/><circle cx="-30" cy="10" r="9" fill="#ffca28"/><circle cx="-30" cy="10" r="3.5" fill="#212121"/>
        <path d="M-30 -10 v5 M-30 25 v5 M-50 10 h5 M-15 10 h5 M-44 -4 l3.5 3.5 M-16 -4 l-3.5 3.5 M-44 24 l3.5 -3.5 M-16 24 l-3.5 -3.5" stroke="#424242" stroke-width="3" stroke-linecap="round"/></g>
      <g><circle cx="32" cy="10" r="20" fill="#212121"/><circle cx="32" cy="10" r="9" fill="#ffca28"/><circle cx="32" cy="10" r="3.5" fill="#212121"/>
        <path d="M32 -10 v5 M32 25 v5 M12 10 h5 M47 10 h5 M18 -4 l3.5 3.5 M46 -4 l-3.5 3.5 M18 24 l3.5 -3.5 M46 24 l-3.5 -3.5" stroke="#424242" stroke-width="3" stroke-linecap="round"/></g>
    </g>
    <g transform="translate(276 120)"><rect x="0" y="0" width="4" height="54" fill="#eceff1"/><path d="M4 2 H34 L28 12 L34 22 H4z" fill="#ff5252"/></g>
    <g transform="translate(46 26) rotate(30)">
      <rect x="0" y="0" width="14" height="70" rx="2" fill="#ffca28"/>
      <rect x="0" y="0" width="14" height="12" rx="2" fill="#f48fb1"/>
      <rect x="0" y="12" width="14" height="5" fill="#b0bec5"/>
      <path d="M0 70 H14 L7 88z" fill="#ffe0b2"/><path d="M4.2 80 H9.8 L7 88z" fill="#37474f"/>
    </g>`,

  'tank-tantrum': `
    <defs>
      <linearGradient id="ttc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b1f5c"/><stop offset=".6" stop-color="#c2185b"/><stop offset="1" stop-color="#ff8a65"/></linearGradient>
      <radialGradient id="ttc-boom" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffde7"/><stop offset=".35" stop-color="#ffeb3b"/><stop offset=".7" stop-color="#ff6d00" stop-opacity=".8"/><stop offset="1" stop-color="#ff6d00" stop-opacity="0"/></radialGradient>
      <linearGradient id="ttc-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccc65"/><stop offset="1" stop-color="#558b2f"/></linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#ttc-sky)"/>
    <circle cx="40" cy="36" r="13" fill="#fff3e0" opacity=".85"/><circle cx="46" cy="32" r="11" fill="#3b1f5c"/>
    <path d="M0 140 C40 110 80 100 120 130 C150 150 190 150 220 120 C250 92 290 96 320 120 V220 H0z" fill="#4a2a6b" opacity=".8"/>
    <path d="M0 170 C30 130 70 120 100 140 C120 152 140 160 160 176 C190 196 230 150 260 128 C290 108 310 120 320 128 V220 H0z" fill="#2c1745"/>
    <path d="M0 170 C30 130 70 120 100 140 C120 152 140 160 160 176 C190 196 230 150 260 128 C290 108 310 120 320 128" fill="none" stroke="#ff8a65" stroke-width="2" opacity=".5"/>
    <path d="M92 108 C140 20 230 28 262 108" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 7" fill="none" stroke-linecap="round" opacity=".85"/>
    <circle cx="200" cy="44" r="5" fill="#212121" stroke="#ffeb3b" stroke-width="2"/>
    <circle cx="264" cy="112" r="40" fill="url(#ttc-boom)"/>
    <path d="M264 80 L270 100 L292 92 L278 110 L298 122 L274 120 L276 142 L264 126 L250 142 L252 120 L230 122 L250 110 L236 92 L258 100z" fill="#ffeb3b" opacity=".9"/>
    <g fill="#5d4037" opacity=".9"><rect x="290" y="88" width="6" height="6" transform="rotate(20 293 91)"/><rect x="236" y="84" width="5" height="5"/><rect x="300" y="120" width="4" height="4"/></g>
    <g transform="translate(70 134) rotate(-14)">
      <rect x="18" y="-26" width="44" height="9" rx="4.5" fill="#33691e" transform="rotate(-32 18 -22)"/>
      <path d="M-6 -2 C-6 -18 6 -28 20 -28 H24 C38 -28 48 -18 48 -2z" fill="url(#ttc-tank)"/>
      <circle cx="16" cy="-14" r="3" fill="#33691e"/>
      <path d="M-24 -2 H64 C68 -2 70 0 70 4 V6 H-30 V4 C-30 0 -28 -2 -24 -2z" fill="#689f38"/>
      <rect x="-32" y="6" width="104" height="22" rx="11" fill="#263238"/>
      <g fill="#90a4ae"><circle cx="-20" cy="17" r="6"/><circle cx="0" cy="17" r="6"/><circle cx="20" cy="17" r="6"/><circle cx="40" cy="17" r="6"/><circle cx="60" cy="17" r="6"/></g>
      <path d="M60 -20 C64 -26 70 -28 74 -26" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>
    </g>
    <g fill="#fff" opacity=".7"><circle cx="128" cy="96" r="5"/><circle cx="120" cy="88" r="4"/><circle cx="112" cy="94" r="3"/></g>`,

  'paint': `
    <defs>
      <linearGradient id="ptc-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1f3a"/><stop offset="1" stop-color="#2b1840"/></linearGradient>
      <linearGradient id="ptc-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff1744"/><stop offset="1" stop-color="#ff9100"/></linearGradient>
      <linearGradient id="ptc-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#00e5ff"/><stop offset="1" stop-color="#2979ff"/></linearGradient>
      <linearGradient id="ptc-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c6ff00"/><stop offset="1" stop-color="#00e676"/></linearGradient>
      <linearGradient id="ptc-d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffea00"/><stop offset="1" stop-color="#ff4081"/></linearGradient>
    </defs>
    <rect width="320" height="220" fill="url(#ptc-bg)"/>
    <path d="M-10 60 C60 20 120 90 190 50 C240 22 290 40 330 20" stroke="url(#ptc-a)" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M-10 110 C50 140 110 80 180 110 C240 136 280 100 330 120" stroke="url(#ptc-b)" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M-10 170 C70 150 120 200 200 170 C250 152 290 176 330 160" stroke="url(#ptc-c)" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M60 210 C110 186 160 214 240 196" stroke="url(#ptc-d)" stroke-width="12" fill="none" stroke-linecap="round" opacity=".9"/>
    <g fill="#ff4081"><circle cx="240" cy="78" r="6"/><circle cx="256" cy="86" r="3"/><circle cx="228" cy="92" r="2.5"/></g>
    <g fill="#ffea00"><circle cx="60" cy="140" r="5"/><circle cx="74" cy="132" r="2.5"/></g>
    <g fill="#00e5ff"><circle cx="280" cy="150" r="4"/><circle cx="292" cy="140" r="2"/></g>
    <g transform="translate(206 150) rotate(-48)">
      <rect x="-7" y="0" width="14" height="80" rx="7" fill="#5d4037"/>
      <rect x="-7" y="0" width="14" height="80" rx="7" fill="url(#ptc-bg)" opacity=".15"/>
      <rect x="-8" y="-14" width="16" height="16" rx="2" fill="#cfd8dc"/>
      <rect x="-8" y="-6" width="16" height="3" fill="#90a4ae"/>
      <path d="M-8 -14 C-8 -30 -3 -40 0 -46 C3 -40 8 -30 8 -14z" fill="#ff4081"/>
      <path d="M-3 -18 C-3 -28 -1 -34 0 -38" stroke="#ff80ab" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`,
};

// Real snaps from the game (icons/covers/<id>.jpg) win over the drawings.
const SNAPS = new Set(['sky-pilot', 'kits-karts', 'tank-tantrum', 'mountain-rush', 'junk-stack']);

export function gameCover(id) {
  if (SNAPS.has(id)) return `<img class="cover" src="icons/covers/${id}.jpg" alt="" draggable="false">`;
  const c = C[id];
  return c ? `<svg class="cover" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${c}</svg>` : '';
}
