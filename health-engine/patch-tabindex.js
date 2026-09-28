const fs = require('fs');

function addTabIndex(filePath, patterns) {
    let code = fs.readFileSync(filePath, 'utf8');
    let original = code;
    
    patterns.forEach(p => {
        // Find the class attribute, then insert tabindex
        // e.g., class="rail-item..." -> class="rail-item..." tabindex="0"
        code = code.replace(new RegExp(`(class="[^"]*\\b${p}\\b[^"]*")`, 'g'), `$1 tabindex="0"`);
    });
    
    if (code !== original) {
        // Fix any duplicate tabindexes if run multiple times
        code = code.replace(/ tabindex="0"( tabindex="0")+/g, ' tabindex="0"');
        fs.writeFileSync(filePath, code);
        console.log(`Patched ${filePath}`);
    }
}

// 1. Patch Views
addTabIndex('C:\\DEV\\health-engine\\js\\views\\mobility.js', ['rail-item', 'next-block', 'nav-home', 'bb-btn-end']);
addTabIndex('C:\\DEV\\health-engine\\js\\views\\strength.js', ['rail-item', 'next-block', 'nav-home', 'bb-btn-end']);
addTabIndex('C:\\DEV\\health-engine\\js\\views\\cardio.js', ['ctrl-arrow-container', 'nav-home', 'bb-btn-end']);
addTabIndex('C:\\DEV\\health-engine\\js\\views\\tv-home.js', ['footer-btn']);

// 2. Add Keydown Polyfill to app.js
let appJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');
if (!appJs.includes('document.addEventListener(\'keydown\'')) {
    appJs += `
// Global polyfill for TV remotes (Firestick/Silk)
// Maps Enter/Space on focusable divs to click events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const el = document.activeElement;
        if (el && el.getAttribute('tabindex') === '0' && el.tagName !== 'BUTTON') {
            e.preventDefault();
            el.click();
        }
    }
});
`;
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', appJs);
    console.log('Patched app.js');
}

console.log('Done!');
