const fs = require('fs');
const { execSync } = require('child_process');

execSync('git restore js/views/mobility.js');

let code = fs.readFileSync('C:\\DEV\\health-engine\\port-mobility.js', 'utf8');

code = code.replace(/function replaceBlock\(source, funcName, templateName\) \{/g, 'function replaceBlock(source, funcName, newHTML) {');
code = code.replace(/`content\.innerHTML = \$\{templateName\};`/g, 'newHTML');
code = code.replace(/replaceBlock\(newMobility, 'renderActiveSet', 'activeHTML'\)/g, "replaceBlock(newMobility, 'renderActiveSet', activeHTML)");
code = code.replace(/replaceBlock\(newMobility, 'renderRest', 'restHTML'\)/g, "replaceBlock(newMobility, 'renderRest', restHTML)");
code = code.replace(/replaceBlock\(newMobility, 'renderComplete', 'completeHTML'\)/g, "replaceBlock(newMobility, 'renderComplete', completeHTML)");
code = code.replace(/>v2\.32<\/span>/g, '>v2.52</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\port-mobility.js', code);
