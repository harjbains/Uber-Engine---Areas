const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
content = content.replace("document.getElementById('btn-admin-top').addEventListener('click', goAdmin);", "if (document.getElementById('btn-admin-top')) document.getElementById('btn-admin-top').addEventListener('click', goAdmin);");
content = content.replace("document.getElementById('btn-admin-bottom').addEventListener('click', goAdmin);", "if (document.getElementById('btn-admin-bottom')) document.getElementById('btn-admin-bottom').addEventListener('click', goAdmin);");
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', content);
