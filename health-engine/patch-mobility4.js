const fs = require('fs');
let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// Overwrite the inline styles of the pill to force width boundaries
mobility = mobility.replace(
    /<div style="display: flex; align-items: center; gap: 15px; background: rgba\(11,16,30,0\.95\); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba\(138,43,226,0\.3\); box-shadow: 0 5px 20px rgba\(0,0,0,0\.8\);">/g,
    '<div style="display: flex; align-items: center; gap: 10px; background: rgba(11,16,30,0.95); padding: 10px 15px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 650px; justify-content: space-between;">'
);

// Overwrite START TIMER button
mobility = mobility.replace(
    /<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; box-shadow: none;">\$\{iconClock\} START TIMER<\/button>/g,
    '<button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 8px 16px; font-size: 0.9rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">${iconClock} START</button>'
);

// Overwrite COMPLETE SET button
mobility = mobility.replace(
    /<button class="btn-complete" id="btn-done" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; box-shadow: none;">\$\{iconCheck\} COMPLETE SET<\/button>/g,
    '<button class="btn-complete" id="btn-done" style="margin: 0; padding: 8px 16px; font-size: 0.9rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">${iconCheck} COMPLETE</button>'
);

// Overwrite SKIP button
mobility = mobility.replace(
    /<button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px;">SKIP<\/button>/g,
    '<button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 8px 16px; font-size: 0.9rem; border-radius: 50px; width: auto; max-width: none;">SKIP</button>'
);

// Overwrite HOW TO button
mobility = mobility.replace(
    /id="btn-howto" style="margin: 0; padding: 10px 20px; font-size: 1rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; max-width: none;">HOW TO<\/button>/g,
    'id="btn-howto" style="margin: 0; padding: 8px 16px; font-size: 0.9rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>'
);

// Overwrite timer width
mobility = mobility.replace(
    /width: 100px;/g,
    'width: auto; padding: 0 10px;'
);

// Fix .interaction-area container to allow width bounded by right panel
mobility = mobility.replace(
    /<div class="submit-area" id="interaction-area" style="flex-direction: row; justify-content: center; gap: 30px; background: transparent; padding: 0;">/g,
    '<div class="submit-area" id="interaction-area" style="flex-direction: row; justify-content: center; background: transparent; padding: 0; width: 100%;">'
);

// Bump version
mobility = mobility.replace(/>v2\.20<\/span>/g, '>v2.47</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.20/g, 'v=2.47');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.20/g, 'v=2.47');
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
    fc = fc.replace(/>v2\.20<\/span>/g, '>v2.47</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility interaction pill strictly bound');
