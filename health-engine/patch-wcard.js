const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

code = code.replace(/<div class="w-card/g, '<div tabindex="0" class="w-card');

const oldListener = `document.getElementById('btn-strength').addEventListener('click', () => navigate('/strength'));`;
const newListener = `// Make the whole card clickable for TV
    content.querySelectorAll('.w-card').forEach(card => {
        card.addEventListener('click', () => {
            const btn = card.querySelector('.btn-start');
            if (btn) btn.click();
        });
    });

    document.getElementById('btn-strength').addEventListener('click', () => navigate('/strength'));`;

if (!code.includes("Make the whole card clickable for TV")) {
    code = code.replace(oldListener, newListener);
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', code);
    console.log('w-card patched');
}
