const fs = require('fs');

let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const innerResponsiveCSS = `
/* Proportionally reduce inner content inside tv-main on restricted viewports */
@media (max-height: 1080px) {
    /* Home Page Cards Squish */
    .w-card { min-height: 0 !important; }
    .card-content { padding: clamp(15px, 3dvh, 40px) !important; justify-content: space-evenly !important; }
    .card-icon-container { 
        margin-top: clamp(10px, 2dvh, 40px) !important; 
        margin-bottom: clamp(10px, 2dvh, 20px) !important;
        width: clamp(50px, 8dvh, 100px) !important;
    }
    .card-icon-container svg { width: 100% !important; height: auto !important; max-height: clamp(50px, 8dvh, 100px) !important; }
    .card-title { font-size: clamp(1.8rem, 4dvh, 3.5rem) !important; margin: 0 !important; }
    .card-subtitle { margin-bottom: clamp(10px, 2.5dvh, 25px) !important; font-size: clamp(0.8rem, 1.3dvh, 1.2rem) !important; }
    .card-status { margin-bottom: clamp(10px, 2.5dvh, 30px) !important; padding: clamp(5px, 1dvh, 10px) 25px !important; font-size: clamp(0.8rem, 1.3dvh, 1.1rem) !important; }
    .btn-start { padding: clamp(10px, 2dvh, 25px) !important; font-size: clamp(1.2rem, 3dvh, 2.2rem) !important; margin-top: auto !important; }
    
    /* Strength Page Squish */
    .left-rail { gap: clamp(4px, 1dvh, 8px) !important; margin-right: clamp(10px, 2vw, 20px) !important; overflow-y: auto; }
    .rail-item { height: clamp(45px, 6dvh, 80px) !important; padding: clamp(5px, 1dvh, 10px) 15px !important; flex-shrink: 0; }
    .wp-content { padding: clamp(15px, 4dvh, 40px) !important; gap: clamp(15px, 3vw, 40px) !important; }
    .exercise-name { font-size: clamp(2.2rem, 5.5dvh, 4.2rem) !important; margin-bottom: clamp(10px, 2.5dvh, 30px) !important; }
    .stats-row { gap: clamp(15px, 3vw, 40px) !important; }
    .stat-lbl { font-size: clamp(0.6rem, 1.1dvh, 0.85rem) !important; }
    .stat-val { font-size: clamp(1.4rem, 3dvh, 2.2rem) !important; }
    .wp-bottom-left { gap: clamp(10px, 2vw, 20px) !important; margin-top: auto !important; }
    .control-box { height: clamp(200px, 35dvh, 350px) !important; padding: clamp(10px, 2dvh, 25px) !important; width: clamp(200px, 25vw, 260px) !important; }
    .ctrl-interactive { height: auto !important; flex: 1 !important; }
    .ctrl-val { font-size: clamp(2.5rem, 5dvh, 4rem) !important; }
    .ctrl-lbl { margin-bottom: clamp(5px, 1.5dvh, 15px) !important; font-size: clamp(0.7rem, 1.3dvh, 1.1rem) !important; }
    .ctrl-arrow-container { height: clamp(20px, 4.5dvh, 45px) !important; flex-shrink: 0; }
    .ctrl-sub { font-size: clamp(0.6rem, 1.1dvh, 0.8rem) !important; margin-top: clamp(4px, 1dvh, 10px) !important; }
    .wp-bottom-right { gap: clamp(10px, 2dvh, 15px) !important; margin-top: auto !important; }
    .btn-complete { height: clamp(50px, 8dvh, 80px) !important; font-size: clamp(1.2rem, 2.5dvh, 1.8rem) !important; border-radius: clamp(10px, 2dvh, 16px) !important; }
    .set-indicator { height: clamp(40px, 7dvh, 70px) !important; font-size: clamp(1rem, 2dvh, 1.4rem) !important; border-radius: clamp(10px, 2dvh, 16px) !important; }
}
`;

if (!css.includes('Proportionally reduce inner content inside tv-main')) {
    css += '\n' + innerResponsiveCSS;
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Appended inner content proportional squish to styles.css');
}

let indexHTML = fs.readFileSync('C:\\DEV\\health-engine\\index.html', 'utf8');
indexHTML = indexHTML.replace(/v=1\.7/g, 'v=1.8');
fs.writeFileSync('C:\\DEV\\health-engine\\index.html', indexHTML);

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/>v1\.7<\/span>/g, '>v1.8</span>');
    fs.writeFileSync(file, code);
});
console.log('Bumped to v1.8');
