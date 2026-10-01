const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Add flex-shrink: 0 to left-rail
mobility = mobility.replace(
    /\.left-rail \{ width: 260px; display: flex; flex-direction: column; gap: 8px; margin-right: 10px; padding: 10px; border-right: 1px solid rgba\(255,255,255,0\.05\); \}/g,
    '.left-rail { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; margin-right: 10px; padding: 10px; border-right: 1px solid rgba(255,255,255,0.05); }'
);

// 2. Reduce padding on main-body tv-main to gain 40px horizontal space
mobility = mobility.replace(
    /<div class="main-body tv-main">/g,
    '<div class="main-body tv-main" style="padding: 10px 20px;">'
);

// 3. Shrink the pill elements slightly more just in case
mobility = mobility.replace(
    /padding: 10px 15px; border-radius: 50px; border: 1px solid rgba\(138,43,226,0\.3\); box-shadow: 0 5px 20px rgba\(0,0,0,0\.8\); width: 100%; max-width: 650px; justify-content: space-between;/g,
    'padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 620px; justify-content: space-between;'
);

mobility = mobility.replace(
    /<div style="font-size: 0\.9rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1\.2rem;">/g,
    '<div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1.1rem;">'
);

mobility = mobility.replace(
    /font-size: 2\.5rem; font-weight: bold; font-family: monospace; width: auto; padding: 0 10px;/g,
    'font-size: 2.2rem; font-weight: bold; font-family: monospace; width: auto; padding: 0 5px;'
);

mobility = mobility.replace(
    /font-size: 2\.5rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">\$\{ex\.target_value\} <span style="font-size: 1\.2rem; color: #888;">REPS<\/span><\/div>/g,
    'font-size: 2.2rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 1rem; color: #888;">REPS</span></div>'
);

mobility = mobility.replace(
    /padding: 8px 16px; font-size: 0\.9rem;/g,
    'padding: 6px 12px; font-size: 0.8rem;'
);

// Bump version
mobility = mobility.replace(/>v2\.22<\/span>/g, '>v2.61</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.22/g, 'v=2.61');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.22/g, 'v=2.61');
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
    fc = fc.replace(/>v2\.22<\/span>/g, '>v2.61</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility sidebar flex-shrink locked and layout optimized');
