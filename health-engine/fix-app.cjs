const fs = require('fs');
let app = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');
app = app.replace('            setupRouting();\r\n            initTVEmulation();', '            initTVEmulation();\r\n            setupRouting();');
app = app.replace('            setupRouting();\n            initTVEmulation();', '            initTVEmulation();\n            setupRouting();');
app = app.replace('            setupRouting();\r\n            initTVEmulation();', '            initTVEmulation();\r\n            setupRouting();'); // sometimes extra CR
fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', app);
