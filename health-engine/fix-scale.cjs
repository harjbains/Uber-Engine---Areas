const fs = require('fs');
let content = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', 'utf8');

// Main Content padding
content = content.replace('padding: 15px 40px;', 'padding: 5px 40px;');

// Month Navigation
content = content.replace('gap: 40px; margin-bottom: 15px;', 'gap: 20px; margin-bottom: 5px;');
content = content.replace('font-size: 2.2rem;', 'font-size: 1.5rem;');
content = content.replace(/width="40" height="40"/g, 'width="30" height="30"');

// Calendar Grid gap
content = content.replace('gap: 8px; flex: 1; min-height: 0;', 'gap: 4px; flex: 1; min-height: 0;');

// Summary Strip
content = content.replace('margin-top: 15px;', 'margin-top: 5px;');
content = content.replace('padding: 12px 20px;', 'padding: 6px 20px;');
content = content.replace('.sum-item {\r\n                font-size: 1.1rem;', '.sum-item {\r\n                font-size: 1rem;');
content = content.replace('.sum-item {\n                font-size: 1.1rem;', '.sum-item {\n                font-size: 1rem;');

// CSS updates
content = content.replace('.cal-date {\r\n                font-size: 1.4rem;\r\n                font-weight: bold;\r\n                color: white;\r\n                margin-bottom: 6px;\r\n            }', '.cal-date {\n                font-size: 1.15rem;\n                font-weight: bold;\n                color: white;\n                margin-bottom: 2px;\n            }');
content = content.replace('.cal-date {\n                font-size: 1.4rem;\n                font-weight: bold;\n                color: white;\n                margin-bottom: 6px;\n            }', '.cal-date {\n                font-size: 1.15rem;\n                font-weight: bold;\n                color: white;\n                margin-bottom: 2px;\n            }');

content = content.replace('.cal-dots {\r\n                display: flex;\r\n                gap: 8px;\r\n            }', '.cal-dots {\n                display: flex;\n                gap: 6px;\n            }');
content = content.replace('.cal-dots {\n                display: flex;\n                gap: 8px;\n            }', '.cal-dots {\n                display: flex;\n                gap: 6px;\n            }');

content = content.replace('width: 12px;\r\n                height: 12px;', 'width: 10px;\n                height: 10px;');
content = content.replace('width: 12px;\n                height: 12px;', 'width: 10px;\n                height: 10px;');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', content);
