import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_VIDEO = path.join(ROOT, "public/media/video");
const OUT_IMG = path.join(ROOT, "public/media/img");

const VIDEOS = [
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03.mp4", out: "01-sala", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (4).mp4", out: "02-box", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (2).mp4", out: "03-catarat", trim: 8 },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (1).mp4", out: "04-apa", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (5).mp4", out: "05-alergare", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (3).mp4", out: "06-catarat-larg", trim: 8, crf: 29 },
];

// crop: [w, h, x, y] sau null. Valorile sunt masurate pe fiecare imagine, nu ghicite.
const IMAGES = [
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05.jpeg", out: "balance-beer", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.23 (1).jpeg", out: "balance-fastfood", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (6).jpeg", out: "nutrition-plate", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (3).jpeg", out: "outdoor-summit", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (9).jpeg", out: "climbing-wall", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (7).jpeg", out: "training-bench", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05 (3).jpeg", out: "hiking-peaks", crop: null },
  /*
    Fotografia din hero. Sursa e 3840x5120, cu David la vreo 35% din latime si cu un
    sfert de tavan deasupra. Decupajul taie coloana goala din dreapta (usa alba si
    balustrada) si 600px de tavan, ca subiectul sa cada aproape de mijloc: asa `object-cover`
    il tine in cadru pe orice raport, in loc sa fie nevoie de o pozitie orizontala
    stramba in CSS. Pozitia verticala ramane in `Hero.tsx`, unde se vede alaturi de
    degradeul de sub text.
  */
  { src: "assets/WhatsApp Image 2026-08-13 at 15.41.57.jpeg", out: "david-gym", crop: [2800, 4520, 0, 600] },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.23.jpeg", out: "david-formal", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (8).jpeg", out: "sea-rest", crop: null },
  // Acelasi cadru, decupat pe cap: e avatarul rotund din tabul „Despre" al barei de jos.
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (8).jpeg", out: "david-avatar", crop: [739, 739, 945, 1361] },

  // Testimoniale, normalizate la 9:16. Decupajele sunt masurate pe fiecare sursa.
  { src: "testimonial_darius/before.jpeg", out: "darius-before", crop: [1260, 2240, 2342, 0] },
  { src: "testimonial_darius/after.jpeg", out: "darius-after", crop: [2268, 4032, 378, 0] },
  // meril-before: crop-ul de 617px latime elimina UI-ul Snapchat dar nu mai respecta 9:16
  // (0.436 in loc de 0.5625). Se completeaza canvas-ul la 796x1415 (9:16 exact la aceasta
  // inaltime) cu fundalul site-ului, in loc sa se decupeze si mai mult din subiect.
  {
    src: "testimonial_meril/before.jpeg",
    out: "meril-before",
    crop: [617, 1415, 23, 176],
    pad: { width: 796, height: 1415, background: "#0A0A0B" },
  },
  { src: "testimonial_meril/after.jpeg", out: "meril-after", crop: [790, 1404, 39, 0] },
];

const ffmpeg = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

function processVideo({ src, out, trim, crf }) {
  const input = path.join(ROOT, src);
  if (!existsSync(input)) throw new Error(`Lipseste sursa video: ${src}`);

  const trimArgs = trim ? ["-t", String(trim)] : [];
  const scale = "scale=-2:1080";

  ffmpeg([
    "-i", input, ...trimArgs,
    "-vf", scale,
    "-c:v", "libx264", "-profile:v", "main", "-crf", String(crf ?? 27), "-preset", "slow",
    "-movflags", "+faststart", "-an",
    path.join(OUT_VIDEO, `${out}.mp4`),
  ]);

  ffmpeg([
    "-i", input, ...trimArgs,
    "-vf", scale,
    "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-an",
    path.join(OUT_VIDEO, `${out}.webm`),
  ]);

  const posterPng = path.join(OUT_VIDEO, `${out}.poster.png`);
  ffmpeg(["-i", input, "-frames:v", "1", "-vf", scale, posterPng]);
  return posterPng;
}

async function toWebFormats(inputBuffer, outName) {
  const base = path.join(OUT_IMG, outName);
  await sharp(inputBuffer).avif({ quality: 55 }).toFile(`${base}.avif`);
  await sharp(inputBuffer).webp({ quality: 78 }).toFile(`${base}.webp`);
}

async function processImage({ src, out, crop, pad }) {
  const input = path.join(ROOT, src);
  if (!existsSync(input)) throw new Error(`Lipseste sursa imagine: ${src}`);

  let pipeline = sharp(input).rotate(); // .rotate() fara argument aplica orientarea EXIF
  if (crop) {
    const [width, height, left, top] = crop;
    pipeline = pipeline.extract({ width, height, left, top });
  }
  if (pad) {
    // fit: "contain" pastreaza pixelii decupati neschimbati si adauga bare laterale din
    // culoarea de fundal a site-ului, ca sa iasa exact 9:16 fara sa mai taie din subiect.
    // Acesta e singurul resize pentru acest caz: sharp combina optiunile mai multor apeluri
    // .resize() intr-o singura operatie, deci inlantuirea cu resize-ul comun de mai jos
    // (width: 1440) ar suprascrie height-ul din pad si ar strica raportul 9:16.
    pipeline = pipeline.resize({ width: pad.width, height: pad.height, fit: "contain", background: pad.background });
  } else {
    pipeline = pipeline.resize({ width: 1440, withoutEnlargement: true });
  }
  const buffer = await pipeline.toBuffer();
  await toWebFormats(buffer, out);
}

/*
  `--only=nume` reface o singura iesire. Fara el, adaugarea unei poze insemna
  re-encodarea celor sase clipuri, deci ffmpeg pe PATH si toate folderele de sursa
  prezente — pentru un fisier care nu are nicio legatura cu ele. Numele e cel din
  campul `out`, iar pentru clipuri acopera si posterul generat din ele.
*/
const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice("--only=".length);
const wanted = (entry) => !only || entry.out === only;

async function main() {
  mkdirSync(OUT_VIDEO, { recursive: true });
  mkdirSync(OUT_IMG, { recursive: true });

  if (only && ![...VIDEOS, ...IMAGES].some(wanted)) {
    throw new Error(`Nu exista nicio iesire numita „${only}".`);
  }

  for (const video of VIDEOS.filter(wanted)) {
    const posterPng = processVideo(video);
    const buffer = await sharp(posterPng).resize({ width: 1080 }).toBuffer();
    await toWebFormats(buffer, `poster-${video.out}`);
    unlinkSync(posterPng);
    const mp4 = path.join(OUT_VIDEO, `${video.out}.mp4`);
    console.log(`${video.out}.mp4  ${(statSync(mp4).size / 1_048_576).toFixed(2)} MB`);
  }

  for (const image of IMAGES.filter(wanted)) await processImage(image);
  console.log("Gata.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
