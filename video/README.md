# NITRON — «Elektromobil va salomatlik» (o'zbek tilida)

Vertikal video (720×1280, 30 fps, ~1:53), o'zbek tilida ovoz va subtitrlar bilan.

- `nitron_elektromobil_uz.mp4` — tayyor video
- `nitron-logo.svg`, `nitron-logo-*.png` — NITRON logotipi
- `script_uz.txt` — ovoz matni
- `source/` — animatsiya manbasi (HTML + Playwright render)

## Qayta render qilish

```bash
cd source
npm i playwright @fontsource/unbounded @fontsource/manrope @fontsource/jetbrains-mono
mkdir -p fonts && cp node_modules/@fontsource/*/files/*-latin-*-normal.woff2 fonts/
node render.mjs full                      # -> video_noaudio.mp4
ffmpeg -i video_noaudio.mp4 -i voice.mp3 -c:v copy -c:a aac -shortest out.mp4
```

Ovoz: ElevenLabs (eleven_v3, «Sardor» ovozi). So'zlar vaqti `words.js` faylida.
