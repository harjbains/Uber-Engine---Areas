const fs = require('fs');

let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

// Remove the erroneous width: 100% from ctrl-val
cardio = cardio.replace(/\.ctrl-val \{\s*width: 100%;\s*background-color: #15243d;/g, '.ctrl-val {\n                    background-color: #15243d;');

cardio = cardio.replace(/>v2\.16<\/span>/g, '>v2.54</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.16/g, 'v=2.54');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.16/g, 'v=2.54');
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
    fc = fc.replace(/>v2\.16<\/span>/g, '>v2.54</span>');
    fs.writeFileSync(file, fc);
});

console.log('Fixed ctrl-val width overflow');
