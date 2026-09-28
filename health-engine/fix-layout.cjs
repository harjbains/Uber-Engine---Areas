const fs = require('fs');

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
mob = mob.replace(/<div class="app-container tv-shell">[\s\S]*?<div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">[\s\S]*?<div class="spinner" style="margin: auto;"><\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/, `<div id="mobility-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">\n                <div class="spinner" style="margin: auto;"></div>\n            </div>`);

// Rename buttons
mob = mob.replace(/HOW TO/g, 'HELP');
mob = mob.replace(/BACK TO EXERCISE/g, 'BACK');
// Fix layout to horizontal: the buttons are currently just separate buttons. We will wrap them in a flex row.
// In mobility.js, the buttons are under "active-timer" or "btn-done"
// Wait, I will just use CSS override in mobility.js by appending it to the <style> block!
const cssPatch = `
            #interaction-area { flex-direction: row !important; flex-wrap: wrap; justify-content: center; }
            .btn-complete { flex: 1; min-width: 120px; }
            .wp-bottom-right { align-items: stretch; justify-content: flex-end; }
            .bb-center { align-items: center; }
            .tv-footer { margin-top: auto; }
            .left-rail { overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
            .left-rail::-webkit-scrollbar { width: 6px; }
            .left-rail::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;

mob = mob.replace('</style>', cssPatch + '</style>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);

// Patch strength.js for footer alignment and scrolling
let str = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
str = str.replace('</style>', cssPatch + '</style>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', str);

// Patch cardio.js for cancel button touching footer
let card = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');
const cardCss = `
            .bb-center { align-items: center; }
`;
card = card.replace('</style>', cardCss + '</style>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', card);
