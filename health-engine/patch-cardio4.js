const fs = require('fs');
let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');

// 1. Controls Area constraints
cardio = cardio.replace(/\.controls-area \{ display: flex; gap: 15px; justify-content: center; flex-wrap: nowrap; margin-bottom: auto; \}/, '.controls-area { display: flex; gap: 10px; justify-content: center; flex-wrap: nowrap; margin-bottom: auto; width: 100%; max-width: 800px; }');

// 2. Control Box flex constraints
cardio = cardio.replace(/\.control-box \{\s*width: 125px;\s*height: 145px;/g, '.control-box {\n                    flex: 1;\n                    min-width: 0;\n                    max-width: 160px;\n                    height: 145px;');

// 3. Labels shorten
cardio = cardio.replace(/<div class="ctrl-lbl">DURATION<\/div>/, '<div class="ctrl-lbl">TIME<\/div>');
cardio = cardio.replace(/<div class="ctrl-lbl">DISTANCE \(KM\)<\/div>/, '<div class="ctrl-lbl">DIST (KM)<\/div>');
cardio = cardio.replace(/<div class="ctrl-lbl">SPEED \(KM\/H\)<\/div>/, '<div class="ctrl-lbl">SPD (KM/H)<\/div>');
cardio = cardio.replace(/<div class="ctrl-lbl">INCLINE \(%\)<\/div>/, '<div class="ctrl-lbl">INCLINE<\/div>');

// 4. Label overflow handling
cardio = cardio.replace(/\.ctrl-lbl \{\s*font-size: 0\.65rem;\s*font-weight: 700;\s*letter-spacing: 0\.5px;\s*margin-bottom: 6px;\s*color: white;\s*text-align: center;\s*white-space: nowrap;/g, '.ctrl-lbl {\n                    font-size: 0.65rem;\n                    font-weight: 700;\n                    letter-spacing: 0px;\n                    margin-bottom: 6px;\n                    color: white;\n                    text-align: center;\n                    white-space: nowrap;\n                    overflow: hidden;\n                    text-overflow: ellipsis;\n                    width: 100%;');

cardio = cardio.replace(/\.ctrl-val \{\s*background-color: #15243d;/g, '.ctrl-val {\n                    width: 100%;\n                    background-color: #15243d;');

// 5. Shrink sub labels as well
cardio = cardio.replace(/\.ctrl-sub \{ font-size: 0\.6rem; color: #8892a0; margin-top: 6px; height: 12px; \}/, '.ctrl-sub { font-size: 0.55rem; color: #8892a0; margin-top: 6px; height: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; }');


cardio = cardio.replace(/>v2\.14<\/span>/g, '>v2.53</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.14/g, 'v=2.53');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.14/g, 'v=2.53');
fs.writeFileSync(appJsPath, appJs);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/>v2\.14<\/span>/g, '>v2.53</span>');
    fs.writeFileSync(file, fc);
});

console.log('Cardio math fixed');
