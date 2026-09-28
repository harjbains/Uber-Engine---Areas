const fs = require('fs');
const code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
const match = code.match(/<style>([\s\S]*?)<\/style>/);
if (match) {
    fs.writeFileSync('C:\\DEV\\health-engine\\temp_strength_css.txt', match[1]);
    console.log('Saved to temp_strength_css.txt');
}
