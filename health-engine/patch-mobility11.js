const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Force the interactive pill to shrink to max-content and center itself
mobility = mobility.replace(
    /width: 100%; max-width: 580px; justify-content: space-between; gap: 5px; box-sizing: border-box;/g,
    'width: max-content; justify-content: center; gap: 8px; box-sizing: border-box; margin: 0 auto;'
);

// 2. Add an explicit SVG resize rule to stop the massive icons from stretching the buttons
mobility = mobility.replace(
    /<\/style>/g,
    '  .btn-start-purple svg, .btn-complete svg, .btn-skip-sub svg { width: 20px !important; height: 20px !important; }\n</style>'
);

// 3. Ensure controls-area doesn't stretch children
mobility = mobility.replace(
    /\.controls-area \{ display: flex; gap: 20px; align-items: stretch; margin-top: auto; \}/g,
    '.controls-area { display: flex; gap: 20px; align-items: center; justify-content: center; width: 100%; margin-top: auto; }'
);

// 4. Force strict hidden overflow on main body again just in case
mobility = mobility.replace(
    /<div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100%; min-width: 0; overflow: hidden; box-sizing: border-box; gap: 30px;">/g,
    '<div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100vw; min-width: 0; overflow: hidden; box-sizing: border-box; gap: 30px;">'
);

// Bump version
mobility = mobility.replace(/>v2\.27<\/span>/g, '>v2.51</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.27/g, 'v=2.51');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.27/g, 'v=2.51');
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
    fc = fc.replace(/>v2\.27<\/span>/g, '>v2.51</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility capsule size patched');
