const fs = require('fs');

let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// The exact string in the file
const badDiv = `<div style="background: #0b101e;  display: flex; flex-direction: column; color: white; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden;">`;
code = code.replace(badDiv, '<div class="app-container tv-shell">');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', code);
console.log('Fixed wrapper');

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/>v2\.2<\/span>/g, '>v2.53</span>');
    fs.writeFileSync(file, fc);
});

let indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.2/g, 'v=2.53');
fs.writeFileSync(indexHtmlPath, indexHtml);
