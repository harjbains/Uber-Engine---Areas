const fs = require('fs');
const { execSync } = require('child_process');

execSync('git restore js/views/mobility.js');

let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// The replacement template strings
const activeHTMLStr = "`\n" + `
<div class="app-container tv-shell">
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">\${iconDumbbell}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.51</span></div>
                <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
            </div>
        </div>
        <div class="tv-header-center">
            <button class="tv-nav-home" id="btn-top-home">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                Home
            </button>
        </div>
        <div class="tv-header-right">
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <div class="tv-right-title">MOBILITY WORKFLOW</div>
                <div class="tv-right-sub">Exercise \${state.currentIndex + 1} of \${state.exercises.length}</div>
            </div>
        </div>
    </header>
    
    <div class="main-content tv-main">
        <aside class="left-rail">
            \${state.exercises.map((e, idx) => \`
                <div class="rail-item \${idx === state.currentIndex ? 'active' : ''} sb-item" tabindex="0" data-index="\${idx}" style="cursor: pointer; transition: background-color 0.2s;">
                    <div class="rail-num">\${idx + 1}</div>
                    <img src="\${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='\${resolveAssetPath(null)}'" />
                    <div class="rail-text-col">
                        <div class="rail-title">\${e.name}</div>
                        <div class="rail-sub">\${e.sets} sets &middot; \${e.target_value} \${e.measurement_type === 'TIME' ? 'sec' : 'reps'}</div>
                    </div>
                </div>
            \`).join('')}
        </aside>

        <main class="workout-panel">
            <div class="wp-bg" style="background-image: url('\${resolveAssetPath(ex.image_path)}');"></div>
            <div class="wp-overlay"></div>
            <div class="wp-content">
                <div class="wp-left">
                    <div class="wp-top-left">
                        <h1 class="exercise-name">\${ex.name.toUpperCase()}</h1>
                        <div class="stats-row">
                            <div class="stat-col"><div class="stat-lbl">SETS</div><div class="stat-val">\${ex.sets}</div></div>
                            <div class="stat-divider"></div>
                            <div class="stat-col"><div class="stat-lbl">TARGET</div><div class="stat-val">\${ex.target_value} \${ex.measurement_type === 'TIME' ? 's' : 'reps'}</div></div>
                        </div>
                    </div>
                    <div class="wp-bottom-left"></div>
                </div>
                
                <div class="wp-right">
                    <div class="wp-bottom-right">
                        <div class="set-indicator" style="background: rgba(5,8,16,0.9);">SET <span class="set-num-hl" style="color: #8a2be2;">\${state.currentSet}</span> OF \${ex.sets} \${sideText}</div>
                        
                        \${ex.measurement_type === 'TIME' ? \`
                            <div style="font-size: 3.5rem; font-weight: bold; font-family: monospace; color: white; text-align: center; margin-top: -10px; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);" id="active-timer">\${state.activeTimeRemaining}s</div>
                            <button class="btn-complete btn-timer" id="btn-timer-toggle">\${iconClock} START</button>
                        \` : \`
                            <button class="btn-complete btn-timer" id="btn-done">\${iconCheck} COMPLETE</button>
                        \`}
                        
                        \${ex.measurement_type === 'TIME' ? \`<button class="btn-complete btn-skip" id="btn-done" style="height: 50px; font-size: 1.1rem; margin-top: 5px;">SKIP</button>\` : ''}
                        
                        \${ex.name.toLowerCase().includes('adductor') ? \`<button class="btn-complete btn-howto" id="btn-howto" style="height: 50px; font-size: 1.1rem; margin-top: 5px;">HOW TO</button>\` : ''}
                    </div>
                </div>
            </div>
        </main>
    </div>

    <footer class="bottom-bar tv-footer">
        <div class="bb-btn-end" tabindex="0" id="btn-end-workout">
            <div class="bb-end-x">&times;</div>
            <div class="bb-end-text">
                <div class="bb-end-t1">END WORKOUT</div>
                <div class="bb-end-t2">Save and exit</div>
            </div>
        </div>
        
        <div class="bb-center">
            <div class="bb-progress">
                <div class="bb-lbl">WORKOUT PROGRESS</div>
                <div class="bb-dots">
                    \${state.exercises.map((e, idx) => \`
                        <div class="bb-dot-col">
                            <div class="bb-dot \${idx < state.currentIndex ? 'completed' : idx === state.currentIndex ? 'active' : ''} \${idx === state.currentIndex ? 'sb-item' : ''}"></div>
                            <div class="bb-dot-num">\${idx + 1}</div>
                        </div>
                    \`).join('')}
                </div>
            </div>
            
            <div class="bb-time">
                <div class="bb-lbl">TOTAL TIME</div>
                <div class="bb-time-val time-val">00:00:00</div>
            </div>
        </div>
        
        <div class="bb-btn-next" tabindex="0" style="visibility: hidden;"></div>
    </footer>
</div>` + "\`;";

const restHTMLStr = "`\n" + `
<div class="app-container tv-shell">
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">\${iconDumbbell}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.51</span></div>
                <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
            </div>
        </div>
        <div class="tv-header-center">
            <button class="tv-nav-home" id="btn-home">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                Home
            </button>
        </div>
        <div class="tv-header-right">
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <div class="tv-right-title">MOBILITY WORKFLOW</div>
                <div class="tv-right-sub">Exercise \${state.currentIndex + 1} of \${state.exercises.length}</div>
            </div>
        </div>
    </header>
    
    <div class="main-content tv-main">
        <aside class="left-rail">
            \${state.exercises.map((e, idx) => \`
                <div class="rail-item \${idx === state.currentIndex ? 'active' : ''} sb-item" tabindex="0" data-index="\${idx}" style="cursor: pointer; transition: background-color 0.2s;">
                    <div class="rail-num">\${idx + 1}</div>
                    <img src="\${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='\${resolveAssetPath(null)}'" />
                    <div class="rail-text-col">
                        <div class="rail-title">\${e.name}</div>
                        <div class="rail-sub">\${e.sets} sets &middot; \${e.target_value} \${e.measurement_type === 'TIME' ? 'sec' : 'reps'}</div>
                    </div>
                </div>
            \`).join('')}
        </aside>

        <main class="workout-panel">
            <div class="wp-bg" style="background-image: url('\${resolveAssetPath(ex.image_path)}'); opacity: 0.3;"></div>
            <div class="wp-overlay"></div>
            <div class="wp-content" style="align-items: center; justify-content: center; flex-direction: column; text-align: center;">
                <h2 style="font-size: 1.5rem; color: #aaa; letter-spacing: 2px;">REST RECOVERY</h2>
                <div style="font-size: 7rem; font-weight: bold; font-family: monospace; color: white; line-height: 1.2;" id="rest-display">\${formatTime(state.restTimeRemaining)}</div>
                
                <div style="background: rgba(13,27,51,0.8); padding: 30px 60px; border-radius: 20px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 1rem; color: #8892a0; letter-spacing: 2px; margin-bottom: 10px;">UP NEXT</div>
                    <div style="font-size: 2.5rem; font-weight: bold; color: white;">\${ex.name}\${sideText}</div>
                    <div style="font-size: 1.2rem; color: #8a2be2; font-weight: bold; margin-top: 10px;">SET \${(ex.per_side && state.currentSide==='LEFT') ? state.currentSet : state.currentSet + 1} OF \${ex.sets}</div>
                </div>
                
                <button class="btn-complete btn-skip" id="btn-skip-rest" style="margin-top: 40px; padding: 0 40px;">SKIP REST</button>
            </div>
        </main>
    </div>
    
    <footer class="bottom-bar tv-footer">
        <div class="bb-btn-end" tabindex="0" id="btn-end-workout">
            <div class="bb-end-x">&times;</div>
            <div class="bb-end-text">
                <div class="bb-end-t1">END WORKOUT</div>
                <div class="bb-end-t2">Save and exit</div>
            </div>
        </div>
        
        <div class="bb-center">
            <div class="bb-progress">
                <div class="bb-lbl">WORKOUT PROGRESS</div>
                <div class="bb-dots">
                    \${state.exercises.map((e, idx) => \`
                        <div class="bb-dot-col">
                            <div class="bb-dot \${idx < state.currentIndex ? 'completed' : idx === state.currentIndex ? 'active' : ''} \${idx === state.currentIndex ? 'sb-item' : ''}"></div>
                            <div class="bb-dot-num">\${idx + 1}</div>
                        </div>
                    \`).join('')}
                </div>
            </div>
            
            <div class="bb-time">
                <div class="bb-lbl">TOTAL TIME</div>
                <div class="bb-time-val time-val">00:00:00</div>
            </div>
        </div>
        
        <div class="bb-btn-next" tabindex="0" style="visibility: hidden;"></div>
    </footer>
</div>` + "\`;";

const completeHTMLStr = "`\n" + `
<div class="app-container tv-shell">
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">\${iconDumbbell}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.51</span></div>
                <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
            </div>
        </div>
        <div class="tv-header-center">
            <button class="tv-nav-home" id="btn-home">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                Home
            </button>
        </div>
        <div class="tv-header-right">
        </div>
    </header>
    
    <div class="main-content tv-main" style="justify-content: center; align-items: center; background: #0b101e;">
        <div style="text-align: center;">
            <h1 style="font-size: 5rem; color: #8a2be2; margin-bottom: 20px;">MOBILITY COMPLETE</h1>
            <p style="font-size: 1.5rem; color: #aaa; margin-bottom: 40px;">Great job! You have finished the mobility workflow.</p>
            <button class="btn-complete btn-timer" id="btn-finish-workflow" style="margin: 0 auto; padding: 20px 60px;">RETURN TO HOME</button>
        </div>
    </div>
</div>` + "\`;";

// Replace the render functions ENTIRELY
const renderActiveSetBody = `
    const ex = state.exercises[state.currentIndex];
    const sideText = state.currentSide === 'NONE' ? '' : \` (\${state.currentSide})\`;
    
    // Default fallback to 0 if undefined
    if (state.activeTimeRemaining === undefined) state.activeTimeRemaining = ex.target_value;
    
    content.innerHTML = ${activeHTMLStr}
    
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    const timerDisplay = document.getElementById('active-timer');
    const toggleBtn = document.getElementById('btn-timer-toggle');
    const doneBtn = document.getElementById('btn-done');
    const howtoBtn = document.getElementById('btn-howto');
    
    let isRunning = false;
    
    if (ex.measurement_type === 'TIME' && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isRunning) {
                isRunning = false;
                clearInterval(state.timerInterval);
                toggleBtn.innerHTML = \`\$\{iconClock\} RESUME\`;
            } else {
                isRunning = true;
                toggleBtn.innerHTML = \`\$\{iconClock\} PAUSE\`;
                state.timerInterval = setInterval(() => {
                    state.activeTimeRemaining--;
                    if (timerDisplay) timerDisplay.textContent = state.activeTimeRemaining + 's';
                    if (state.activeTimeRemaining <= 0) {
                        clearInterval(state.timerInterval);
                        completeMobilitySet();
                    }
                }, 1000);
            }
        });
    }
    
    if (doneBtn) {
        doneBtn.addEventListener('click', () => {
            clearInterval(state.timerInterval);
            completeMobilitySet();
        });
    }
    
    if (howtoBtn) {
        howtoBtn.addEventListener('click', () => {
            const bg = document.querySelector('.wp-bg');
            if (bg.style.backgroundSize === 'contain') {
                bg.style.backgroundSize = 'cover';
                howtoBtn.innerHTML = 'HOW TO';
            } else {
                bg.style.backgroundSize = 'contain';
                howtoBtn.innerHTML = 'BACK TO EXERCISE';
            }
        });
    }
`;

const renderRestBody = `
    const ex = state.exercises[state.currentIndex];
    const sideText = state.currentSide === 'NONE' ? '' : \` (\${state.currentSide})\`;
    
    content.innerHTML = ${restHTMLStr}
    
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    document.getElementById('btn-skip-rest').addEventListener('click', () => {
        clearInterval(state.timerInterval);
        state.mode = 'ACTIVE';
        renderCurrentState();
    });
`;

const renderCompleteBody = `
    content.innerHTML = ${completeHTMLStr}
    document.getElementById('btn-finish-workflow').addEventListener('click', () => navigate('/tv'));
`;

code = code.replace(/function renderActiveSet\(content\) \{[\s\S]*?function recordSet/g, `function renderActiveSet(content) { ${renderActiveSetBody} }\n\nfunction recordSet`);
code = code.replace(/function renderRest\(content\) \{[\s\S]*?function renderComplete/g, `function renderRest(content) { ${renderRestBody} }\n\nfunction renderComplete`);
code = code.replace(/function renderComplete\(content\) \{[\s\S]*?function bindSidebarAndNext/g, `function renderComplete(content) { ${renderCompleteBody} }\n\nfunction bindSidebarAndNext`);


// Replace styles
const strengthCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
const strengthStylesMatch = strengthCode.match(/<style>([\s\S]*?)<\/style>/);
let newStyles = strengthStylesMatch[1];
newStyles += `
    .sb-item.active { background-color: #8a2be2 !important; border-color: #8a2be2 !important; box-shadow: 0 4px 15px rgba(138,43,226,0.3) !important; }
    .btn-timer { background-color: #8a2be2; box-shadow: 0 4px 15px rgba(138,43,226,0.3); }
    .btn-skip { background-color: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); box-shadow: none; }
    .btn-howto { background-color: #007bff; box-shadow: 0 4px 15px rgba(0,123,255,0.3); }
    .btn-complete {
        background-color: #28a745; color: white; border-radius: 16px; height: 70px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.4rem; font-weight: 700; letter-spacing: 1px;
        transition: all 0.2s; box-shadow: 0 4px 15px rgba(40,167,69,0.3); border: none; outline: none; cursor: pointer;
    }
    .btn-complete:hover { transform: scale(1.02); filter: brightness(1.1); }
`;
code = code.replace(/<style>[\s\S]*?<\/style>/, `<style>${newStyles}</style>`);
code = code.replace(/>v2\.32<\/span>/g, '>v2.51</span>');

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', code);

// Update versions
const indexHtmlPath = 'C:\\DEV\\health-engine\\index.html';
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/v=2\.32/g, 'v=2.51');
fs.writeFileSync(indexHtmlPath, indexHtml);

const appJsPath = 'C:\\DEV\\health-engine\\js\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/v=2\.32/g, 'v=2.51');
fs.writeFileSync(appJsPath, appJs);

console.log('Final rewrite applied with hardcoded string literals to avoid undefined vars');
