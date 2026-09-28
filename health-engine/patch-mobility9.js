const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Force tv-main to NEVER exceed 100% width and to hide overflow
mobility = mobility.replace(
    /<div class="main-body tv-main" style="padding: 10px 20px; min-width: 0; box-sizing: border-box;">/g,
    '<div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100%; min-width: 0; overflow: hidden; box-sizing: border-box;">'
);
mobility = mobility.replace(
    /<div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%;">/g,
    '<div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box;">'
);

// 2. Force right-panel to strictly calculate its width as calc(100% - left-rail width)
// The left rail is 220px width + 5px margin-right + 5px padding = 230px space total?
// Wait, left-rail is box-sizing: border-box; width: 220px; margin-right: 5px;
// So it takes exactly 225px.
// If tv-main flex layout fails to restrict right-panel, we can explicitly cap it:
mobility = mobility.replace(
    /\.right-panel \{ flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; \}/g,
    '.right-panel { flex: 1; min-width: 0; max-width: calc(100% - 225px); position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; }'
);

// Bump version
mobility = mobility.replace(/>v2\.25<\/span>/g, '>v2.48</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.25/g, 'v=2.48');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.25/g, 'v=2.48');
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
    fc = fc.replace(/>v2\.25<\/span>/g, '>v2.48</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility tv-main and right-panel max-width enforced');
