const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Remove widths entirely from CSS block
mobility = mobility.replace(/\.btn-complete \{ background: #28a745; color: white; width: 100%; max-width: 400px; padding: 25px;/g, '.btn-complete { background: #28a745; color: white; width: auto; padding: 15px 30px;');
mobility = mobility.replace(/\.btn-start-purple \{ background: #8a2be2; color: white; width: 100%; max-width: 400px; padding: 25px;/g, '.btn-start-purple { background: #8a2be2; color: white; width: auto; padding: 15px 30px;');
mobility = mobility.replace(/\.btn-skip-sub \{ background: rgba\(0,0,0,0\.5\); border: 2px solid rgba\(255,255,255,0\.2\); color: white; max-width: 200px; padding: 25px;/g, '.btn-skip-sub { background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; width: auto; padding: 15px 30px;');

// 2. Add flex-wrap and limits to interaction-area div
mobility = mobility.replace(
    /id="interaction-area" style="flex-direction: row; justify-content: center; gap: 20px; background: transparent; padding: 0;"/g,
    'id="interaction-area" style="flex-direction: row; justify-content: center; background: transparent; padding: 0; width: 100%;"'
);

// Bump version
mobility = mobility.replace(/>v2\.21<\/span>/g, '>v2.61</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.21/g, 'v=2.61');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.21/g, 'v=2.61');
fs.writeFileSync(appJsPath, appJs);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/>v2\.21<\/span>/g, '>v2.61</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility CSS buttons purged of widths');
