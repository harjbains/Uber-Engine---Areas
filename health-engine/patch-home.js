const fs = require('fs');

// 1. Update CSS
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');
css = css.replace(/\.tv-header \{\s*height: 90px;/g, '.tv-header {\n    height: 64px;');
css = css.replace(/\.tv-footer \{\s*height: clamp\(90px, 13dvh, 140px\);/g, '.tv-footer {\n    height: clamp(80px, 11dvh, 120px);');
fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);

// 2. Update tv-home.js
let home = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

// Remove settings icon and divider
home = home.replace(/<div style="width: 1px; height: 30px; background: rgba\(255,255,255,0\.2\);"><\/div>\s*<button id="btn-admin-top"[\s\S]*?<\/button>/, '');

// Remove footer descriptions
home = home.replace(/<p class="footer-subtitle">.*?<\/p>/g, '');

// Fix footer title spacing since it's now alone
home = home.replace(/\.footer-title \{ font-size: 1\.2rem; font-weight: bold; margin: 0 0 4px 0; \}/, '.footer-title { font-size: 1.4rem; font-weight: bold; margin: 0; }');

// Ensure cards don't overflow vertically pushing footer off screen
home = home.replace(/\.cards-container \{ display: flex; gap: 30px; flex: 1; align-items: stretch; margin-top: auto; margin-bottom: auto; max-height: 600px; \}/, '.cards-container { display: flex; gap: 30px; flex: 1; align-items: stretch; margin-top: auto; margin-bottom: auto; max-height: 100%; min-height: 0; }');

// Bump cache to v2.8
home = home.replace(/>v2\.7<\/span>/g, '>v2.61</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', home);

// Bump cache to v2.8
const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.7/g, 'v=2.61');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.7/g, 'v=2.61');
fs.writeFileSync(appJsPath, appJs);

console.log('Home page layout patched');
