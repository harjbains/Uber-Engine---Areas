const fs = require('fs');
let app = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

// The file currently has literal `\n` character strings.
app = app.replace("import { initDiagnostics } from './diagnostics.js';\\nimport { initForceLatest } from './force-latest.js';", 
    "import { initDiagnostics } from './diagnostics.js';\nimport { initForceLatest } from './force-latest.js';");

app = app.replace("initDiagnostics();\\n            initForceLatest();", 
    "initDiagnostics();\n            initForceLatest();");

fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', app);
