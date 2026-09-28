const fs = require('fs');

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const searchRegex = /\$\{ex\.measurement_type === 'TIME' \? `[\s\S]*?<div style="font-size: 3\.5rem; font-weight: bold; font-family: monospace; color: white; text-align: center; margin-top: -10px; margin-bottom: 10px; text-shadow: 0 2px 10px rgba\(0,0,0,0\.5\);" id="active-timer">\$\{state\.activeTimeRemaining\}s<\/div>[\s\S]*?<button class="btn-complete btn-timer" id="btn-timer-toggle">\$\{iconClock\} START<\/button>[\s\S]*?` : `[\s\S]*?<button class="btn-complete btn-timer" id="btn-done">\$\{iconCheck\} COMPLETE<\/button>[\s\S]*?`\}[\s\S]*?\$\{ex\.measurement_type === 'TIME' \? `<button class="btn-complete btn-skip" id="btn-done" style="height: 50px; font-size: 1\.1rem; margin-top: 5px;">SKIP<\/button>` : ''\}[\s\S]*?\$\{ex\.name\.toLowerCase\(\)\.includes\('adductor'\) \? `<button class="btn-complete btn-howto" id="btn-howto" style="height: 50px; font-size: 1\.1rem; margin-top: 5px;">HELP<\/button>` : ''\}/;

const replaceBlock = `\${ex.measurement_type === 'TIME' ? \`
                            <div style="font-size: 3.5rem; font-weight: bold; font-family: monospace; color: white; text-align: center; margin-top: -10px; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);" id="active-timer">\${state.activeTimeRemaining}s</div>
                        \` : ''}
                        
                        <div style="display: flex; flex-direction: row; gap: 10px; width: 100%;">
                            \${ex.measurement_type === 'TIME' ? \`<button class="btn-complete btn-timer" id="btn-timer-toggle" style="flex: 1; height: 60px; font-size: 1.1rem; margin: 0; padding: 0;">\${iconClock} START</button>\` : \`<button class="btn-complete btn-timer" id="btn-done" style="flex: 1; height: 60px; font-size: 1.1rem; margin: 0; padding: 0;">\${iconCheck} COMPLETE</button>\`}
                            
                            \${ex.measurement_type === 'TIME' ? \`<button class="btn-complete btn-skip" id="btn-skip-timer" style="flex: 1; height: 60px; font-size: 1.1rem; margin: 0; padding: 0;">SKIP</button>\` : ''}
                            
                            \${ex.name.toLowerCase().includes('adductor') ? \`<button class="btn-complete btn-howto" id="btn-howto" style="flex: 1; height: 60px; font-size: 1.1rem; margin: 0; padding: 0;">HELP</button>\` : ''}
                        </div>`;

mob = mob.replace(searchRegex, replaceBlock);

// Also fix the bug in mobility where Skip uses id "btn-done" instead of a unique ID.
// Wait, I just named it "btn-skip-timer". I need to hook it up.
mob = mob.replace("const doneBtn = document.getElementById('btn-done');", 
                  "const doneBtn = document.getElementById('btn-done');\n      const skipBtn = document.getElementById('btn-skip-timer');");

mob = mob.replace("if (doneBtn) {", 
                  "if (skipBtn) {\n        skipBtn.addEventListener('click', () => {\n            clearInterval(state.timerInterval);\n            completeMobilitySet();\n        });\n    }\n    if (doneBtn) {");

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
