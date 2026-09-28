const fs = require('fs');

const files = [
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // 1. CSS Updates
    code = code.replace(/\.left-rail\s*\{[\s\S]*?\}/, `.left-rail { width: 210px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }`);
    
    code = code.replace(/\.rail-item\s*\{[\s\S]*?\}/, `.rail-item { display: flex; align-items: center; padding: 6px 8px; border-radius: 10px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); min-height: 56px; box-sizing: border-box; }`);
    
    code = code.replace(/\.rail-num\s*\{[\s\S]*?\}/, `.rail-num { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; margin-right: 8px; flex-shrink: 0; }`);
    
    code = code.replace(/\.rail-img\s*\{[\s\S]*?\}/, `.rail-img { width: 54px; height: 38px; border-radius: 4px; object-fit: cover; margin-right: 8px; background-color: #15243d; flex-shrink: 0; }`);
    
    code = code.replace(/\.rail-title\s*\{[\s\S]*?\}/, `.rail-title { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.2px; color: white; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2; padding-right: 2px; }`);

    // Remove .rail-sub CSS completely if it exists (might be active specific too)
    code = code.replace(/\.rail-sub\s*\{[\s\S]*?\}/g, '');
    code = code.replace(/\.rail-item\.active\s*\.rail-sub\s*\{[\s\S]*?\}/g, '');

    // 2. Adjust right panel width to absorb space (210px + 30px gap = 240px)
    code = code.replace(/calc\(100%\s*-\s*410px\)/g, 'calc(100% - 240px)');

    // 3. HTML Updates - Remove rail-sub from DOM mapping
    // Strength matching
    code = code.replace(/<div class="rail-sub">[^<]+<\/div>/g, '');
    
    // Bump version
    code = code.replace(/>v2\.\d+<\/span>/g, '>v2.53</span>');

    fs.writeFileSync(file, code);
});

// Global index and app bump
['C:\\DEV\\health-engine\\index.html', 'C:\\DEV\\health-engine\\js\\app.js'].forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/v=2\.\d+/g, 'v=2.53');
    fs.writeFileSync(file, code);
});

console.log('Sidebar compacted successfully.');
