const fs = require('fs');

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const search = '<div class="app-container tv-shell">\n            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">';
const replace = '<div id="mobility-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">';

if (mob.includes('<div class="app-container tv-shell">')) {
    // wait we only want to replace the FIRST one (the container)
    // or we can just replace by string
    mob = mob.replace(search, replace);
    // There's a stray closing </div> because we removed the wrapper
    // Actually, earlier we had:
    /*
        <div class="app-container tv-shell">
            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>
    */
    // If we replace the top two lines, we leave two closing divs. We should replace the whole block!
    const searchBlock = `<div class="app-container tv-shell">
            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>`;
    const replaceBlock = `<div id="mobility-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div class="spinner" style="margin: auto;"></div>
        </div>`;
    mob = mob.replace(searchBlock, replaceBlock);
    
    // Bump version again to v2.44
    mob = mob.replace(/>v2\.\d+<\/span>/g, '>v2.44</span>');
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
}
