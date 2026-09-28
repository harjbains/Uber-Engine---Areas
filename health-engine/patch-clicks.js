const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

const oldBlock = `    content.querySelectorAll('.w-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-start')) return; // Prevent infinite loop from bubbling
            const btn = card.querySelector('.btn-start');
            if (btn) btn.click();
        });
    });`;

const newBlock = `    content.querySelectorAll('.w-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest && e.target.closest('.btn-start')) return; 
            if (card.classList.contains('card-blue')) navigate('/strength');
            if (card.classList.contains('card-green')) navigate('/cardio');
            if (card.classList.contains('card-purple')) navigate('/mobility');
        });
    });`;

if (code.includes('if (btn) btn.click();')) {
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', code);
    console.log('Fixed tv-home.js card click logic');
} else {
    console.log('Already patched?');
}
