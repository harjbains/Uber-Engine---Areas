const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Fix sidebar font sizes
mobility = mobility.replace(
    /\.rail-title \{ font-size: 1\.05rem;/g,
    '.rail-title { font-size: 0.9rem;'
);
mobility = mobility.replace(
    /\.rail-sub \{ font-size: 0\.8rem;/g,
    '.rail-sub { font-size: 0.7rem;'
);
mobility = mobility.replace(
    /\.rail-img \{ width: 64px; height: 48px; border-radius: 6px; object-fit: cover; margin-right: 15px;/g,
    '.rail-img { width: 48px; height: 36px; border-radius: 6px; object-fit: cover; margin-right: 10px;'
);
mobility = mobility.replace(
    /\.rail-num \{ width: 32px; height: 32px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0\.9rem; margin-right: 15px; \}/g,
    '.rail-num { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.7rem; margin-right: 10px; }'
);

// 2. Add box-sizing: border-box to all relevant flex containers to prevent padding blow-out
mobility = mobility.replace(
    /\.rp-content \{ position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; padding: 20px; justify-content: flex-end; align-items: center; \}/g,
    '.rp-content { position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; padding: 20px; justify-content: flex-end; align-items: center; box-sizing: border-box; }'
);
mobility = mobility.replace(
    /width: 100%; max-width: 620px; justify-content: space-between;"/g,
    'width: 100%; max-width: 620px; justify-content: space-between; box-sizing: border-box;"'
);

// Bump version
mobility = mobility.replace(/>v2\.23<\/span>/g, '>v2.48</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.23/g, 'v=2.48');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.23/g, 'v=2.48');
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
    fc = fc.replace(/>v2\.23<\/span>/g, '>v2.48</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility sidebar fonts shrunk and right panel box-sizing enforced');
