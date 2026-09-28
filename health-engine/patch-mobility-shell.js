const fs = require('fs');

let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

code = code.replace(/<div class="app-container">/g, '<div class="app-container tv-shell">');
code = code.replace(/<header class="top-bar">/g, '<header class="top-bar tv-header">');
code = code.replace(/<div class="main-body">/g, '<div class="main-body tv-main">');
code = code.replace(/<div class="main-body" style="/g, '<div class="main-body tv-main" style="');
code = code.replace(/<footer class="bottom-bar">/g, '<footer class="bottom-bar tv-footer">');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', code);

// Bump version 
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
    fc = fc.replace(/>v1\.9<\/span>/g, '>v2.47</span>');
    fs.writeFileSync(file, fc);
});

let indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=1\.9/g, 'v=2.47');
fs.writeFileSync(indexHtmlPath, indexHtml);
