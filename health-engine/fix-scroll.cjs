const fs = require('fs');

function addScrollFocus(file) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('block: "nearest"')) {
        const patch = `
    document.querySelectorAll('.rail-item').forEach(item => {
        item.addEventListener('focus', (e) => {
            e.target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });`;
        // Insert right after `const sbItems = document.querySelectorAll('.sb-item');`
        content = content.replace("const sbItems = document.querySelectorAll('.sb-item');", "const sbItems = document.querySelectorAll('.sb-item');" + patch);
        fs.writeFileSync(file, content);
    }
}

addScrollFocus('C:\\DEV\\health-engine\\js\\views\\strength.js');
addScrollFocus('C:\\DEV\\health-engine\\js\\views\\mobility.js');
