const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
content = content.replace("resolveAssetPath('mobility/hamstring-stretch.webp', 'Hamstring Stretch')", "resolveAssetPath('mobility/hero.webp', 'Mobility Hero')");
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', content);
