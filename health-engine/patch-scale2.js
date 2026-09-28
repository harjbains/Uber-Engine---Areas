const fs = require('fs');

let appJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

// 1. Update polyfill for Firestick to be more aggressive
const oldPolyfill = `// Global polyfill for TV remotes (Firestick/Silk)
// Maps Enter/Space on focusable divs to click events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const el = document.activeElement;
        if (el && el.getAttribute('tabindex') === '0' && el.tagName !== 'BUTTON') {
            e.preventDefault();
            el.click();
        }
    }
});`;

const newPolyfill = `// Global polyfill for TV remotes (Firestick/Silk)
// Maps Enter/Select on any focused element to a direct click event
document.addEventListener('keydown', (e) => {
    // Firestick select button usually maps to Enter (keyCode 13)
    if (e.key === 'Enter' || e.keyCode === 13 || e.key === ' ') {
        const el = document.activeElement;
        if (el && typeof el.click === 'function') {
            e.preventDefault();
            el.click();
        }
    }
});`;

appJs = appJs.replace(oldPolyfill, newPolyfill);

// 2. Update TV scale to be 15% larger
const oldScaleStr = `const scale = Math.min(availableWidth / 1920, availableHeight / 1080);`;
const newScaleStr = `// User requested 15% taller overall scale (uniform boost)
        const scale = Math.min(availableWidth / 1920, availableHeight / 1080) * 1.15;`;

appJs = appJs.replace(oldScaleStr, newScaleStr);

fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', appJs);
console.log('App.js patched for 15% scale and better click polyfill.');
