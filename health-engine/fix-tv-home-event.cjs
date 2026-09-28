const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
content = content.replace("if (document.getElementById('btn-admin-bottom')) document.getElementById('btn-admin-bottom').addEventListener('click', goAdmin);", "if (document.getElementById('btn-admin-bottom')) document.getElementById('btn-admin-bottom').addEventListener('click', goAdmin);\n    if (document.getElementById('btn-history')) document.getElementById('btn-history').addEventListener('click', () => navigate('/history'));");
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', content);
