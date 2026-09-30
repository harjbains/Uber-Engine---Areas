const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const oldHowtoPattern = /if\s*\(howtoBtn\)\s*\{\s*howtoBtn\.addEventListener\('click',\s*\(\)\s*=>\s*\{\s*const\s+bg\s*=\s*document\.querySelector\('\.wp-bg'\);\s*if\s*\(bg\.style\.backgroundSize\s*===\s*'contain'\)\s*\{\s*bg\.style\.backgroundSize\s*=\s*'cover';\s*bg\.style\.backgroundImage\s*=\s*`url\('\$\{resolveAssetPath\(ex\.image_path\)\}'\)`;\s*howtoBtn\.innerHTML\s*=\s*'HELP';\s*\}\s*else\s*\{\s*bg\.style\.backgroundSize\s*=\s*'contain';\s*const\s+parts\s*=\s*ex\.image_path\.split\('\.'\);\s*const\s+ext\s*=\s*parts\.pop\(\);\s*const\s+howtoPath\s*=\s*`\$\{parts\.join\('\.'\)\}-howto\.\$\{ext\}`;\s*bg\.style\.backgroundImage\s*=\s*`url\('\$\{resolveAssetPath\(howtoPath\)\}'\)`;\s*howtoBtn\.innerHTML\s*=\s*'BACK';\s*\}\s*\}\);\s*\}/g;

const newHowtoLogic = `
    if (howtoBtn) {
        howtoBtn.addEventListener('click', () => {
            const parts = ex.image_path.split('.');
            const ext = parts.pop();
            const howtoPath = \`\${parts.join('.')}-howto.\${ext}\`;
            const imgUrl = resolveAssetPath(howtoPath);
            
            const modal = document.createElement('div');
            modal.id = 'howto-modal';
            modal.style.position = 'absolute';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(10, 15, 30, 0.98)';
            modal.style.zIndex = '9999';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.padding = '20px';
            modal.style.boxSizing = 'border-box';
            
            modal.innerHTML = \`
                <style>
                    #btn-close-howto:focus {
                        transform: scale(1.05);
                        border: 2px solid white;
                        box-shadow: 0 0 20px rgba(255,255,255,0.5);
                    }
                </style>
                <div style="flex: 1; width: 100%; background-image: url('\${imgUrl}'); background-size: contain; background-position: center; background-repeat: no-repeat; margin-bottom: 20px;"></div>
                <button id="btn-close-howto" class="btn-complete" style="background-color: #007bff; width: 250px; height: 60px; font-size: 1.4rem; flex-shrink: 0; box-shadow: 0 4px 15px rgba(0,123,255,0.4); outline: none; border-radius: 12px; font-weight: bold; cursor: pointer; color: white; border: 2px solid transparent;">CLOSE HELP</button>
            \`;
            
            document.querySelector('.app-container').appendChild(modal);
            
            const closeBtn = document.getElementById('btn-close-howto');
            closeBtn.focus();
            
            closeBtn.addEventListener('click', () => {
                modal.remove();
                howtoBtn.focus();
            });
        });
    }
`;

content = content.replace(oldHowtoPattern, newHowtoLogic);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', content);
