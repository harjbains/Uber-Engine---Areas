const fs = require('fs');

// 1. Add CSS Shell
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');
const shellCSS = `
/* --- STANDARDISED TV SHELL --- */
.tv-shell {
    width: 100%;
    height: 100%; /* Inherits from view-container, which inherits from body */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}
.tv-header {
    height: clamp(60px, 10dvh, 100px);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
}
.tv-main {
    flex: 1;
    min-height: 0;
    display: flex;
    padding: 10px 40px; /* Standard horizontal margins */
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
}
.tv-footer {
    height: clamp(70px, 11dvh, 110px);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 40px;
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
}
`;

if (!css.includes('STANDARDISED TV SHELL')) {
    css += '\n' + shellCSS;
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Added TV shell to styles.css');
}

// 2. Patch JS Files to use the shell and remove rogue 100vh logic
const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // Mappings for old wrappers to new shell classes
    if (file.includes('strength.js') || file.includes('cardio.js') || file.includes('mobility.js')) {
        code = code.replace(/<div class="app-container">/, '<div class="app-container tv-shell">');
        code = code.replace(/<header class="top-bar">/, '<header class="top-bar tv-header">');
        code = code.replace(/<div class="main-content"/, '<div class="main-content tv-main"');
        code = code.replace(/<div class="main-body"/, '<div class="main-body tv-main"');
        code = code.replace(/<footer class="bottom-bar">/, '<footer class="bottom-bar tv-footer">');
        
        // Strip out independent width/height from .app-container
        code = code.replace(/width: 100vw;/g, '');
        code = code.replace(/height: 100vh;/g, '');
        
        // Strip out independent heights from top-bar, main-content, bottom-bar
        code = code.replace(/height: 90px;/g, '');
        code = code.replace(/height: 100px;/g, '');
        code = code.replace(/height: 110px;/g, '');
        code = code.replace(/height: calc\([^)]+\);/g, '');
        
        // Remove individual padding that is now handled by tv-header/tv-main/tv-footer
        code = code.replace(/padding: 0 40px;/g, '');
        code = code.replace(/padding: 0 40px 20px 40px;/g, '');
        code = code.replace(/padding: 20px 40px;/g, '');
    }

    if (file.includes('tv-home.js')) {
        code = code.replace(/<div class="home-layout">/, '<div class="home-layout tv-shell">');
        code = code.replace(/<div class="home-content">/, '<div class="home-content tv-shell">');
        code = code.replace(/<div class="header">/, '<div class="header tv-header">');
        code = code.replace(/<div class="cards-container">/, '<div class="cards-container tv-main">');
        code = code.replace(/<div class="footer">/, '<div class="footer tv-footer">');
        
        code = code.replace(/height: 100vh;/g, '');
        code = code.replace(/padding: 40px 60px;/g, '');
        
        // Let tv-shell handle flex direction
        // Adjust .header so it inherits tv-header constraints
        code = code.replace(/margin-bottom: 50px;/g, '');
        code = code.replace(/margin-bottom: 30px;/g, '');
        
        // tv-footer already has height: 100px, remove it
        code = code.replace(/height: 100px;/g, '');
    }
    
    // Bump version for cache
    code = code.replace(/>v1\.6<\/span>/g, '>v1.7</span>');

    fs.writeFileSync(file, code);
    console.log(`Patched ${file.split('\\').pop()}`);
});

let indexHTML = fs.readFileSync('C:\\DEV\\health-engine\\index.html', 'utf8');
indexHTML = indexHTML.replace(/v=1\.6/g, 'v=1.7');
fs.writeFileSync('C:\\DEV\\health-engine\\index.html', indexHTML);
console.log('Bumped index to v1.7');
