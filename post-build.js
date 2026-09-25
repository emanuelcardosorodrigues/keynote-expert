import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SLUG = "keynote-expert";
const BASE_PATH = `/${SLUG}/`;
const distDir = path.resolve(__dirname, `dist/${SLUG}`);
const htmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(htmlPath)) {
  console.log("HTML not found, skipping post-build");
  process.exit(0);
}

let html = fs.readFileSync(htmlPath, "utf-8");

// Ao contrário das páginas de tráfego, aqui o CSS é BLOQUEANTE de propósito.
// Isto é projetado ao vivo: um flash de conteúdo sem estilo na frente da
// plateia é pior que 80ms de atraso no primeiro paint. Então o post-build não
// mexe no <link rel="stylesheet">; ele só valida que os assets pesados
// existem e imprime o inventário de mídia pendente.
const assetsDir = path.join(distDir, "assets");
const files = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
const css = files.filter((f) => f.endsWith(".css"));
const media = files.filter((f) => /\.(mp4|webm|mov|png|jpe?g|webp|avif)$/i.test(f));

if (css.length === 0) {
  console.error("post-build: nenhum CSS no bundle, algo quebrou no build");
  process.exit(1);
}

// As fontes auto-hospedadas são o único ponto de falha que não aparece em dev
// (dev serve public/ direto). Se elas não chegaram no dist, a apresentação cai
// pra Georgia/system no meio do pitch. Falha o build em vez de avisar.
const fontsDir = path.join(distDir, "fonts");
const fonts = fs.existsSync(fontsDir) ? fs.readdirSync(fontsDir).filter((f) => f.endsWith(".woff2")) : [];
if (fonts.length === 0) {
  console.error("post-build: fontes woff2 não chegaram em dist/, a projeção cairia pro fallback");
  process.exit(1);
}

// Sanidade do base path: todo href/src do documento tem que estar sob /p/<slug>/.
const badRefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)]
  .map((m) => m[1])
  .filter((u) => !u.startsWith(BASE_PATH));
if (badRefs.length) {
  console.error(`post-build: refs fora do base /p/${SLUG}/:`, badRefs);
  process.exit(1);
}

// Este deck é 100% tipografia, ícone e motion: mídia zero é o esperado.
console.log(`✓ ${SLUG}: ${css.length} CSS, ${fonts.length} fontes`);
