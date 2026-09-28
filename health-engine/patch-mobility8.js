const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. LEFT RAIL COMPACTION
// Shrink left-rail width and padding
mobility = mobility.replace(
    /\.left-rail \{ width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; margin-right: 10px; padding: 10px; border-right: 1px solid rgba\(255,255,255,0\.05\); \}/g,
    '.left-rail { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; margin-right: 5px; padding: 5px; border-right: 1px solid rgba(255,255,255,0.05); box-sizing: border-box; }'
);
// Shrink rail-item padding
mobility = mobility.replace(
    /\.rail-item \{ display: flex; align-items: center; padding: 8px 12px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba\(255,255,255,0\.02\); height: 60px; \}/g,
    '.rail-item { display: flex; align-items: center; padding: 6px 8px; border-radius: 10px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 50px; box-sizing: border-box; }'
);
// Shrink rail-num margins and size
mobility = mobility.replace(
    /\.rail-num \{ width: 24px; height: 24px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0\.7rem; margin-right: 10px; \}/g,
    '.rail-num { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.65rem; margin-right: 5px; flex-shrink: 0; }'
);
// Shrink rail-img margins and size
mobility = mobility.replace(
    /\.rail-img \{ width: 48px; height: 36px; border-radius: 6px; object-fit: cover; margin-right: 10px;/g,
    '.rail-img { width: 40px; height: 30px; border-radius: 6px; object-fit: cover; margin-right: 8px; flex-shrink: 0;'
);
// Shrink rail-title and rail-sub fonts
mobility = mobility.replace(
    /\.rail-title \{ font-size: 0\.9rem;/g,
    '.rail-title { font-size: 0.75rem;'
);
mobility = mobility.replace(
    /\.rail-sub \{ font-size: 0\.7rem;/g,
    '.rail-sub { font-size: 0.6rem;'
);

// 2. PREVENT FLEX BLOWOUT ON RIGHT PANEL
mobility = mobility.replace(
    /\.right-panel \{ flex: 1; position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; \}/g,
    '.right-panel { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; background: #050810; overflow: hidden; box-sizing: border-box; }'
);
// Ensure main-body tv-main doesn't blow out
mobility = mobility.replace(
    /<div class="main-body tv-main" style="padding: 10px 20px;">/g,
    '<div class="main-body tv-main" style="padding: 10px 20px; min-width: 0; box-sizing: border-box;">'
);

// 3. AGGRESSIVELY COMPACT THE INTERACTIVE PILL
// Shrink pill container padding/gap
mobility = mobility.replace(
    /padding: 8px 15px; border-radius: 50px; border: 1px solid rgba\(138,43,226,0\.3\); box-shadow: 0 5px 20px rgba\(0,0,0,0\.8\); width: 100%; max-width: 620px; justify-content: space-between; box-sizing: border-box;/g,
    'padding: 5px 10px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 580px; justify-content: space-between; gap: 5px; box-sizing: border-box;'
);
// Shrink SET text
mobility = mobility.replace(
    /<div style="font-size: 0\.8rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1\.1rem;">/g,
    '<div style="font-size: 0.7rem; font-weight: bold; color: #aaa; letter-spacing: 0px; white-space: nowrap;">SET <span style="color: #8a2be2; font-size: 1rem;">'
);
mobility = mobility.replace(
    /<\/span> OF \$\{ex\.sets\} <span style="color: white; margin-left: 6px;">\$\{sideText\}<\/span><\/div>/g,
    '</span> OF ${ex.sets} <span style="color: white; margin-left: 3px;">${sideText}</span></div>'
);
// Shrink timer/reps text
mobility = mobility.replace(
    /font-size: 2\.2rem; font-weight: bold; font-family: monospace; width: auto; padding: 0 5px;/g,
    'font-size: 1.8rem; font-weight: bold; font-family: monospace; width: auto; padding: 0;'
);
mobility = mobility.replace(
    /font-size: 2\.2rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">\$\{ex\.target_value\} <span style="font-size: 1rem; color: #888;">REPS<\/span><\/div>/g,
    'font-size: 1.8rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 0.8rem; color: #888;">REPS</span></div>'
);
// Shrink buttons
mobility = mobility.replace(
    /padding: 6px 12px; font-size: 0\.8rem;/g,
    'padding: 5px 10px; font-size: 0.7rem;'
);

// Bump version
mobility = mobility.replace(/>v2\.24<\/span>/g, '>v2.48</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.24/g, 'v=2.48');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.24/g, 'v=2.48');
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
    fc = fc.replace(/>v2\.24<\/span>/g, '>v2.48</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility left-rail compacted, right-panel min-width set to 0, pill aggressive compaction applied');
