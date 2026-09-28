const fs = require('fs');

// 1. Fix strength.js
let str = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
str = str.replace(/<div id="strength-content" style=" ">Loading\.\.\.<\/div>/g, '<div id="strength-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">Loading...</div>');
str = str.replace(/>v2\.\d+<\/span>/g, '>v2.43</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', str);

// 2. Fix mobility.js
let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
const searchBlock = `container.innerHTML = \`
        <div class="app-container tv-shell">
            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>
    \`;`;

const replaceBlock = `container.innerHTML = \`
        <div id="mobility-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div class="spinner" style="margin: auto;"></div>
        </div>
    \`;`;

mob = mob.replace(searchBlock, replaceBlock);
mob = mob.replace(/>v2\.\d+<\/span>/g, '>v2.43</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);

// 3. Global app bump
let indexHtml = fs.readFileSync('C:\\DEV\\health-engine\\index.html', 'utf8');
indexHtml = indexHtml.replace(/v=2\.\d+/g, 'v=2.43');
fs.writeFileSync('C:\\DEV\\health-engine\\index.html', indexHtml);

let tvHome = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
tvHome = tvHome.replace(/>v2\.\d+<\/span>/g, '>v2.43</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', tvHome);

let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');
cardio = cardio.replace(/>v2\.\d+<\/span>/g, '>v2.43</span>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

console.log("Fixed height inheritances!");
