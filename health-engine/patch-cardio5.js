const fs = require('fs');
let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

cardio = cardio.replace(/max-width: 160px;/g, 'max-width: 190px;');

cardio = cardio.replace(/\.ctrl-sub \{ font-size: 0\.55rem; color: #8892a0; margin-top: 6px; height: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; \}/, '.ctrl-sub { font-size: 0.65rem; color: #8892a0; margin-top: 6px; text-align: center; line-height: 1.2; }');

cardio = cardio.replace(/>v2\.15<\/span>/g, '>v2.47</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.15/g, 'v=2.47');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.15/g, 'v=2.47');
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
    fc = fc.replace(/>v2\.15<\/span>/g, '>v2.47</span>');
    fs.writeFileSync(file, fc);
});

console.log('Cardio ctrl-sub fixed');
