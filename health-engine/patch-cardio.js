const fs = require('fs');

// 1. Global Footer Padding Fix
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');
css = css.replace(/padding: 0 40px;\s*box-sizing: border-box;\s*width: 100%;\s*z-index: 10;/, 'padding: 0 40px 10px 40px;\n    box-sizing: border-box;\n    width: 100%;\n    z-index: 10;');
css = css.replace(/height: clamp\(80px, 11dvh, 120px\);/, 'height: clamp(90px, 11dvh, 120px);');
fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);

// 2. Cardio Fixes
let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

// Title rename
cardio = cardio.replace(/<div class="tv-right-title">CARDIO WORKOUT<\/div>/, '<div class="tv-right-title">TREADMILL</div>');

// Controls wrap fix
cardio = cardio.replace(/\.controls-area \{ display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; \}/, '.controls-area { display: flex; gap: 15px; justify-content: center; flex-wrap: nowrap; margin-bottom: auto; }');

// Box width
cardio = cardio.replace(/\.control-box \{\s*width: 260px;\s*height: 350px;\s*border-radius: 20px;\s*padding: 25px 25px 20px 25px;/g, '.control-box {\n                    width: 195px;\n                    height: 250px;\n                    border-radius: 20px;\n                    padding: 15px;');

// Label font
cardio = cardio.replace(/\.ctrl-lbl \{ font-size: 0\.95rem; font-weight: 700; letter-spacing: 0\.5px; margin-bottom: 20px; color: white; text-align: center; \}/, '.ctrl-lbl { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; color: white; text-align: center; white-space: nowrap; }');

// Interactive container height
cardio = cardio.replace(/height: 230px;/g, 'height: 150px;');

// Value font
cardio = cardio.replace(/font-size: 4\.5rem;/g, 'font-size: 2.8rem;');

// Shorten Labels slightly to guarantee they fit
cardio = cardio.replace(/AVG SPEED \(KM\/H\)/, 'SPEED (KM/H)');
cardio = cardio.replace(/DURATION \(MIN\)/, 'DURATION');

cardio = cardio.replace(/>v2\.10<\/span>/g, '>v2.60</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

// Bump everything
const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.10/g, 'v=2.60');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.10/g, 'v=2.60');
fs.writeFileSync(appJsPath, appJs);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/>v2\.10<\/span>/g, '>v2.60</span>');
    fs.writeFileSync(file, fc);
});

console.log('Cardio patched');
