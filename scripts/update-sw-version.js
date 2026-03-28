/**
 * scripts/update-sw-version.js
 * 
 * Se ejecuta automáticamente antes de cada `npm run build` (script "prebuild").
 * Reemplaza el CACHE_NAME en public/sw.js con un ID único basado en el timestamp
 * del build, de forma que el browser detecta un SW nuevo en cada deploy y
 * actualiza el caché automáticamente.
 */

const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '../public/sw.js');

// ID corto y legible basado en el timestamp del build (e.g. "m3k9z")
const buildId = Date.now().toString(36);

let content = fs.readFileSync(swPath, 'utf8');

// Reemplaza cualquier versión anterior del CACHE_NAME
const updated = content.replace(
  /const CACHE_NAME = 'leiham-[^']*';/,
  `const CACHE_NAME = 'leiham-${buildId}';`
);

if (updated === content) {
  console.warn('⚠️  No se encontró CACHE_NAME en sw.js para actualizar.');
} else {
  fs.writeFileSync(swPath, updated);
  console.log(`✓  SW cache version actualizado → leiham-${buildId}`);
}
