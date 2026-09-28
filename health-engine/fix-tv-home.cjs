const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

// Change HEALTH ENGINE to FITNESS ENGINE
content = content.replace('HEALTH <span style="color: #2196F3;">ENGINE</span>', 'FITNESS <span style="color: #2196F3;">ENGINE</span>');

// Add id to HISTORY button
content = content.replace('<div class="footer-btn" tabindex="0">\r\n                          <div class="footer-icon" style="color: #fff;">${iconChart}</div>\r\n                          <div class="footer-text">\r\n                              <h3 class="footer-title">HISTORY</h3>', '<div class="footer-btn" tabindex="0" id="btn-history">\r\n                          <div class="footer-icon" style="color: #fff;">${iconChart}</div>\r\n                          <div class="footer-text">\r\n                              <h3 class="footer-title">HISTORY</h3>');

content = content.replace('<div class="footer-btn" tabindex="0">\n                          <div class="footer-icon" style="color: #fff;">${iconChart}</div>\n                          <div class="footer-text">\n                              <h3 class="footer-title">HISTORY</h3>', '<div class="footer-btn" tabindex="0" id="btn-history">\n                          <div class="footer-icon" style="color: #fff;">${iconChart}</div>\n                          <div class="footer-text">\n                              <h3 class="footer-title">HISTORY</h3>');

// Add event listener
if (!content.includes("document.getElementById('btn-history')")) {
    content = content.replace("document.getElementById('btn-admin-bottom')?.addEventListener('click', goAdmin);", "document.getElementById('btn-admin-bottom')?.addEventListener('click', goAdmin);\n    if (document.getElementById('btn-history')) document.getElementById('btn-history').addEventListener('click', () => navigate('/history'));");
}

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', content);
