const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

code = code.replace(/\$\{iconDumbbell\}/g, '${iconMobility}');
code = code.replace(/>v2\.36<\/span>/g, '>v2.37</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', code);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.36/g, 'v=2.37');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.36/g, 'v=2.37');
fs.writeFileSync(appJsPath, appJs);
