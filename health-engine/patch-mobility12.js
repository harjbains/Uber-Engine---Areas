const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. RESTORE EXACT STRENGTH.JS LEFT-RAIL DIMENSIONS
mobility = mobility.replace(
    /\.left-rail \{ width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; margin-right: 0px; padding: 5px; border-right: none; box-sizing: border-box; \}/g,
    '.left-rail { width: 380px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }'
);
mobility = mobility.replace(
    /\.rail-item \{ display: flex; align-items: center; padding: 6px 8px; border-radius: 10px; background-color: #0b111e; border: 1px solid rgba\(255,255,255,0\.02\); height: 50px; box-sizing: border-box; \}/g,
    '.rail-item { display: flex; align-items: center; padding: 10px 15px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 80px; box-sizing: border-box; }'
);
mobility = mobility.replace(
    /\.rail-num \{ width: 20px; height: 20px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0\.65rem; margin-right: 5px; flex-shrink: 0; \}/g,
    '.rail-num { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; margin-right: 15px; flex-shrink: 0; }'
);
mobility = mobility.replace(
    /\.rail-img \{ width: 40px; height: 30px; border-radius: 6px; object-fit: cover; margin-right: 8px; flex-shrink: 0;/g,
    '.rail-img { width: 80px; height: 50px; border-radius: 6px; object-fit: cover; margin-right: 15px; flex-shrink: 0;'
);
mobility = mobility.replace(
    /\.rail-title \{ font-size: 0\.75rem;/g,
    '.rail-title { font-size: 1.05rem;'
);
mobility = mobility.replace(
    /\.rail-sub \{ font-size: 0\.6rem;/g,
    '.rail-sub { font-size: 0.85rem;'
);

// 2. Adjust right-panel calc to use 380px left-rail
mobility = mobility.replace(
    /max-width: calc\(100% - 250px\);/g,
    'max-width: calc(100% - 410px);'
);

// 3. Make interactive pill wrap and heavily constraint width so it CANNOT overflow
mobility = mobility.replace(
    /width: max-content; justify-content: center; gap: 8px; box-sizing: border-box; margin: 0 auto;/g,
    'width: 100%; max-width: 450px; flex-wrap: wrap; justify-content: center; gap: 10px; box-sizing: border-box; margin: 0 auto;'
);

// Bump version
mobility = mobility.replace(/>v2\.28<\/span>/g, '>v2.42</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.28/g, 'v=2.42');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.28/g, 'v=2.42');
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
    fc = fc.replace(/>v2\.28<\/span>/g, '>v2.42</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility sidebar matched to strength, pill wrapping enforced');
