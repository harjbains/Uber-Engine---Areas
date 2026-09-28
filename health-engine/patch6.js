const fs = require('fs');

// 1. Update index.html for cache busting
let indexHTML = fs.readFileSync('C:\\DEV\\health-engine\\index.html', 'utf8');
indexHTML = indexHTML.replace(/src="js\/app\.js[^"]*"/, 'src="js/app.js?v=1.2"');
indexHTML = indexHTML.replace(/href="css\/styles\.css[^"]*"/, 'href="css/styles.css?v=1.2"');
fs.writeFileSync('C:\\DEV\\health-engine\\index.html', indexHTML);
console.log('Cache busting appended to index.html');

// 2. Update all version tags to v1.2
const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/>v1\.1<\/span>/g, '>v1.2</span>');
    fs.writeFileSync(file, code);
});
console.log('Version bumped to v1.2');
