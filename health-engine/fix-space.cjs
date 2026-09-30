const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

const newCode = `if (el && typeof el.click === 'function') {
            // Do not steal spaces from input fields
            if (e.key === ' ' && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
                return; // Let normal typing happen
            }
            e.preventDefault();
            el.click();
        }`;

content = content.replace(/if\s*\(el\s*&&\s*typeof\s*el\.click\s*===\s*'function'\)\s*\{\s*e\.preventDefault\(\);\s*el\.click\(\);\s*\}/g, newCode);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', content);
