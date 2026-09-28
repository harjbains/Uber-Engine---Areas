const fs = require('fs');
let router = fs.readFileSync('C:\\DEV\\health-engine\\js\\router.js', 'utf8');
if (!router.includes('import { renderHistory }')) {
    router = router.replace("import { renderMobility } from './views/mobility.js';", "import { renderMobility } from './views/mobility.js';\nimport { renderHistory } from './views/history.js';");
}
if (!router.includes("'/history': renderHistory")) {
    router = router.replace("'/mobility': renderMobility,", "'/mobility': renderMobility,\n    '/history': renderHistory,");
}
fs.writeFileSync('C:\\DEV\\health-engine\\js\\router.js', router);
