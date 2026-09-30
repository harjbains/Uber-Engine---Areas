const fs = require('fs');

let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

// 1. Remove massive padding and redundant H1
cardio = cardio.replace(/padding: 60px;/g, 'padding: 10px 20px;');
cardio = cardio.replace(/<h1 class="exercise-name" style="text-align: center; margin-bottom: 50px;">TREADMILL RUN<\/h1>/, '');

// 2. Reduce margin on Save button and its size
cardio = cardio.replace(/margin-top: 60px;/g, 'margin-top: 20px;');
cardio = cardio.replace(/<button class="btn-complete" id="btn-record" style="width: 400px;">/, '<button class="btn-complete" id="btn-record" style="width: 300px; height: 60px; font-size: 1.2rem; border-radius: 12px; padding: 0;">');

// 3. Shrink control boxes width and height
cardio = cardio.replace(/\.control-box \{\s*width: 195px;\s*height: 250px;\s*border-radius: 20px;\s*padding: 15px;/g, '.control-box {\n                    width: 155px;\n                    height: 180px;\n                    border-radius: 16px;\n                    padding: 10px;');

// 4. Shrink interactive area
cardio = cardio.replace(/height: 150px;/g, 'height: 100px;');

// 5. Shrink font size for the value
cardio = cardio.replace(/font-size: 2\.8rem;/g, 'font-size: 1.8rem;');

// 6. Shrink arrow icons
cardio = cardio.replace(/width="28" height="28"/g, 'width="20" height="20"');

// 7. Adjust labels and increments
cardio = cardio.replace(/\.ctrl-lbl \{\s*font-size: 0\.85rem;\s*font-weight: 700;\s*letter-spacing: 0\.5px;\s*margin-bottom: 12px;/g, '.ctrl-lbl {\n                    font-size: 0.75rem;\n                    font-weight: 700;\n                    letter-spacing: 0.5px;\n                    margin-bottom: 8px;');
cardio = cardio.replace(/\.ctrl-sub \{ font-size: 0\.85rem; color: #d1d5db; margin-top: 15px; height: 20px; \}/, '.ctrl-sub { font-size: 0.75rem; color: #8892a0; margin-top: 8px; height: 15px; }');


// Bump version to 2.13
cardio = cardio.replace(/>v2\.12<\/span>/g, '>v2.60</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

// Bump everything
const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.12/g, 'v=2.60');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.12/g, 'v=2.60');
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
    fc = fc.replace(/>v2\.12<\/span>/g, '>v2.60</span>');
    fs.writeFileSync(file, fc);
});

console.log('Cardio layout fixed');
