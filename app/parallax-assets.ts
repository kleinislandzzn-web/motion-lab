const posterPalettes = [
  ["#f7ff9f", "#a7ff4f", "#14221a"],
  ["#ffb4d8", "#ff5e8a", "#28131e"],
  ["#b9d5ff", "#567bff", "#111629"],
  ["#ffd9a8", "#ff8a3d", "#2a1710"],
  ["#b5fff1", "#35d8ba", "#0c2421"],
  ["#e5c5ff", "#a159ff", "#21122d"],
] as const;

function makePoster(index: number, palette: (typeof posterPalettes)[number]) {
  const [light, accent, dark] = palette;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="${dark}"/>
          <stop offset="1" stop-color="#050606"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop stop-color="${light}" stop-opacity=".95"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <circle cx="${160 + (index % 3) * 190}" cy="${120 + (index % 2) * 320}" r="260" fill="url(#glow)" filter="url(#blur)"/>
      <path d="M-40 ${480 - index * 18} Q 250 ${70 + index * 24} 840 ${230 + index * 22}" fill="none" stroke="${light}" stroke-opacity=".7" stroke-width="2"/>
      <path d="M-60 ${520 - index * 13} Q 330 ${120 + index * 20} 860 ${270 + index * 20}" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width="34"/>
      <circle cx="${620 - index * 25}" cy="${130 + index * 37}" r="78" fill="none" stroke="${light}" stroke-opacity=".55" stroke-width="1"/>
      <circle cx="${620 - index * 25}" cy="${130 + index * 37}" r="45" fill="${accent}" fill-opacity=".15"/>
      <g fill="${light}" fill-opacity=".7">
        <circle cx="80" cy="80" r="3"/><circle cx="720" cy="510" r="3"/><circle cx="675" cy="72" r="2"/>
      </g>
      <text x="54" y="535" fill="${light}" font-family="monospace" font-size="14" letter-spacing="5">FIELD 0${index + 1}</text>
      <text x="54" y="565" fill="white" fill-opacity=".48" font-family="monospace" font-size="10" letter-spacing="3">PARALLAX STUDY / 2026</text>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const parallaxImages = posterPalettes.map((palette, index) =>
  makePoster(index, palette),
);
