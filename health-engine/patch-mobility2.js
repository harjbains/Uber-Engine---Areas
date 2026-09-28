const fs = require('fs');

let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Shrink left-rail
mobility = mobility.replace(/\.left-rail \{ width: 380px; display: flex; flex-direction: column; gap: 8px; margin-right: 20px; padding: 20px;/g, '.left-rail { width: 260px; display: flex; flex-direction: column; gap: 8px; margin-right: 10px; padding: 10px;');
mobility = mobility.replace(/\.rail-item \{ display: flex; align-items: center; padding: 10px 15px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba\(255,255,255,0\.02\); height: 80px; \}/g, '.rail-item { display: flex; align-items: center; padding: 8px 12px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 60px; }');

// 2. Shrink rp-content and rp-header
mobility = mobility.replace(/\.rp-content \{ position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; padding: 50px; justify-content: flex-end; align-items: center; \}/g, '.rp-content { position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; padding: 20px; justify-content: flex-end; align-items: center; }');
mobility = mobility.replace(/\.rp-header \{ font-size: 5rem; font-weight: 800; margin: 0 0 30px 0; letter-spacing: 2px; text-transform: uppercase; \}/g, '.rp-header { font-size: 2.5rem; font-weight: 800; margin: 0 0 15px 0; letter-spacing: 2px; text-transform: uppercase; text-align: center; }');

// 3. Shrink footer buttons (btn-end and next-block)
mobility = mobility.replace(/\.btn-end \{ background: #13192a; border-radius: 12px; padding: 15px 25px;/g, '.btn-end { background: #13192a; border-radius: 12px; height: 52px; padding: 0 20px;');
mobility = mobility.replace(/\.btn-end-text \{ font-size: 1\.1rem;/g, '.btn-end-text { font-size: 0.9rem;');
mobility = mobility.replace(/\.btn-end-sub \{ font-size: 0\.8rem;/g, '.btn-end-sub { font-size: 0.75rem;');

mobility = mobility.replace(/\.next-block \{ background: #13192a; border-radius: 12px; padding: 15px 25px;/g, '.next-block { background: #13192a; border-radius: 12px; height: 52px; padding: 0 20px;');

// 4. Update btn-howto logic for fullscreen
const oldHowToLogic = `        howToBtn.addEventListener('click', () => {
            isHowTo = !isHowTo;
            if (isHowTo) {
                bgDiv.style.backgroundImage = \`url('\${howToImage}')\`;
                howToBtn.innerText = 'BACK TO EXERCISE';
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = 'none';
                });
            } else {
                bgDiv.style.backgroundImage = \`url('\${normalImage}')\`;
                howToBtn.innerText = 'HOW TO';
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = '';
                });
            }
        });`;

const newHowToLogic = `        howToBtn.addEventListener('click', () => {
            isHowTo = !isHowTo;
            const leftRail = document.querySelector('.left-rail');
            const tvHeader = document.querySelector('.tv-header');
            const bottomBar = document.querySelector('.bottom-bar');
            const rpHeader = document.querySelector('.rp-header');
            const statsRow = document.querySelector('.stats-row');

            if (isHowTo) {
                bgDiv.style.backgroundImage = \`url('\${howToImage}')\`;
                howToBtn.innerText = 'BACK TO EXERCISE';
                
                if(leftRail) leftRail.style.display = 'none';
                if(tvHeader) tvHeader.style.display = 'none';
                if(bottomBar) bottomBar.style.display = 'none';
                if(rpHeader) rpHeader.style.display = 'none';
                if(statsRow) statsRow.style.display = 'none';
                
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = 'none';
                });
            } else {
                bgDiv.style.backgroundImage = \`url('\${normalImage}')\`;
                howToBtn.innerText = 'HOW TO';
                
                if(leftRail) leftRail.style.display = '';
                if(tvHeader) tvHeader.style.display = '';
                if(bottomBar) bottomBar.style.display = '';
                if(rpHeader) rpHeader.style.display = '';
                if(statsRow) statsRow.style.display = '';
                
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = '';
                });
            }
        });`;

mobility = mobility.replace(oldHowToLogic, newHowToLogic);

// Bump version
mobility = mobility.replace(/>v2\.18<\/span>/g, '>v2.47</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.18/g, 'v=2.47');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.18/g, 'v=2.47');
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
    fc = fc.replace(/>v2\.18<\/span>/g, '>v2.47</span>');
    fs.writeFileSync(file, fc);
});

console.log('Mobility scaled and fullscreen how-to implemented');
