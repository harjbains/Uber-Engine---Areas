const fs = require('fs');

let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const mobilityCSS = `
    /* Mobility Page Squish */
    .sidebar { gap: clamp(5px, 1.5dvh, 10px) !important; padding: clamp(10px, 2.5dvh, 20px) !important; width: clamp(250px, 25vw, 380px) !important; }
    .sb-item { padding: clamp(8px, 1.5dvh, 15px) !important; gap: clamp(8px, 1.5dvh, 15px) !important; }
    .sb-name { font-size: clamp(0.9rem, 1.5dvh, 1.2rem) !important; }
    .sb-sub { font-size: clamp(0.7rem, 1.2dvh, 0.9rem) !important; margin-top: clamp(2px, 0.5dvh, 5px) !important; }
    .sb-img { width: clamp(48px, 7dvh, 64px) !important; height: clamp(36px, 5dvh, 48px) !important; }
    
    .rp-content { padding: clamp(20px, 4dvh, 50px) !important; }
    .rp-header { font-size: clamp(3rem, 7dvh, 5rem) !important; margin-bottom: clamp(15px, 3.5dvh, 30px) !important; }
    .stats-row { gap: clamp(20px, 4vw, 60px) !important; }
    .stat-box { gap: clamp(4px, 1dvh, 8px) !important; }
    .stat-label { font-size: clamp(0.7rem, 1.2dvh, 1rem) !important; }
    
    .controls-area { gap: clamp(10px, 2dvh, 20px) !important; margin-top: auto !important; }
    .submit-area { padding: clamp(20px, 4dvh, 40px) !important; }
    .set-indicator { font-size: clamp(1.2rem, 2.5dvh, 1.8rem) !important; margin-bottom: clamp(15px, 3dvh, 30px) !important; }
    .set-indicator span { font-size: clamp(1.8rem, 3.5dvh, 2.5rem) !important; }
    
    /* Timers & Feedback */
    .rest-huge { font-size: clamp(6rem, 15dvh, 12rem) !important; margin: clamp(10px, 2dvh, 20px) 0 !important; }
    .huge-timer { font-size: clamp(5rem, 12dvh, 10rem) !important; margin-bottom: clamp(10px, 2dvh, 20px) !important; }
    .fb-grid { margin: clamp(20px, 4dvh, 40px) 0 !important; gap: clamp(10px, 2vw, 20px) !important; }
    .btn-fb { padding: clamp(15px, 3dvh, 30px) !important; font-size: clamp(1.2rem, 2.5dvh, 2rem) !important; width: clamp(150px, 15vw, 220px) !important; }
    
    /* Interaction Capsules */
    #interaction-area > div { padding: clamp(10px, 2dvh, 15px) clamp(20px, 4vw, 40px) !important; gap: clamp(15px, 3vw, 30px) !important; }
    #interaction-area div[style*="font-size: 4rem"] { font-size: clamp(2.5rem, 5dvh, 4rem) !important; width: auto !important; min-width: clamp(100px, 15vw, 160px) !important; }
    #interaction-area div[style*="font-size: 1.2rem"] { font-size: clamp(0.9rem, 1.5dvh, 1.2rem) !important; }
    #interaction-area span[style*="font-size: 1.8rem"] { font-size: clamp(1.2rem, 2.5dvh, 1.8rem) !important; }
    #interaction-area span[style*="font-size: 2rem"] { font-size: clamp(1.2rem, 2.5dvh, 2rem) !important; }
    #interaction-area .btn-start-purple, #interaction-area .btn-complete { padding: clamp(10px, 2dvh, 15px) clamp(20px, 4vw, 40px) !important; font-size: clamp(1rem, 2dvh, 1.5rem) !important; }
    #interaction-area .btn-skip-sub, #interaction-area #btn-howto { padding: clamp(10px, 2dvh, 15px) clamp(15px, 3vw, 30px) !important; font-size: clamp(0.9rem, 1.5dvh, 1.2rem) !important; }
`;

if (!css.includes('Mobility Page Squish')) {
    // Insert just before the closing brace of the media query
    const insertPos = css.lastIndexOf('}');
    css = css.substring(0, insertPos) + '\n' + mobilityCSS + '\n' + css.substring(insertPos);
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Appended mobility squish rules');
}

let indexHTML = fs.readFileSync('C:\\DEV\\health-engine\\index.html', 'utf8');
indexHTML = indexHTML.replace(/v=1\.8/g, 'v=1.9');
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
    code = code.replace(/>v1\.8<\/span>/g, '>v1.9</span>');
    fs.writeFileSync(file, code);
});
console.log('Bumped to v1.9');
