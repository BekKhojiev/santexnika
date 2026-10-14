import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const mode = process.argv[2] || 'preview';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
page.on('pageerror', e => console.error('PAGEERR', e.message));
await page.goto('file://' + dir + '/index.html');
await page.waitForFunction(() => window.READY === true);
if (mode === 'preview') {
  const ts = process.argv.slice(3).map(Number);
  for (const t of ts) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: `${dir}/prev/p_${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 80 });
  }
} else {
  const fps = 30, END = await page.evaluate(() => window.END);
  const n = Math.ceil(END * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', `${dir}/video_noaudio.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
