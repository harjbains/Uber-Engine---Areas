const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Time Mode fixes
mobility = mobility.replace(
    /<div style="display: flex; align-items: center; gap: 20px; background: rgba\(11,16,30,0\.95\); padding: 15px 40px; border-radius: 100px; border: 1px solid rgba\(138,43,226,0\.3\); box-shadow: 0 10px 40px rgba\(0,0,0,0\.8\);">/,
    '<div style="display: flex; align-items: center; gap: 15px; background: rgba(11,16,30,0.95); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8);">'
);
mobility = mobility.replace(
    /<div style="font-size: 1\.2rem; font-weight: bold; color: #aaa; letter-spacing: 2px;">SET <span style="color: #8a2be2; font-size: 1\.8rem;">\$\{state\.currentSet\}<\/span> OF \$\{ex\.sets\} <span style="color: white; margin-left: 10px;">\$\{sideText\}<\/span><\/div>/,
    '<div style="font-size: 0.9rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1.2rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 6px;">${sideText}</span></div>'
);
mobility = mobility.replace(
    /<div style="font-size: 4rem; font-weight: bold; font-family: monospace; width: 160px; text-align: center; color: white; line-height: 1;" id="active-timer">/,
    '<div style="font-size: 2.5rem; font-weight: bold; font-family: monospace; width: 100px; text-align: center; color: white; line-height: 1;" id="active-timer">'
);
mobility = mobility.replace(
    /<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 15px 40px; font-size: 1\.5rem; border-radius: 50px; box-shadow: none;">\$\{iconClock\} START TIMER<\/button>/,
    '<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; box-shadow: none;">${iconClock} START TIMER</button>'
);
mobility = mobility.replace(
    /<button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 15px 30px; font-size: 1\.2rem; border-radius: 50px;">SKIP<\/button>/,
    '<button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px;">SKIP</button>'
);
mobility = mobility.replace(
    /\? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; padding: 15px 30px; font-size: 1\.2rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; max-width: none;">HOW TO<\/button>` : ''/g,
    '? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; max-width: none;">HOW TO</button>` : \'\''
);

// 2. Reps Mode fixes (since the first replace only replaced the first occurrence)
mobility = mobility.replace(
    /<div style="display: flex; align-items: center; gap: 20px; background: rgba\(11,16,30,0\.95\); padding: 15px 40px; border-radius: 100px; border: 1px solid rgba\(138,43,226,0\.3\); box-shadow: 0 10px 40px rgba\(0,0,0,0\.8\);">/,
    '<div style="display: flex; align-items: center; gap: 15px; background: rgba(11,16,30,0.95); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8);">'
);
mobility = mobility.replace(
    /<div style="font-size: 1\.2rem; font-weight: bold; color: #aaa; letter-spacing: 2px;">SET <span style="color: #8a2be2; font-size: 1\.8rem;">\$\{state\.currentSet\}<\/span> OF \$\{ex\.sets\} <span style="color: white; margin-left: 10px;">\$\{sideText\}<\/span><\/div>/,
    '<div style="font-size: 0.9rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1.2rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 6px;">${sideText}</span></div>'
);
mobility = mobility.replace(
    /<div style="font-size: 4rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">\$\{ex\.target_value\} <span style="font-size: 2rem; color: #888;">REPS<\/span><\/div>/,
    '<div style="font-size: 2.5rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 1.2rem; color: #888;">REPS</span></div>'
);
mobility = mobility.replace(
    /<button class="btn-complete" id="btn-done" style="margin: 0; padding: 15px 40px; font-size: 1\.5rem; border-radius: 50px; box-shadow: none;">\$\{iconCheck\} COMPLETE SET<\/button>/,
    '<button class="btn-complete" id="btn-done" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; box-shadow: none;">${iconCheck} COMPLETE SET</button>'
);

// Bump version
mobility = mobility.replace(/>v2\.19<\/span>/g, '>v2.54</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.19/g, 'v=2.54');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.19/g, 'v=2.54');
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
    fc = fc.replace(/>v2\.19<\/span>/g, '>v2.54</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility interaction pill shrunk');
