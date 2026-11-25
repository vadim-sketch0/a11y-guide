// make-images.cjs – власні ілюстрації (SVG) → растрові варіанти AVIF / WebP / JPEG у кількох ширинах.
// Запуск: node design/make-images.cjs <node_modules із sharp>
const path = require('path'); const fs = require('fs');
const sharp = require(path.join(process.argv[2], 'sharp'));
const OUT = path.join(__dirname, '..', 'public', 'img');

// Головна ілюстрація: ноутбук із фокусною рамкою навколо кнопки, символ доступності, клавіатура
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbe8ff"/><stop offset="1" stop-color="#f3e8ff"/></linearGradient></defs>
  <rect width="1600" height="1200" fill="url(#bg)"/>
  <circle cx="1310" cy="230" r="150" fill="#c7dbff"/><circle cx="210" cy="980" r="210" fill="#e6d7ff"/>
  <rect x="300" y="250" width="1000" height="640" rx="36" fill="#1e293b"/>
  <rect x="340" y="290" width="920" height="560" rx="14" fill="#ffffff"/>
  <rect x="380" y="330" width="840" height="56" rx="10" fill="#eef2ff"/>
  <circle cx="420" cy="358" r="14" fill="#2459c7"/><rect x="450" y="348" width="160" height="20" rx="8" fill="#94a3b8"/>
  <rect x="380" y="420" width="520" height="34" rx="10" fill="#0f172a"/>
  <rect x="380" y="474" width="440" height="18" rx="9" fill="#94a3b8"/><rect x="380" y="504" width="480" height="18" rx="9" fill="#94a3b8"/><rect x="380" y="534" width="360" height="18" rx="9" fill="#94a3b8"/>
  <rect x="368" y="586" width="252" height="92" rx="18" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="2 0"/>
  <rect x="380" y="598" width="228" height="68" rx="12" fill="#2459c7"/><rect x="420" y="622" width="148" height="20" rx="8" fill="#ffffff"/>
  <rect x="640" y="598" width="200" height="68" rx="12" fill="none" stroke="#2459c7" stroke-width="5"/><rect x="680" y="622" width="120" height="20" rx="8" fill="#2459c7"/>
  <rect x="940" y="420" width="280" height="250" rx="16" fill="#e0e7ff"/>
  <circle cx="1080" cy="545" r="92" fill="#2459c7"/>
  <circle cx="1080" cy="492" r="17" fill="#fff"/>
  <path d="M1020 522 h120 M1080 522 v52 M1080 574 l-30 56 M1080 574 l30 56" stroke="#fff" stroke-width="15" stroke-linecap="round" fill="none"/>
  <rect x="380" y="712" width="840" height="100" rx="12" fill="#f1f5f9"/>
  <rect x="410" y="740" width="300" height="18" rx="9" fill="#94a3b8"/><rect x="410" y="770" width="220" height="18" rx="9" fill="#cbd5e1"/>
  <path d="M220 890 h1160 l-70 80 H290 z" fill="#334155"/>
  <g fill="#e2e8f0">${Array.from({ length: 12 }, (_, i) => `<rect x="${420 + i * 64}" y="1000" width="52" height="44" rx="8"/>`).join('')}<rect x="420" y="1056" width="436" height="44" rx="8"/><rect x="868" y="1056" width="244" height="44" rx="8"/></g>
  <rect x="1124" y="1056" width="52" height="44" rx="8" fill="#f59e0b"/><text x="1150" y="1087" font-family="Arial" font-weight="700" font-size="24" text-anchor="middle" fill="#1e293b">Tab</text>
</svg>`;

// Ілюстрація розділу: дві колонки тексту різного контрасту й лупа
const detail = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#ecfdf5"/>
  <circle cx="1020" cy="140" r="120" fill="#d1fae5"/>
  <rect x="120" y="150" width="440" height="600" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
  <rect x="640" y="150" width="440" height="600" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
  <text x="340" y="250" font-family="Arial" font-size="64" font-weight="700" text-anchor="middle" fill="#cbd5e1">Аа</text>
  <text x="860" y="250" font-family="Arial" font-size="64" font-weight="700" text-anchor="middle" fill="#0f172a">Аа</text>
  ${[0, 1, 2, 3, 4].map(i => `<rect x="170" y="${310 + i * 60}" width="${320 - i * 30}" height="22" rx="11" fill="#e2e8f0"/><rect x="690" y="${310 + i * 60}" width="${320 - i * 30}" height="22" rx="11" fill="#334155"/>`).join('')}
  <text x="340" y="690" font-family="Arial" font-size="40" font-weight="700" text-anchor="middle" fill="#b91c1c">1,5 : 1</text>
  <text x="860" y="690" font-family="Arial" font-size="40" font-weight="700" text-anchor="middle" fill="#047857">17,9 : 1</text>
  <circle cx="900" cy="520" r="120" fill="none" stroke="#047857" stroke-width="22"/><path d="M985 605 l110 110" stroke="#047857" stroke-width="34" stroke-linecap="round"/>
</svg>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, svg, widths] of [['hero', hero, [480, 800, 1200, 1600]], ['contrast', detail, [480, 800, 1200]]]) {
    for (const w of widths) {
      const png = await sharp(Buffer.from(svg), { density: 144 }).resize(w).png().toBuffer();
      await sharp(png).avif({ quality: 55 }).toFile(path.join(OUT, `${name}-${w}.avif`));
      await sharp(png).webp({ quality: 78 }).toFile(path.join(OUT, `${name}-${w}.webp`));
      await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${name}-${w}.jpg`));
    }
  }
  for (const f of fs.readdirSync(OUT)) console.log(f, fs.statSync(path.join(OUT, f)).size);
})();
