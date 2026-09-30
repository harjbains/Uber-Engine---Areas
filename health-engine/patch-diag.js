const fs = require('fs');

let appJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

if (!appJs.includes('initDiagnostics')) {
    appJs = "import { initDiagnostics } from './diagnostics.js?v=2.56';\n" + appJs;
    appJs = appJs.replace('initTVEmulation();', 'initTVEmulation();\n            initDiagnostics();');
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', appJs);
    console.log('App.js patched successfully for diagnostics');
} else {
    console.log('Already patched');
}
