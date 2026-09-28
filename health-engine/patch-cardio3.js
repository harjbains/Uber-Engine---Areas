const fs = require('fs');
let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

// 1. Shrink control boxes width and height by 20%
cardio = cardio.replace(/\.control-box \{\s*width: 155px;\s*height: 180px;\s*border-radius: 16px;\s*padding: 10px;/g, '.control-box {\n                    width: 125px;\n                    height: 145px;\n                    border-radius: 12px;\n                    padding: 8px;');

// 2. Shrink interactive area
cardio = cardio.replace(/height: 100px;/g, 'height: 75px;');

// 3. Shrink font size for the value
cardio = cardio.replace(/font-size: 1\.8rem;/g, 'font-size: 1.4rem;');

// 4. Shrink arrow icons
cardio = cardio.replace(/width="20" height="20"/g, 'width="16" height="16"');

// 5. Adjust labels and increments
cardio = cardio.replace(/\.ctrl-lbl \{\s*font-size: 0\.75rem;\s*font-weight: 700;\s*letter-spacing: 0\.5px;\s*margin-bottom: 8px;/g, '.ctrl-lbl {\n                    font-size: 0.65rem;\n                    font-weight: 700;\n                    letter-spacing: 0.5px;\n                    margin-bottom: 6px;');
cardio = cardio.replace(/\.ctrl-sub \{ font-size: 0\.75rem; color: #8892a0; margin-top: 8px; height: 15px; \}/, '.ctrl-sub { font-size: 0.6rem; color: #8892a0; margin-top: 6px; height: 12px; }');

// 6. Shrink cancel container
cardio = cardio.replace(/\.bb-btn-end \{\s*background-color: #111827;\s*border-radius: 16px;\s*height: 70px;\s*padding: 0 25px;/g, '.bb-btn-end {\n                    background-color: #111827;\n                    border-radius: 12px;\n                    height: 52px;\n                    padding: 0 20px;');
cardio = cardio.replace(/\.bb-end-x \{ font-size: 2rem; font-weight: bold; \}/g, '.bb-end-x { font-size: 1.6rem; font-weight: bold; }');
cardio = cardio.replace(/\.bb-end-t1 \{ font-size: 1rem; font-weight: 700; letter-spacing: 1px; \}/g, '.bb-end-t1 { font-size: 0.9rem; font-weight: 700; letter-spacing: 1px; }');
cardio = cardio.replace(/\.bb-end-t2 \{ font-size: 0\.85rem; color: #8892a0; margin-top: 2px; \}/g, '.bb-end-t2 { font-size: 0.75rem; color: #8892a0; margin-top: 2px; }');

// Bump version
cardio = cardio.replace(/>v2\.13<\/span>/g, '>v2.55</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.13/g, 'v=2.55');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.13/g, 'v=2.55');
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
    fc = fc.replace(/>v2\.13<\/span>/g, '>v2.55</span>');
    fs.writeFileSync(file, fc);
});

console.log('Cardio layout fixed 3');
