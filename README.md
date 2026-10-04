# QR Studio

A browser-only QR code generator and designer built for the GDG on Campus SRM Recruitment 2026 frontend task. Create QR codes for URLs, text, email, phone numbers and Wi-Fi, style them, download them, and reuse them from history.

## Features
- Five QR types with type-specific fields and validation
- Live preview that redraws on every change (no debounce needed: drawing a QR canvas takes a few ms)
- Foreground/background colors, size (160–512px), margin (1–10 modules), error correction L/M/Q/H, five presets, reset
- Scan-reliability warnings: low contrast (WCAG ratio), inverted colors, thin quiet zone, small size
- PNG download (exported from the exact preview canvas), SVG download, copy payload, success/error toasts
- History in LocalStorage: save, reuse, delete, clear with confirmation, survives refresh
- Light/dark theme, responsive layout, keyboard accessible, ARIA live notifications

## Technologies
React 18, Vite, JavaScript (ES6+), CSS3, `qrcode`, `lucide-react`, Vitest.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for payload, validation, contrast
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Folder structure
```
src/
  components/  Header, QRTypeSelector, QRInputForm, QRCustomization,
               PresetSelector, QRPreview, QRHistory, Toast
  hooks/       useQRCode (canvas drawing), useLocalStorage (safe persistence)
  utils/       qrPayload (string builders), validation, contrast, presets
  App.jsx      owns all state and wires components together
```

## How QR generation works
1. `validate()` checks the fields for the selected type.
2. If valid, `buildPayload()` makes the string: `https://…`, `mailto:a@b.com?subject=…&body=…`, `tel:+91…`, or `WIFI:T:WPA;S:name;P:pass;H:true;;` (special characters `\ ; , : "` are escaped).
3. `useQRCode` calls `QRCode.toCanvas()` with size, margin, colors and error-correction level. The `qrcode` library picks the smallest QR version that fits.
4. PNG download calls `canvas.toBlob()`, so the file is identical to the preview.

## How LocalStorage is used
- `qr-history`: up to 20 entries `{ id, type, fields, payload, settings, createdAt }`.
- `qr-theme`: `light` or `dark`.
- Entries are saved only on **Save to history** or **Download PNG**, never per keystroke. Saving an identical code again moves it to the top.
- All reads/writes are wrapped in try/catch; if storage is blocked the app keeps working and shows a notice.

## Screenshots
_Add real screenshots here after running the app._
- `docs/generator-light.png`
- `docs/generator-dark.png`
- `docs/history.png`
- `docs/mobile.png`

## Deploy to Vercel
1. `npm install`, then `npm run dev` to check it locally.
2. `npm run build` to confirm the production build passes.
3. `git init && git add . && git commit -m "QR Studio"`, create a public GitHub repo, then `git remote add origin <url> && git push -u origin main`.
4. At vercel.com choose **Add New → Project**, import the repo. Vercel auto-detects Vite (build `npm run build`, output `dist`).
5. Click **Deploy**, open the URL Vercel gives you, and verify generation, download and history.

## Known limitations
- No logo embedding, on purpose, because logos can break scanning.
- Light-on-dark codes are allowed but flagged; some scanners cannot read them.
- Very long text exceeds QR capacity and shows an error.
- Clipboard copy needs HTTPS or localhost.
- The app has not been scanned with every phone/scanner; always test your own code.
