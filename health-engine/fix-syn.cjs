const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', 'utf8');
content = content.replace("let currentIterDate = new Date(startDate);\\n        currentIterDate.setHours(12, 0, 0, 0);", "let currentIterDate = new Date(startDate);\n        currentIterDate.setHours(12, 0, 0, 0);");
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', content);
