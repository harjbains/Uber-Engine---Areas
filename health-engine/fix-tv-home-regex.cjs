const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

content = content.replace(/<div class="footer-btn" tabindex="0">\s*<div class="footer-icon" style="color: #fff;">\$\{iconChart\}<\/div>\s*<div class="footer-text">\s*<h3 class="footer-title">HISTORY<\/h3>/g, '<div class="footer-btn" tabindex="0" id="btn-history">\n                          <div class="footer-icon" style="color: #fff;">${iconChart}</div>\n                          <div class="footer-text">\n                              <h3 class="footer-title">HISTORY</h3>');

if (!content.includes("document.getElementById('btn-history')")) {
    content = content.replace("document.getElementById('btn-admin-bottom')?.addEventListener('click', goAdmin);", "document.getElementById('btn-admin-bottom')?.addEventListener('click', goAdmin);\n    if (document.getElementById('btn-history')) document.getElementById('btn-history').addEventListener('click', () => navigate('/history'));");
}

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', content);
