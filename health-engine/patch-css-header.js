const fs = require('fs');
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const newHeaderCSS = `
/* --- STANDARDISED TV SHELL --- */
.tv-header {
    height: 90px;
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
    background: #070b14;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.tv-header-left {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: flex-start;
    min-width: 0; 
}
.tv-header-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
}
.tv-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    text-align: right;
    min-width: 0;
}

/* Header Text Standardisation */
.tv-brand-icon { width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.tv-brand-icon svg { width: 100%; height: 100%; }
.tv-brand-title { margin: 0; font-size: 1.6rem; font-weight: 800; letter-spacing: 1px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white; }
.tv-brand-sub { font-size: 0.7rem; color: #8892a0; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tv-nav-home { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; color: #8892a0; cursor: pointer; background: transparent; padding: 8px 16px; border-radius: 8px; transition: 0.2s; white-space: nowrap; border: 1px solid transparent; outline: none; font-family: inherit; font-weight: bold; }
.tv-nav-home:hover { background: rgba(255,255,255,0.05); color: white; }
.tv-right-title { font-size: 1.4rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; margin: 0; overflow: hidden; text-overflow: ellipsis; color: white; }
.tv-right-sub { font-size: 0.95rem; color: #8892a0; margin-top: 4px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

css = css.replace(/\/\* --- STANDARDISED TV SHELL ---\*\/[\s\S]*?\.tv-header \{[\s\S]*?\}/, newHeaderCSS);
css = css.replace(/\.top-bar \{ height: clamp\(50px, 8\.5dvh, 90px\) !important; \}/g, '');

fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
console.log('CSS header patched');
