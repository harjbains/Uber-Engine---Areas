const fs = require('fs');
const code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');
const match = code.match(/<header class="top-bar tv-header">([\s\S]*?)<\/header>/);
console.log(match ? match[0] : 'Not found');
