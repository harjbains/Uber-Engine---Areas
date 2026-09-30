const fs = require('fs');
let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const correctMobilityHeader = `
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">\${iconMobility}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.58</span></div>
                <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
            </div>
        </div>
        <div class="tv-header-center">
            
        <button class="tv-nav-home" id="btn-top-home">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            Home
        </button>
        
        </div>
        <div class="tv-header-right">
            
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="tv-right-title">MOBILITY WORKFLOW</div>
            <div class="tv-right-sub">Exercise \${state.currentIndex + 1} of \${state.exercises.length}</div>
        </div>
        
        </div>
    </header>
`;

mobility = mobility.replace(/<header class="tv-header">[\s\S]*?<\/header>/, correctMobilityHeader);

// Update version tags globally
mobility = mobility.replace(/>v2\.17<\/span>/g, '>v2.58</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.17/g, 'v=2.58');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.17/g, 'v=2.58');
fs.writeFileSync(appJsPath, appJs);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let fc = fs.readFileSync(file, 'utf8');
    fc = fc.replace(/>v2\.17<\/span>/g, '>v2.58</span>');
    fs.writeFileSync(file, fc);
});

console.log('Fixed mobility header');
