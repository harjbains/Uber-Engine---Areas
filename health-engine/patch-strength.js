const fs = require('fs');

let strength = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');

// 1. stat-val (Rep Range fix)
strength = strength.replace(/\.stat-val \{\s*font-size: 2\.2rem;/g, '.stat-val {\n                font-size: 1.6rem;\n                white-space: nowrap;');

// 2. ctrl-lbl HTML (Reps Completed -> REPS)
strength = strength.replace(/<div class="ctrl-lbl">REPS COMPLETED<\/div>/g, '<div class="ctrl-lbl">REPS</div>');

// 3. Footer buttons height (bb-btn-end and bb-btn-next)
strength = strength.replace(/\.bb-btn-end \{\s*background-color: #111827;\s*border-radius: 16px;\s*height: 70px;\s*padding: 0 25px;/g, '.bb-btn-end {\n                background-color: #111827;\n                border-radius: 12px;\n                height: 52px;\n                padding: 0 20px;');

strength = strength.replace(/\.bb-btn-next \{\s*background-color: #111827;\s*border-radius: 16px;\s*height: 70px;\s*padding: 0 25px;/g, '.bb-btn-next {\n                background-color: #111827;\n                border-radius: 12px;\n                height: 52px;\n                padding: 0 20px;');

// Ensure next-text stays clamped
strength = strength.replace(/\.bb-next-t2 \{ font-size: 1\.1rem; font-weight: 700; margin-top: 2px; \}/g, '.bb-next-t2 { font-size: 1rem; font-weight: 700; margin-top: 0; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }');

// 4. Workout progress and total time spacing
// bb-center gap
strength = strength.replace(/\.bb-center \{\s*display: flex;\s*gap: 80px;/g, '.bb-center {\n                display: flex;\n                gap: 40px;');

// bb-progress and bb-time vertical gap (from 10px to 2px)
strength = strength.replace(/\.bb-progress \{\s*display: flex;\s*flex-direction: column;\s*gap: 10px;/g, '.bb-progress {\n                display: flex;\n                flex-direction: column;\n                gap: 2px;\n                padding: 0 10px;');

strength = strength.replace(/\.bb-time \{\s*display: flex;\s*flex-direction: column;\s*gap: 10px;/g, '.bb-time {\n                display: flex;\n                flex-direction: column;\n                gap: 2px;\n                padding: 0 10px;');

// time-val might need slightly smaller font to fit comfortably vertically
strength = strength.replace(/\.time-val \{\s*font-size: 2rem;/g, '.time-val {\n                font-size: 1.8rem;');

// Bump version in title string
strength = strength.replace(/>v2\.9<\/span>/g, '>v2.48</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', strength);

console.log('Strength page patched');
