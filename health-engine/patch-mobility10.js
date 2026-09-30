const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Add capsule styling to right-panel
mobility = mobility.replace(
    /\.right-panel \{ flex: 1; min-width: 0; max-width: calc\(100% - 225px\); position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; \}/g,
    '.right-panel { flex: 1; min-width: 0; max-width: calc(100% - 250px); position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; }'
);

// 2. Add gap to main-body tv-main to mimic strength spacing
mobility = mobility.replace(
    /<div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100%; min-width: 0; overflow: hidden; box-sizing: border-box;">/g,
    '<div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100%; min-width: 0; overflow: hidden; box-sizing: border-box; gap: 30px;">'
);
mobility = mobility.replace(
    /<div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box;">/g,
    '<div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box; gap: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);">'
);

// 3. Remove the margin-right from left-rail since we now use gap
mobility = mobility.replace(
    /\.left-rail \{ width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; margin-right: 5px; padding: 5px; border-right: 1px solid rgba\(255,255,255,0\.05\); box-sizing: border-box; \}/g,
    '.left-rail { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; margin-right: 0px; padding: 5px; border-right: none; box-sizing: border-box; }'
);

// Bump version
mobility = mobility.replace(/>v2\.26<\/span>/g, '>v2.57</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.26/g, 'v=2.57');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.26/g, 'v=2.57');
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
    fc = fc.replace(/>v2\.26<\/span>/g, '>v2.57</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility capsule styling added');
