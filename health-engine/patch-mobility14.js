const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. REVERT LEFT-RAIL TO EXACTLY MATCH STRENGTH (380px)
mobility = mobility.replace(
    /\.left-rail \{ width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; \}/g,
    '.left-rail { width: 380px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }'
);
mobility = mobility.replace(
    /\.rail-item \{ display: flex; align-items: center; padding: 8px 10px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba\(255,255,255,0\.02\); height: 60px; box-sizing: border-box; \}/g,
    '.rail-item { display: flex; align-items: center; padding: 10px 15px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 80px; box-sizing: border-box; }'
);
mobility = mobility.replace(
    /\.rail-num \{ width: 30px; height: 30px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0\.85rem; margin-right: 10px; flex-shrink: 0; \}/g,
    '.rail-num { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; margin-right: 15px; flex-shrink: 0; }'
);
mobility = mobility.replace(
    /\.rail-img \{ width: 60px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; flex-shrink: 0;/g,
    '.rail-img { width: 80px; height: 50px; border-radius: 6px; object-fit: cover; margin-right: 15px; flex-shrink: 0;'
);
mobility = mobility.replace(
    /\.rail-title \{ font-size: 0\.9rem;/g,
    '.rail-title { font-size: 1.05rem;'
);
mobility = mobility.replace(
    /\.rail-sub \{ font-size: 0\.75rem;/g,
    '.rail-sub { font-size: 0.85rem;'
);

// 2. ADJUST RIGHT-PANEL (calc to account for 380px left rail + 30px gap = 410px)
mobility = mobility.replace(
    /max-width: calc\(100% - 330px\);/g,
    'max-width: calc(100% - 410px);'
);

// 3. PILL COMPACTION - MUST BE BULLETPROOF
// Use width: 100%; max-width: 480px; so it never exceeds right-panel's available space, but centers itself perfectly.
// Force inner children to shrink by adding min-width: 0 to flex children where needed.
mobility = mobility.replace(
    /width: max-content; flex-wrap: nowrap; justify-content: center; gap: 8px; box-sizing: border-box; margin: 0 auto;/g,
    'width: 100%; max-width: 440px; flex-wrap: nowrap; justify-content: space-evenly; gap: 4px; box-sizing: border-box; margin: 0 auto; overflow: hidden;'
);

// 4. MORE AGGRESSIVE BUTTON SHRINKING
mobility = mobility.replace(
    /\.btn-start-purple \{ background: #8a2be2; color: white; width: auto; padding: 6px 12px; border-radius: 16px; font-size: 0\.9rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0\.2s; box-shadow: 0 5px 20px rgba\(138, 43, 226, 0\.4\); box-sizing: border-box; \}/g,
    '.btn-start-purple { background: #8a2be2; color: white; width: auto; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 4px; transition: 0.2s; box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4); box-sizing: border-box; flex-shrink: 1; min-width: 0; }'
);
mobility = mobility.replace(
    /\.btn-skip-sub \{ background: rgba\(0,0,0,0\.5\); border: 2px solid rgba\(255,255,255,0\.2\); color: white; width: auto; padding: 6px 12px; border-radius: 16px; font-size: 0\.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0\.2s; box-sizing: border-box; \}/g,
    '.btn-skip-sub { background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; width: auto; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-sizing: border-box; flex-shrink: 1; min-width: 0; }'
);

// Shink injected SVG icons to 14px
mobility = mobility.replace(
    /\.btn-start-purple svg, \.btn-complete svg, \.btn-skip-sub svg \{ width: 20px !important; height: 20px !important; \}/g,
    '.btn-start-purple svg, .btn-complete svg, .btn-skip-sub svg { width: 14px !important; height: 14px !important; flex-shrink: 0; }'
);

// Bump version
mobility = mobility.replace(/>v2\.30<\/span>/g, '>v2.52</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.30/g, 'v=2.52');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.30/g, 'v=2.52');
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
    fc = fc.replace(/>v2\.30<\/span>/g, '>v2.52</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility matched to strength and pill hard-constrained');
