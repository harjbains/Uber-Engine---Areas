const fs = require('fs');

let home = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

// 1. Fix date/time format in header to be side-by-side
const badDateTime = `<div class="datetime" style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1;">
            <div class="date-text" id="tv-date" style="font-size: 0.9rem; color: #8892a0;">Sat, 26 Sept 2026</div>
            <div class="time-text" id="tv-time" style="font-size: 1.6rem; font-weight: bold; color: white;">--:--</div>
        </div>`;
const goodDateTime = `<div class="datetime" style="display: flex; flex-direction: row; align-items: baseline; gap: 12px; line-height: 1;">
            <div class="date-text" id="tv-date" style="font-size: 1.1rem; color: #8892a0;">Sat, 26 Sept 2026</div>
            <div class="time-text" id="tv-time" style="font-size: 1.4rem; font-weight: bold; color: white;">--:--</div>
        </div>`;
home = home.replace(badDateTime, goodDateTime);

// 2. Center footer buttons and remove arrows
// Fix CSS
home = home.replace(/\.footer-btn \{ flex: 1; background: rgba\(20, 25, 35, 0\.85\); border: 1px solid rgba\(255,255,255,0\.1\); border-radius: 16px; display: flex; align-items: center; padding: 0 25px; cursor: pointer; transition: 0\.2s; box-shadow: 0 5px 15px rgba\(0,0,0,0\.3\); \}/, '.footer-btn { flex: 1; background: rgba(20, 25, 35, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0 20px; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }');

home = home.replace(/\.footer-icon \{ width: 40px; height: 40px; margin-right: 20px; display: flex; align-items: center; justify-content: center; \}/, '.footer-icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }');

home = home.replace(/\.footer-text \{ flex: 1; display: flex; flex-direction: column; justify-content: center; \}/, '.footer-text { display: flex; align-items: center; justify-content: center; }');

// Remove footer-arrow HTML
home = home.replace(/<div class="footer-arrow">&rsaquo;<\/div>/g, '');

// 3. Fix max-height issue with cards in tv-home.js
// Wait, I already fixed .cards-container height, let's make sure it doesn't wrap
// I'll bump to v2.9
home = home.replace(/>v2\.8<\/span>/g, '>v2.57</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', home);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.8/g, 'v=2.57');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.8/g, 'v=2.57');
fs.writeFileSync(appJsPath, appJs);

console.log('Home page layout 2 patched');
