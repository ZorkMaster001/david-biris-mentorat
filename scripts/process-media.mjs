import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_VIDEO = path.join(ROOT, "public/media/video");
const OUT_IMG = path.join(ROOT, "public/media/img");

/*
  Doua destinatii in afara lui `public`, fiecare din alt motiv.

  `OUT_TESTIMONIAL`: fotografiile primite de la oameni. Din `public` ar fi stat la o
  adresa curata, ghicibila si de enumerat — `/media/img/darius-before.avif`. Importate
  din `src`, trec prin bundler si ies la o adresa cu amprenta, pe care n-o nimereste
  nimeni fara sa deschida pagina. Publice raman, cum e orice imagine dintr-o pagina
  publica; ce dispare e adresa comoda.

  `OUT_OG`: sursa pentru cardul de previzualizare. Aia nici macar nu se serveste — se
  citeste de pe disc la build si se coase in PNG-ul generat de `opengraph-image`.
*/
const OUT_TESTIMONIAL = path.join(ROOT, "src/media/testimonials");
const OUT_OG = path.join(ROOT, "src/media");

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
  // Prima poza din galeria de pe /metoda. Sursa e deja 1200x1600, adica exact 3:4,
  // cadrul in care o pune pagina — deci nu se decupeaza nimic.
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05 (4).jpeg", out: "metoda-oglinda", crop: null },
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
  /*
    Aceeasi fotografie, taiata la banda pe care o vede omul in hero.

    Formula e a heroului: `object-cover` cu `object-position: 50% 30%` din `Hero.tsx`.
    Din decupajul de hero (2800x4520), un container 1200x630 arata 630/1937 din
    inaltimea scalata, iar 30% din restul cade la y=915 — adica banda [2800x1470] de
    la 1515 in sursa.

    Banda porneste totusi de la 1360, nu de la 1515. 1200x630 e un raport mult mai lat
    decat orice fereastra reala, deci formula scoate acolo o fasie prea ingusta si taie
    varful capului; pe un ecran normal, la 30%, capul intra intreg. Cardul trebuie sa
    arate ce vede omul in pagina, nu sa aplice aceeasi aritmetica unui raport pe care
    pagina nu il are niciodata.

    Decupata dinainte, nu asezata din CSS: Satori trateaza inconstant
    `object-position`. JPEG, nu avif: compunerea trece prin resvg, unde doar JPEG si
    PNG sunt sigure.
  */
  {
    src: "assets/WhatsApp Image 2026-08-13 at 15.41.57.jpeg",
    out: "og-hero",
    crop: [2800, 1470, 0, 1360],
    dest: OUT_OG,
    format: "jpeg",
    width: 1400,
  },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.23.jpeg", out: "david-formal", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (8).jpeg", out: "sea-rest", crop: null },
  // Acelasi cadru, decupat pe cap: e avatarul rotund din tabul „Despre" al barei de jos.
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (8).jpeg", out: "david-avatar", crop: [739, 739, 945, 1361] },

  /*
    Testimoniale, normalizate la 9:16. Decupajele sunt masurate pe fiecare sursa.

    Sursele stau in `assets/`, ca tot restul materialului brut: folderul e ignorat de
    git, deci fotografiile primite de la oameni nu ajung in repo. In pagina intra doar
    derivatele decupate la cadrul de pe site, iar alea merg in `OUT_TESTIMONIAL`, nu
    in `public` — vezi motivul acolo sus.
  */
  { src: "assets/testimonial_darius/before.jpeg", out: "darius-before", crop: [1260, 2240, 2342, 0], dest: OUT_TESTIMONIAL },
  { src: "assets/testimonial_darius/after.jpeg", out: "darius-after", crop: [2268, 4032, 378, 0], dest: OUT_TESTIMONIAL },
  // meril-before: decupajul ocoleste bara de status de sus, coloana de unelte Snapchat din
  // dreapta si panoul „Ajouter une Lens" de jos. Iese exact 9:16 (796x1415), deci nu mai e
  // nevoie de completarea canvas-ului cu fundal.
  { src: "assets/testimonial_meril/before.jpeg", out: "meril-before", crop: [796, 1415, 39, 235], dest: OUT_TESTIMONIAL },
  { src: "assets/testimonial_meril/after.jpeg", out: "meril-after", crop: [790, 1404, 39, 0], dest: OUT_TESTIMONIAL },
  /*
    Fratele lui David. Ambele surse sunt 3:4, deci trebuie taiate la 9:16, si sunt
    facute in doua oglinzi diferite — una rotunda, de hol, alta dreapta, de vestiar.
    Decupajele nu urmaresc doar subiectul, ci si acelasi raport intre om si cadru in
    amandoua (~86%): la un glisor de comparatie, o diferenta de marime se citeste ca
    diferenta de fizic, ceea ce ar minti exact acolo unde trebuie sa fie cinstit.
    La „inainte" marginea de sus se opreste sub rama rotunda a oglinzii.
  */
  { src: "assets/testimonial_birisJR/before.jpeg", out: "birisjr-before", crop: [480, 854, 285, 185], dest: OUT_TESTIMONIAL },
  { src: "assets/testimonial_birisJR/after.jpeg", out: "birisjr-after", crop: [686, 1220, 332, 380], dest: OUT_TESTIMONIAL },
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

async function toWebFormats(inputBuffer, outName, outDir = OUT_IMG) {
  const base = path.join(outDir, outName);
  await sharp(inputBuffer).avif({ quality: 55 }).toFile(`${base}.avif`);
  await sharp(inputBuffer).webp({ quality: 78 }).toFile(`${base}.webp`);
}

async function processImage({ src, out, crop, pad, dest, format, width }) {
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
    pipeline = pipeline.resize({ width: width ?? 1440, withoutEnlargement: true });
  }
  const buffer = await pipeline.toBuffer();

  const outDir = dest ?? OUT_IMG;
  mkdirSync(outDir, { recursive: true });
  if (format === "jpeg") {
    await sharp(buffer).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `${out}.jpg`));
    return;
  }
  await toWebFormats(buffer, out, outDir);
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
