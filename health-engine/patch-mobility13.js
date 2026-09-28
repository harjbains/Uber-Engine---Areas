const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. LEFT RAIL COMPACTION (Down to 300px, smaller fonts/images)
mobility = mobility.replace(
    /\.left-rail \{ width: 380px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; \}/g,
    '.left-rail { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }'
);
mobility = mobility.replace(
    /\.rail-item \{ display: flex; align-items: center; padding: 10px 15px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba\(255,255,255,0\.02\); height: 80px; box-sizing: border-box; \}/g,
    '.rail-item { display: flex; align-items: center; padding: 8px 10px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 60px; box-sizing: border-box; }'
);
mobility = mobility.replace(
    /\.rail-num \{ width: 40px; height: 40px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1\.1rem; margin-right: 15px; flex-shrink: 0; \}/g,
    '.rail-num { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; margin-right: 10px; flex-shrink: 0; }'
);
mobility = mobility.replace(
    /\.rail-img \{ width: 80px; height: 50px; border-radius: 6px; object-fit: cover; margin-right: 15px; flex-shrink: 0;/g,
    '.rail-img { width: 60px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 10px; flex-shrink: 0;'
);
mobility = mobility.replace(
    /\.rail-title \{ font-size: 1\.05rem;/g,
    '.rail-title { font-size: 0.9rem;'
);
mobility = mobility.replace(
    /\.rail-sub \{ font-size: 0\.85rem;/g,
    '.rail-sub { font-size: 0.75rem;'
);

// 2. ADJUST RIGHT-PANEL (calc to account for 300px left rail + 30px gap = 330px)
mobility = mobility.replace(
    /max-width: calc\(100% - 410px\);/g,
    'max-width: calc(100% - 330px);'
);

// 3. PILL COMPACTION & NO-WRAP
mobility = mobility.replace(
    /width: 100%; max-width: 450px; flex-wrap: wrap; justify-content: center; gap: 10px; box-sizing: border-box; margin: 0 auto;/g,
    'width: max-content; flex-wrap: nowrap; justify-content: center; gap: 8px; box-sizing: border-box; margin: 0 auto;'
);

// 4. FIX BUTTON SIZES IN CSS INSTEAD OF INLINE
mobility = mobility.replace(
    /\.btn-start-purple \{ background: #8a2be2; color: white; width: auto; padding: 15px 30px; border-radius: 16px; font-size: 2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 15px; transition: 0\.2s; box-shadow: 0 5px 20px rgba\(138, 43, 226, 0\.4\); \}/g,
    '.btn-start-purple { background: #8a2be2; color: white; width: auto; padding: 6px 12px; border-radius: 16px; font-size: 0.9rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4); box-sizing: border-box; }'
);
mobility = mobility.replace(
    /\.btn-skip-sub \{ background: rgba\(0,0,0,0\.5\); border: 2px solid rgba\(255,255,255,0\.2\); color: white; width: auto; padding: 15px 30px; border-radius: 16px; font-size: 1\.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0\.2s; \}/g,
    '.btn-skip-sub { background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; width: auto; padding: 6px 12px; border-radius: 16px; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-sizing: border-box; }'
);

// 5. REMOVE INLINE INFLATION ON BUTTONS
mobility = mobility.replace(
    /<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 5px 10px; font-size: 0\.7rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">\$\{iconClock\} START<\/button>/g,
    '<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; border-radius: 50px; box-shadow: none; width: auto; max-width: none; white-space: nowrap;">${iconClock} START</button>'
);
mobility = mobility.replace(
    /<button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 5px 10px; font-size: 0\.7rem; border-radius: 50px; width: auto; max-width: none;">SKIP<\/button>/g,
    '<button class="btn-skip-sub" id="btn-done" style="margin: 0; border-radius: 50px; width: auto; max-width: none; white-space: nowrap;">SKIP</button>'
);
mobility = mobility.replace(
    /\$\{ex\.name\.toLowerCase\(\)\.includes\('adductor'\) \? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; padding: 5px 10px; font-size: 0\.7rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO<\/button>` : ''\}/g,
    '${ex.name.toLowerCase().includes(\'adductor\') ? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>` : \'\'}'
);

// 6. TIGHTEN SET TEXT & TIMER
mobility = mobility.replace(
    /<div style="font-size: 0\.7rem; font-weight: bold; color: #aaa; letter-spacing: 0px; white-space: nowrap;">SET <span style="color: #8a2be2; font-size: 1rem;">/g,
    '<div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 0px; white-space: nowrap;">SET <span style="color: #8a2be2; font-size: 1rem;">'
);
mobility = mobility.replace(
    /<div style="font-size: 1\.8rem; font-weight: bold; font-family: monospace; width: auto; padding: 0; text-align: center; color: white; line-height: 1;" id="active-timer">/g,
    '<div style="font-size: 1.5rem; font-weight: bold; font-family: monospace; width: auto; padding: 0; text-align: center; color: white; line-height: 1;" id="active-timer">'
);
mobility = mobility.replace(
    /<div style="font-size: 1\.8rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">\$\{ex\.target_value\} <span style="font-size: 0\.8rem; color: #888;">REPS<\/span><\/div>/g,
    '<div style="font-size: 1.5rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 0.8rem; color: #888;">REPS</span></div>'
);

// Bump version
mobility = mobility.replace(/>v2\.29<\/span>/g, '>v2.51</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.29/g, 'v=2.51');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.29/g, 'v=2.51');
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
    fc = fc.replace(/>v2\.29<\/span>/g, '>v2.51</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility UI compactification executed');
