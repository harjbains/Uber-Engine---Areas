const fs = require('fs');

let tvEmuJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\tv-emu.js', 'utf8');

// Replace 1920 with 960 and 1080 with 480
tvEmuJs = tvEmuJs.replace(/1920/g, '960');
tvEmuJs = tvEmuJs.replace(/1080/g, '480');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\tv-emu.js', tvEmuJs);

let diagJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\diagnostics.js', 'utf8');
diagJs = diagJs.replace(/1920px/g, '960px');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\diagnostics.js', diagJs);

console.log('TV Emulation updated to 960x480');

// Bump cache to v2.6
let indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.5/g, 'v=2.6');
fs.writeFileSync(indexHtmlPath, indexHtml);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js',
    'C:\\DEV\\health-engine\\js\\app.js'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/v=2\.5/g, 'v=2.6'); // for app.js imports
    fc = fc.replace(/>v2\.5<\/span>/g, '>v2.6</span>'); // for titles
    fs.writeFileSync(file, fc);
});

console.log('Versions bumped to v2.6');
