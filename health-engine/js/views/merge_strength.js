const fs = require('fs');

const dynamicCode = fs.readFileSync('C:\\\\DEV\\\\health-engine\\\\js\\\\views\\\\strength.dynamic.js', 'utf8');
const staticCode = fs.readFileSync('C:\\\\DEV\\\\health-engine\\\\js\\\\views\\\\strength.js', 'utf8');

// We are going to replace everything inside function renderActiveSet(content) { ... } in dynamicCode
// with the HTML layout from staticCode, but with template variables restored.

const newCssMatch = staticCode.match(/<style>([\s\S]*?)<\/style>/);
const newCss = newCssMatch ? newCssMatch[0] : '';

const newHtmlMatch = staticCode.match(/<div class="app-container">([\s\S]*?)<\/div>\s*<style>/);
const newHtml = newHtmlMatch ? '<div class="app-container">' + newHtmlMatch[1] + '</div>' : '';

// Now we need to manually write the interpolations into this newHtml
// I will just use string replacement on newHtml to insert the variables.

let replacedHtml = newHtml;

// 1. Replace the left rail with a dynamic loop
const leftRailRegex = /<aside class="left-rail">[\s\S]*?<\/aside>/;
const dynamicLeftRail = `
                <aside class="left-rail">
                    \${state.exercises.map((e, idx) => \`
                        <div class="rail-item \${idx === state.currentIndex ? 'active' : ''}">
                            <div class="rail-num">\${idx + 1}</div>
                            <img src="\${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='\${resolveAssetPath(null)}'" />
                            <div class="rail-text-col">
                                <div class="rail-title">\${e.name}</div>
                                <div class="rail-sub">\${e.sets} sets &middot; \${e.rep_min} - \${e.rep_max} reps</div>
                            </div>
                        </div>
                    \`).join('')}
                </aside>
`;
replacedHtml = replacedHtml.replace(leftRailRegex, dynamicLeftRail);

// 2. Replace the background image
replacedHtml = replacedHtml.replace(
    /url\('\$\{resolveAssetPath\('strength\/squat\.webp'\)\}'\)/g,
    "url('${resolveAssetPath(ex.image_path)}')"
);

// 3. Replace the Exercise Name and Stats
replacedHtml = replacedHtml.replace(/<h1 class="exercise-name">SQUAT<\/h1>/, '<h1 class="exercise-name">${ex.name.toUpperCase()}</h1>');
replacedHtml = replacedHtml.replace(/<div class="stat-val">3<\/div>/, '<div class="stat-val">${ex.sets}</div>');
replacedHtml = replacedHtml.replace(/<div class="stat-val">8 &ndash; 12<\/div>/, '<div class="stat-val">${ex.rep_min} &ndash; ${ex.rep_max}</div>');
replacedHtml = replacedHtml.replace(/<div class="stat-val">2:00<\/div>/, '<div class="stat-val">${formatRest(ex.rest_seconds)}</div>');

// 4. Replace Weight & Reps controls
// For weight:
replacedHtml = replacedHtml.replace(/<div class="ctrl-arrow-container">[\s\S]*?<\/div>\s*<div class="ctrl-val">80<\/div>\s*<div class="ctrl-arrow-container">[\s\S]*?<\/div>/,
    `<div class="ctrl-arrow-container" id="btn-weight-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
     <div class="ctrl-val">\${state.currentWeight}</div>
     <div class="ctrl-arrow-container" id="btn-weight-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>`
);
// For reps:
replacedHtml = replacedHtml.replace(/<div class="ctrl-arrow-container">[\s\S]*?<\/div>\s*<div class="ctrl-val">12<\/div>\s*<div class="ctrl-arrow-container">[\s\S]*?<\/div>/,
    `<div class="ctrl-arrow-container" id="btn-reps-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
     <div class="ctrl-val">\${state.currentReps}</div>
     <div class="ctrl-arrow-container" id="btn-reps-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>`
);

// Increment text
replacedHtml = replacedHtml.replace(/Increment: 2 kg/g, 'Increment: ${ex.progression_increment_kg} kg');

// 5. Replace Set Indicator and Button
replacedHtml = replacedHtml.replace(/SET <span class="set-num-hl">1<\/span> OF 3/, 'SET <span class="set-num-hl">${state.currentSet}</span> OF ${ex.sets}');
replacedHtml = replacedHtml.replace(/<button class="btn-complete">/, '<button class="btn-complete" id="btn-complete-set">');

// 6. Replace Bottom Bar Progress Dots
// Let's replace the whole <div class="dots-row"> ... </div> block
const dotsRegex = /<div class="dots-row">[\s\S]*?<\/div>\s*<\/div>/;
const dynamicDots = `
                        <div class="dots-row">
                            \${Array.from({length: ex.sets}).map((_, i) => \`
                                <div class="dot-col">
                                    <div class="dot \${i < state.currentSet ? 'active' : ''}"></div>
                                    <div class="dot-num \${i < state.currentSet ? 'hl' : ''}">\${i + 1}</div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
`;
replacedHtml = replacedHtml.replace(dotsRegex, dynamicDots);

// 7. Next Exercise text
const nextExBlock = `
                <div class="bb-btn-next">
                    <div class="bb-next-text">
                        <div class="bb-next-t1">NEXT EXERCISE</div>
                        <div class="bb-next-t2">\${state.currentIndex < state.exercises.length - 1 ? state.exercises[state.currentIndex + 1].name : 'None'}</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="color: #8892a0;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
`;
replacedHtml = replacedHtml.replace(/<div class="bb-btn-next">[\s\S]*?<\/div>\s*<\/footer>/, nextExBlock + '\n            </footer>');


// --- Construct the Final file ---

// I will just use dynamicCode as the base, and replace renderActiveSet entirely.
// Note: We also need to strip out getTopBarHTML, getBottomBarHTML, getSidebarHTML since our new HTML is a single big block.

const baseCode = `
import { getSupabase } from '../../supabase.js';
import { navigate } from '../router.js';
import { resolveAssetPath } from '../assets.js';

let state = {
    exercises: [],
    currentIndex: 0,
    currentSet: 1,
    recordedSets: [],
    startTime: null,
    timerInterval: null,
    mode: 'ACTIVE', // ACTIVE, REST, PROGRESSION, COMPLETE
    sessionData: null,
    currentReps: 0,
    currentWeight: 0,
    restTimeRemaining: 0
};

export async function renderStrength(container) {
    const iconDumbbell = \`<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>\`;
    const iconCheck = \`<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>\`;

    container.innerHTML = \`<div id="strength-content" style="width: 100vw; height: 100vh;">Loading...</div>\`;

    try {
        const { data: user } = await getSupabase().auth.getUser();
        if (!user.user) throw new Error("Not authenticated");
        
        const { data: exercises, error: exErr } = await getSupabase()
            .from('health_strength_exercises')
            .select('*')
            .eq('owner_id', user.user.id)
            .order('display_order', { ascending: true });
            
        if (exErr) throw exErr;
        
        const validEx = (exercises || []).filter(e => e.sets > 0);
        if (validEx.length === 0) {
            document.getElementById('strength-content').innerHTML = \`<h2 style="padding: 40px; color: white;">No exercises configured. Please visit PC Admin.</h2>\`;
            return;
        }

        state = {
            exercises: validEx,
            currentIndex: 0,
            currentSet: 1,
            recordedSets: [],
            startTime: Date.now(),
            timerInterval: setInterval(updateElapsedTimer, 1000),
            mode: 'ACTIVE',
            sessionData: null,
            currentReps: validEx[0].rep_max,
            currentWeight: validEx[0].current_weight_kg
        };
        
        renderCurrentState();

    } catch (err) {
        document.getElementById('strength-content').innerHTML = \`<h2 style="padding: 40px; color: white;">Error: \${err.message}</h2>\`;
    }
}

function updateElapsedTimer() {
    const els = document.querySelectorAll('.time-val');
    if (els.length > 0 && state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const txt = formatTotalTime(elapsed);
        els.forEach(el => el.textContent = txt);
    }
}

function formatTotalTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
}

function formatRest(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
}

function renderCurrentState() {
    const content = document.getElementById('strength-content');
    if (!content) return;
    
    if (state.mode === 'ACTIVE') {
        renderActiveSet(content);
    } else if (state.mode === 'REST') {
        renderRest(content);
    } else if (state.mode === 'PROGRESSION') {
        renderProgression(content);
    } else if (state.mode === 'COMPLETE') {
        renderComplete(content);
    }
}

function renderActiveSet(content) {
    const ex = state.exercises[state.currentIndex];
    const iconDumbbell = \`<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>\`;
    const iconCheck = \`<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>\`;

    content.innerHTML = \`
${replacedHtml}
${newCss}
    \`;

    // Rebind static header buttons
    document.getElementById('btn-home')?.addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end')?.addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    // Bind controls
    document.getElementById('btn-weight-up').addEventListener('click', () => {
        state.currentWeight += ex.progression_increment_kg;
        renderCurrentState();
    });
    document.getElementById('btn-weight-down').addEventListener('click', () => {
        if (state.currentWeight > 0) state.currentWeight -= ex.progression_increment_kg;
        renderCurrentState();
    });
    document.getElementById('btn-reps-up').addEventListener('click', () => {
        state.currentReps++;
        renderCurrentState();
    });
    document.getElementById('btn-reps-down').addEventListener('click', () => {
        if (state.currentReps > 0) state.currentReps--;
        renderCurrentState();
    });
    
    document.getElementById('btn-complete-set').addEventListener('click', () => {
        state.recordedSets.push({
            type: 'set',
            exercise_id: ex.id,
            exercise_name: ex.name,
            exercise_order: ex.display_order,
            set_number: state.currentSet,
            prescribed_rep_min: ex.rep_min,
            prescribed_rep_max: ex.rep_max,
            prescribed_weight_kg: ex.current_weight_kg,
            progression_increment_kg: ex.progression_increment_kg,
            actual_weight_kg: state.currentWeight,
            reps_completed: state.currentReps
        });
        
        if (state.currentSet >= ex.sets) {
            checkProgressionAndProceed();
        } else {
            state.restTimeRemaining = ex.rest_seconds;
            state.mode = 'REST';
            renderCurrentState();
        }
    });
    
    updateElapsedTimer();
}

function renderRest(content) {
    const ex = state.exercises[state.currentIndex];
    
    // Simple cinematic fallback for rest/progression that fits the dark UI
    content.innerHTML = \`
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
            <div style="font-size: 1rem; color: #8892a0; letter-spacing: 2px;">REST RECOVERY</div>
            <div style="font-size: 10rem; font-weight: bold; font-family: monospace; color: #007bff; margin: 20px 0; line-height: 1;" id="rest-display">\${formatTime(state.restTimeRemaining)}</div>
            <div style="background: #0a1424; padding: 25px 50px; border-radius: 16px; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.08); text-align:center;">
                <div style="font-size: 0.9rem; color: #8892a0; margin-bottom: 10px;">UP NEXT</div>
                <div style="font-size: 2.5rem; font-weight: bold; color: white;">\${ex.name}</div>
                <div style="color: #007bff; font-weight: bold; margin-top: 10px; font-size: 1.2rem;">SET \${state.currentSet + 1} OF \${ex.sets}</div>
            </div>
            <button style="background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 20px 60px; font-size: 1.5rem; font-weight: bold; border-radius: 12px; cursor: pointer;" id="btn-skip-rest">SKIP REST</button>
        </div>
    \`;
    
    updateElapsedTimer();
    
    let restInterval = setInterval(() => {
        state.restTimeRemaining--;
        const disp = document.getElementById('rest-display');
        if (disp) {
            disp.textContent = formatTime(state.restTimeRemaining);
        }
        
        if (state.restTimeRemaining <= 0) {
            clearInterval(restInterval);
            finishRest();
        }
    }, 1000);
    
    document.getElementById('btn-skip-rest').addEventListener('click', () => {
        clearInterval(restInterval);
        finishRest();
    });
}

function finishRest() {
    state.currentSet++;
    const ex = state.exercises[state.currentIndex];
    state.currentReps = ex.rep_max;
    state.mode = 'ACTIVE';
    renderCurrentState();
}

function checkProgressionAndProceed() {
    const ex = state.exercises[state.currentIndex];
    const exSets = state.recordedSets.filter(s => s.exercise_id === ex.id);
    const earned = exSets.every(s => s.reps_completed >= s.prescribed_rep_max) && exSets.length >= ex.sets;
    
    if (earned) {
        state.mode = 'PROGRESSION';
    } else {
        advanceExercise();
    }
    renderCurrentState();
}

function advanceExercise() {
    state.currentIndex++;
    if (state.currentIndex >= state.exercises.length) {
        state.mode = 'COMPLETE';
    } else {
        state.currentSet = 1;
        const nextEx = state.exercises[state.currentIndex];
        state.currentReps = nextEx.rep_max;
        state.currentWeight = nextEx.current_weight_kg;
        state.mode = 'ACTIVE';
    }
    renderCurrentState();
}

function renderProgression(content) {
    const ex = state.exercises[state.currentIndex];
    const newWeight = ex.current_weight_kg + ex.progression_increment_kg;
    
    content.innerHTML = \`
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
            <div style="background: #007bff; color: white; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 2.5rem; margin-bottom: 30px;">
                PROGRESSION EARNED!
            </div>
            <h2 style="font-size: 3.5rem; font-weight: 800; margin: 0 0 10px 0; color: white;">\${ex.name}</h2>
            <p style="font-size: 1.2rem; color: #8892a0;">You completed all sets at the maximum target.</p>
            
            <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 50px 0;">
                <div style="font-size: 3rem; color: #8892a0;">\${ex.current_weight_kg} kg</div>
                <div style="color: white;">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </div>
                <div style="font-size: 4.5rem; color: #007bff; font-weight: bold;">\${newWeight} kg</div>
            </div>
            
            <div style="display: flex; gap: 20px; width: 100%; max-width: 600px;">
                <button style="background: #28a745; color: white; padding: 25px; border-radius: 16px; font-size: 1.5rem; font-weight: 800; flex: 2; cursor: pointer; border: none;" id="btn-accept">ACCEPT INCREASE</button>
                <button style="background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 25px; border-radius: 16px; font-size: 1.5rem; font-weight: bold; flex: 1; cursor: pointer;" id="btn-stay">STAY AT \${ex.current_weight_kg}</button>
            </div>
        </div>
    \`;
    updateElapsedTimer();
    
    document.getElementById('btn-accept').addEventListener('click', () => handleProgressionDecision(true, newWeight));
    document.getElementById('btn-stay').addEventListener('click', () => handleProgressionDecision(false, ex.current_weight_kg));
}

async function handleProgressionDecision(accepted, finalWeight) {
    const ex = state.exercises[state.currentIndex];
    
    state.recordedSets.push({
        type: 'progression',
        exercise_id: ex.id,
        exercise_name: ex.name,
        accepted,
        old_weight: ex.current_weight_kg,
        new_weight: finalWeight
    });
    
    advanceExercise();
    renderCurrentState();
}

function renderComplete(content) {
    clearInterval(state.timerInterval);
    content.innerHTML = \`
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
            <div style="text-align: center;">
                <h1 style="font-size: 5rem; color: #28a745; margin-bottom: 20px;">WORKOUT COMPLETE</h1>
                <p style="font-size: 2rem; color: #8892a0;">Saving session data...</p>
            </div>
        </div>
    \`;
    saveAndExit();
}

async function saveAndExit() {
    clearInterval(state.timerInterval);
    const duration = Math.floor((Date.now() - state.startTime) / 1000);
    
    try {
        const { data: user } = await getSupabase().auth.getUser();
        if (!user.user) throw new Error("Not authenticated");
        
        const { data: session, error: sErr } = await getSupabase().from('health_strength_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            completed_at: new Date().toISOString(),
            status: 'completed'
        }).select().single();
        if (sErr) throw sErr;
        
        const setsToInsert = [];
        const progs = [];
        
        for (const item of state.recordedSets) {
            if (item.type === 'progression') {
                progs.push({
                    owner_id: user.user.id,
                    session_id: session.id,
                    exercise_id: item.exercise_id,
                    exercise_name: item.exercise_name,
                    previous_weight_kg: item.old_weight,
                    recommended_weight_kg: item.new_weight,
                    decision: item.accepted ? 'accepted' : 'stayed'
                });
                
                if (item.accepted) {
                    await getSupabase().from('health_strength_exercises')
                        .update({ current_weight_kg: item.new_weight })
                        .eq('id', item.exercise_id);
                }
            } else {
                setsToInsert.push({
                    owner_id: user.user.id,
                    session_id: session.id,
                    exercise_id: item.exercise_id,
                    exercise_name: item.exercise_name,
                    exercise_order: item.exercise_order,
                    set_number: item.set_number,
                    prescribed_rep_min: item.prescribed_rep_min,
                    prescribed_rep_max: item.prescribed_rep_max,
                    prescribed_weight_kg: item.prescribed_weight_kg,
                    progression_increment_kg: item.progression_increment_kg,
                    actual_weight_kg: item.actual_weight_kg,
                    reps_completed: item.reps_completed
                });
            }
        }
        
        if (setsToInsert.length > 0) {
            const { error: setErr } = await getSupabase().from('health_strength_sets').insert(setsToInsert);
            if (setErr) throw setErr;
        }
        
        if (progs.length > 0) {
            const { error: pErr } = await getSupabase().from('health_strength_progression_events').insert(progs);
            if (pErr) throw pErr;
        }
        
        navigate('/tv');
        
    } catch (err) {
        alert("Failed to save workout data: " + err.message);
        console.error(err);
        navigate('/tv');
    }
}
`;

fs.writeFileSync('C:\\\\DEV\\\\health-engine\\\\js\\\\views\\\\strength_merged.js', baseCode);
