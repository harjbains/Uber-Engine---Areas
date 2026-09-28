const fs = require('fs');

let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

css = css.replace(/\\n    flex: 1;\\n    min-height: 100%;\\n/g, '');
css = css.replace(/\.tv-shell \{([\s\S]*?)position: relative;/, '.tv-shell {$1position: relative;\n    flex: 1;\n    min-height: 100%;');

fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
console.log('Fixed syntax error');
