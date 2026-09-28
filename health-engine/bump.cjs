const fs = require('fs');
const path = require('path');

function bump(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') bump(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            if (content.match(/>v2\.\d+<\/span>/)) {
                content = content.replace(/>v2\.\d+<\/span>/g, '>v2.49</span>');
                changed = true;
            }
            if (content.match(/v=2\.\d+/)) {
                content = content.replace(/v=2\.\d+/g, 'v=2.49');
                changed = true;
            }
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log('Bumped', fullPath);
            }
        }
    }
}
bump('C:\\DEV\\health-engine');
