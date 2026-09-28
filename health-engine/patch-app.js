const fs = require('fs');

let appJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

if (!appJs.includes('initTVEmulation')) {
    appJs = "import { initTVEmulation } from './tv-emu.js';\n" + appJs;
    appJs = appJs.replace('setupRouting();', 'setupRouting();\n            initTVEmulation();');
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', appJs);
    console.log('App.js patched successfully');
} else {
    console.log('Already patched');
}
