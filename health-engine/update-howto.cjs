const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Unconditionally show the HELP button instead of only for adductor
content = content.replace(
    /\$\{ex\.name\.toLowerCase\(\)\.includes\('adductor'\) \? `<button class="btn-complete btn-howto" id="btn-howto"[^>]*>HELP<\/button>` : ''\}/g,
    `<button class="btn-complete btn-howto" id="btn-howto" style="flex: 1; height: 60px; font-size: 1.1rem; margin: 0; padding: 0;">HELP</button>`
);

// 2. Modify the HELP button logic to toggle the image
const oldHowtoLogic = `
    if (howtoBtn) {
        howtoBtn.addEventListener('click', () => {
            const bg = document.querySelector('.wp-bg');
            if (bg.style.backgroundSize === 'contain') {
                bg.style.backgroundSize = 'cover';
                howtoBtn.innerHTML = 'HELP';
            } else {
                bg.style.backgroundSize = 'contain';
                howtoBtn.innerHTML = 'BACK';
            }
        });
    }
`;

// Build a dynamic regex in case the spacing is slightly off
const howtoPattern = /if\s*\(howtoBtn\)\s*\{\s*howtoBtn\.addEventListener\('click',\s*\(\)\s*=>\s*\{\s*const\s+bg\s*=\s*document\.querySelector\('\.wp-bg'\);\s*if\s*\(bg\.style\.backgroundSize\s*===\s*'contain'\)\s*\{\s*bg\.style\.backgroundSize\s*=\s*'cover';\s*howtoBtn\.innerHTML\s*=\s*'HELP';\s*\}\s*else\s*\{\s*bg\.style\.backgroundSize\s*=\s*'contain';\s*howtoBtn\.innerHTML\s*=\s*'BACK';\s*\}\s*\}\);\s*\}/g;

const newHowtoLogic = `
    if (howtoBtn) {
        howtoBtn.addEventListener('click', () => {
            const bg = document.querySelector('.wp-bg');
            if (bg.style.backgroundSize === 'contain') {
                bg.style.backgroundSize = 'cover';
                bg.style.backgroundImage = \`url('\${resolveAssetPath(ex.image_path)}')\`;
                howtoBtn.innerHTML = 'HELP';
            } else {
                bg.style.backgroundSize = 'contain';
                const parts = ex.image_path.split('.');
                const ext = parts.pop();
                const howtoPath = \`\${parts.join('.')}-howto.\${ext}\`;
                bg.style.backgroundImage = \`url('\${resolveAssetPath(howtoPath)}')\`;
                howtoBtn.innerHTML = 'BACK';
            }
        });
    }
`;

content = content.replace(howtoPattern, newHowtoLogic);

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', content);
