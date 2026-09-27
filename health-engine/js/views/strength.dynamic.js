import { navigate } from '../router.js';
import { getSupabase } from '../supabase.js';
import { resolveAssetPath } from '../assets.js';

let state = {
    exercises: [],
    currentIndex: 0,
    currentSet: 1,
    recordedSets: [],
    startTime: null,
    restTimeRemaining: 0,
    timerInterval: null,
    mode: 'LOADING',
    sessionData: null,
    currentReps: 0,
    currentWeight: 0
};

let restInterval = null;

function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTotalTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>`;
const iconUp = `<svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M7 14l5-5 5 5z"/></svg>`;
const iconDown = `<svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36"><path d="M7 10l5 5 5-5z"/></svg>`;
const iconCheck = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

export async function renderStrength(container) {
    container.innerHTML = `
        <div style="background: #050810; height: 100vh; display: flex; flex-direction: column; color: white; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden; width: 100vw;">
            <div id="strength-content" style="flex: 1; display: flex; flex-direction: column; width: 100%; height: 100%;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>
        <style>
            * { box-sizing: border-box; }
            button { outline: none; border: none; cursor: pointer; font-family: inherit; }
            
            /* Typography & Colors */
            .text-grey { color: #8892a0; }
            .text-blue { color: #007bff; }
            .text-white { color: #ffffff; }
            .bg-blue { background-color: #007bff; }
            .bg-purple { background-color: #8a2be2; }
            .bg-green { background-color: #28a745; }
            .bg-dark-panel { background-color: #0b111e; }
            .bg-darker-panel { background-color: #070b14; }
            
            /* Top Bar */
            .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 25px 40px; background: transparent; height: 110px; }
            .brand-area { display: flex; align-items: center; gap: 15px; width: 400px; }
            .brand-icon { color: #007bff; display: flex; align-items: center; justify-content: center; }
            .brand-text-block { display: flex; flex-direction: column; }
            .brand-title { margin: 0; font-size: 2.2rem; font-weight: 800; letter-spacing: 1px; line-height: 1; }
            .brand-tag { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; color: #8892a0; }
            
            .center-nav { display: flex; align-items: center; gap: 10px; flex: 1; padding-left: 20px; font-size: 1.4rem; color: #8892a0; transition: 0.2s; cursor: pointer; }
            .center-nav:hover { color: #fff; }
            
            .right-header { display: flex; flex-direction: column; text-align: right; justify-content: center; }
            .rh-title { font-size: 1.6rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
            .rh-sub { font-size: 1rem; color: #8892a0; margin-top: 5px; }
            
            /* Main Flex Area */
            .main-body { display: flex; flex: 1; padding: 0 40px 20px 40px; gap: 30px; overflow: hidden; height: calc(100vh - 230px); }
            
            /* Left Rail */
            .left-rail { width: 380px; display: flex; flex-direction: column; gap: 10px; overflow-y: hidden; height: 100%; }
            .lr-item { display: flex; align-items: center; gap: 15px; padding: 12px 20px; border-radius: 12px; background: #0a0f1a; border: 1px solid rgba(255,255,255,0.03); height: 85px; }
            .lr-item.active { background: #007bff; border-color: #007bff; }
            
            .lr-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; flex-shrink: 0; border: 2px solid #8892a0; color: #8892a0; }
            .lr-item.active .lr-num { border-color: transparent; background: #050810; color: white; }
            
            .lr-img { width: 70px; height: 50px; border-radius: 8px; object-fit: cover; flex-shrink: 0; filter: brightness(0.6); border: 1px solid rgba(255,255,255,0.1); }
            .lr-item.active .lr-img { filter: brightness(1); }
            
            .lr-text { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
            .lr-name { font-size: 1.25rem; font-weight: 700; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: #8892a0; }
            .lr-item.active .lr-name { color: white; }
            .lr-sub { font-size: 0.85rem; color: #667280; margin-top: 4px; white-space: nowrap; }
            .lr-item.active .lr-sub { color: rgba(255,255,255,0.8); }
            
            /* Main Workout Panel */
            .workout-panel { flex: 1; background: #0b111e; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px; display: flex; gap: 40px; height: 100%; }
            .wp-left { flex: 1.2; display: flex; flex-direction: column; justify-content: space-between; }
            .wp-right { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
            
            /* Top Left: Title & Stats */
            .exercise-title { font-size: 4.5rem; font-weight: 900; margin: 0 0 25px 0; letter-spacing: 2px; text-transform: uppercase; line-height: 1; }
            .stats-row { display: flex; gap: 50px; }
            .stat-box { display: flex; flex-direction: column; gap: 8px; }
            .stat-label { font-size: 0.9rem; color: #8892a0; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase; }
            .stat-val { font-size: 2rem; font-weight: 800; color: white; }
            
            /* Bottom Left: Controls */
            .controls-area { display: flex; gap: 20px; align-items: flex-end; }
            .ctrl-col { border-radius: 20px; display: flex; flex-direction: column; align-items: center; width: 220px; padding: 20px 20px 15px 20px; }
            .ctrl-label { font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 10px; text-transform: uppercase; color: white; }
            .ctrl-val-box { background: #050810; width: 100%; text-align: center; border-radius: 12px; margin: 5px 0; display: flex; justify-content: center; align-items: center; height: 90px; }
            .ctrl-val-text { font-size: 3.5rem; font-weight: 800; color: white; line-height: 1; }
            .ctrl-sub { font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-top: 10px; }
            .btn-arr { background: transparent; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; width: 100%; height: 35px; transition: 0.1s; opacity: 0.8; }
            .btn-arr:hover { opacity: 1; transform: scale(1.1); }
            
            /* Right Side Elements */
            .exercise-img { width: 100%; height: 380px; border-radius: 16px; object-fit: cover; border: 1px solid rgba(255,255,255,0.05); }
            
            .submit-area { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
            .set-counter { background: #050810; border-radius: 16px; height: 70px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; font-weight: 700; letter-spacing: 2px; color: #8892a0; border: 1px solid rgba(255,255,255,0.02); }
            .set-counter .hl { color: #007bff; font-size: 2.2rem; margin: 0 8px; font-weight: 800; }
            .btn-complete { background: #28a745; color: white; width: 100%; height: 80px; border-radius: 16px; font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 15px; transition: 0.2s; box-shadow: 0 5px 20px rgba(40, 167, 69, 0.3); }
            .btn-complete:hover { filter: brightness(1.1); }
            
            /* Bottom Status Bar */
            .bottom-bar { background: #070b14; height: 120px; display: flex; align-items: center; padding: 0 40px; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
            
            .bb-end { background: #13192a; border-radius: 16px; height: 70px; padding: 0 25px; display: flex; align-items: center; gap: 15px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
            .bb-end:hover { background: #1a2238; }
            .bb-end-icon { font-size: 1.8rem; font-weight: bold; color: white; }
            .bb-end-text-group { display: flex; flex-direction: column; justify-content: center; }
            .bb-end-title { font-size: 1rem; font-weight: bold; color: white; letter-spacing: 1px; }
            .bb-end-sub { font-size: 0.8rem; color: #8892a0; margin-top: 2px; }
            
            .bb-center { display: flex; align-items: center; gap: 80px; }
            .bb-block { display: flex; flex-direction: column; gap: 10px; }
            .bb-block-title { font-size: 0.8rem; color: #8892a0; letter-spacing: 2px; font-weight: 700; text-transform: uppercase; }
            
            .prog-dots-container { display: flex; gap: 15px; align-items: center; }
            .p-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
            .p-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #667280; background: transparent; }
            .p-dot.filled { background: #007bff; border-color: #007bff; }
            .p-num { font-size: 0.8rem; color: #667280; font-weight: bold; }
            .p-num.active { color: white; }
            
            .time-val { font-size: 2.2rem; font-weight: 800; color: white; font-family: monospace; letter-spacing: 2px; line-height: 1; }
            
            .bb-next { background: #13192a; border-radius: 16px; height: 70px; padding: 0 25px; display: flex; align-items: center; gap: 25px; border: 1px solid rgba(255,255,255,0.05); }
            .bb-next-text { display: flex; flex-direction: column; text-align: right; }
            .bb-next-title { font-size: 0.8rem; color: #8892a0; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
            .bb-next-val { font-size: 1.1rem; font-weight: bold; color: white; }
            
        </style>
    `;

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
            document.getElementById('strength-content').innerHTML = `<h2 style="padding: 40px;">No exercises configured. Please visit PC Admin.</h2>`;
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
        document.getElementById('strength-content').innerHTML = `<h2 style="padding: 40px;">Error: ${err.message}</h2>`;
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

function getTopBarHTML() {
    return `
        <header class="top-bar">
            <div class="brand-area">
                <div class="brand-icon">${iconDumbbell}</div>
                <div class="brand-text-block">
                    <h1 class="brand-title">FITNESS <span class="text-blue">ENGINE</span></h1>
                    <div class="brand-tag">STRONGER &middot; FITTER &middot; HEALTHIER</div>
                </div>
            </div>
            <div class="center-nav" id="btn-top-home">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                <span>Home</span>
            </div>
            <div class="right-header">
                <div class="rh-title">STRENGTH WORKOUT</div>
                <div class="rh-sub">Exercise ${state.currentIndex + 1} of ${state.exercises.length}</div>
            </div>
        </header>
    `;
}

function getSidebarHTML() {
    let html = '<aside class="left-rail">';
    state.exercises.forEach((ex, idx) => {
        const isActive = idx === state.currentIndex;
        let cls = 'lr-item';
        if (isActive) cls += ' active';
        
        html += `
            <div class="${cls}">
                <div class="lr-num">${idx + 1}</div>
                <img class="lr-img" src="${resolveAssetPath(ex.image_path)}" onerror="this.src='${resolveAssetPath(null)}'" />
                <div class="lr-text">
                    <div class="lr-name">${ex.name}</div>
                    <div class="lr-sub">${ex.sets} sets &middot; ${ex.rep_min} - ${ex.rep_max} reps</div>
                </div>
            </div>
        `;
    });
    html += '</aside>';
    return html;
}

function getBottomBarHTML() {
    const nextEx = state.currentIndex + 1 < state.exercises.length ? state.exercises[state.currentIndex + 1] : null;
    
    let dotsHtml = '';
    for(let i=0; i<state.exercises.length; i++) {
        let dotCls = 'p-dot';
        let numCls = 'p-num';
        if (i <= state.currentIndex) {
            dotCls += ' filled';
            numCls += ' active';
        }
        dotsHtml += `
            <div class="p-col">
                <div class="${dotCls}"></div>
                <div class="${numCls}">${i + 1}</div>
            </div>
        `;
    }
    
    return `
        <footer class="bottom-bar">
            <button class="bb-end" id="btn-end-workout">
                <div class="bb-end-icon">&times;</div>
                <div class="bb-end-text-group">
                    <div class="bb-end-title">END WORKOUT</div>
                    <div class="bb-end-sub">Save and exit</div>
                </div>
            </button>
            
            <div class="bb-center">
                <div class="bb-block" style="align-items: center;">
                    <div class="bb-block-title">WORKOUT PROGRESS</div>
                    <div class="prog-dots-container">
                        ${dotsHtml}
                    </div>
                </div>
                <div class="bb-block" style="margin-left: 20px;">
                    <div class="bb-block-title">TOTAL TIME</div>
                    <div class="time-val">00:00:00</div>
                </div>
            </div>
            
            <div class="bb-next">
                <div class="bb-next-text">
                    <div class="bb-next-title">NEXT EXERCISE</div>
                    <div class="bb-next-val">${nextEx ? nextEx.name : 'Finish'}</div>
                </div>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="color: #8892a0;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
        </footer>
    `;
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
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body">
            ${getSidebarHTML()}
            
            <main class="workout-panel">
                <div class="wp-left">
                    <div>
                        <h1 class="exercise-title">${ex.name}</h1>
                        <div class="stats-row">
                            <div class="stat-box">
                                <div class="stat-label">SETS</div>
                                <div class="stat-val">${ex.sets}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">REP RANGE</div>
                                <div class="stat-val">${ex.rep_min} &ndash; ${ex.rep_max}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">REST</div>
                                <div class="stat-val">${formatTime(ex.rest_seconds)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="controls-area">
                        <div class="ctrl-col bg-blue">
                            <div class="ctrl-label">WEIGHT (KG)</div>
                            <button class="btn-arr" id="btn-wt-inc">${iconUp}</button>
                            <div class="ctrl-val-box">
                                <div class="ctrl-val-text">${state.currentWeight.toFixed(1).replace('.0', '')}</div>
                            </div>
                            <button class="btn-arr" id="btn-wt-dec">${iconDown}</button>
                            <div class="ctrl-sub">Increment: ${ex.progression_increment_kg} kg</div>
                        </div>
                        
                        <div class="ctrl-col bg-purple">
                            <div class="ctrl-label">REPS COMPLETED</div>
                            <button class="btn-arr" id="btn-rep-inc">${iconUp}</button>
                            <div class="ctrl-val-box">
                                <div class="ctrl-val-text">${state.currentReps}</div>
                            </div>
                            <button class="btn-arr" id="btn-rep-dec">${iconDown}</button>
                        </div>
                    </div>
                </div>
                
                <div class="wp-right">
                    <img src="${resolveAssetPath(ex.image_path)}" class="exercise-img" onerror="this.src='${resolveAssetPath(null)}'" />
                    
                    <div class="submit-area">
                        <div class="set-counter">SET <span class="hl">${state.currentSet}</span> OF ${ex.sets}</div>
                        <button class="btn-complete" id="btn-record">${iconCheck} COMPLETE SET</button>
                    </div>
                </div>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    
    updateElapsedTimer();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    document.getElementById('btn-wt-inc').addEventListener('click', () => { state.currentWeight += 0.5; renderCurrentState(); });
    document.getElementById('btn-wt-dec').addEventListener('click', () => { if (state.currentWeight > 0.5) state.currentWeight -= 0.5; renderCurrentState(); });
    
    document.getElementById('btn-rep-inc').addEventListener('click', () => { state.currentReps++; renderCurrentState(); });
    document.getElementById('btn-rep-dec').addEventListener('click', () => { if (state.currentReps > 0) state.currentReps--; renderCurrentState(); });
    
    document.getElementById('btn-record').addEventListener('click', () => {
        state.recordedSets.push({
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
        
        if (state.currentSet < ex.sets) {
            state.restTimeRemaining = ex.rest_seconds;
            state.mode = 'REST';
            renderCurrentState();
        } else {
            checkProgressionAndProceed();
        }
    });
}

function renderRest(content) {
    const ex = state.exercises[state.currentIndex];
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body" style="justify-content: center; align-items: center;">
            <main class="workout-panel" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; flex: none; width: 800px; height: 600px;">
                <div class="stat-label">REST RECOVERY</div>
                <div style="font-size: 10rem; font-weight: bold; font-family: monospace; color: #007bff; margin: 20px 0; line-height: 1;" id="rest-display">${formatTime(state.restTimeRemaining)}</div>
                <div style="background: rgba(0,0,0,0.3); padding: 25px 50px; border-radius: 16px; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.05);">
                    <div class="stat-label" style="margin-bottom: 10px;">UP NEXT</div>
                    <div style="font-size: 2.5rem; font-weight: bold; color: white;">${ex.name}</div>
                    <div style="color: #007bff; font-weight: bold; margin-top: 10px; font-size: 1.2rem;">SET ${state.currentSet + 1} OF ${ex.sets}</div>
                </div>
                <button style="background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 20px 60px; font-size: 1.5rem; font-weight: bold; border-radius: 12px; cursor: pointer;" id="btn-skip-rest">SKIP REST</button>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    updateElapsedTimer();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { clearInterval(restInterval); state.mode = 'COMPLETE'; renderCurrentState(); });
    
    clearInterval(restInterval);
    restInterval = setInterval(() => {
        state.restTimeRemaining--;
        const rd = document.getElementById('rest-display');
        if (rd) rd.textContent = formatTime(state.restTimeRemaining);
        
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
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body" style="justify-content: center; align-items: center;">
            <main class="workout-panel" style="display: flex; flex-direction: column; justify-content: center; align-items: center; border-color: #007bff; box-shadow: 0 10px 40px rgba(0, 123, 255, 0.1); flex: none; width: 800px; height: 600px;">
                <div style="background: #007bff; color: white; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 2.5rem; margin-bottom: 30px;">
                    PROGRESSION EARNED!
                </div>
                <h2 style="font-size: 3.5rem; font-weight: 800; margin: 0 0 10px 0; color: white;">${ex.name}</h2>
                <p style="font-size: 1.2rem; color: #8892a0;">You completed all sets at the maximum target.</p>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 50px 0;">
                    <div style="font-size: 3rem; color: #8892a0;">${ex.current_weight_kg} kg</div>
                    <div style="color: white;">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                    </div>
                    <div style="font-size: 4.5rem; color: #007bff; font-weight: bold;">${newWeight} kg</div>
                </div>
                
                <div style="display: flex; gap: 20px; width: 100%; max-width: 600px;">
                    <button style="background: #28a745; color: white; padding: 25px; border-radius: 16px; font-size: 1.5rem; font-weight: 800; flex: 2; cursor: pointer; border: none;" id="btn-accept">ACCEPT INCREASE</button>
                    <button style="background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 25px; border-radius: 16px; font-size: 1.5rem; font-weight: bold; flex: 1; cursor: pointer;" id="btn-stay">STAY AT ${ex.current_weight_kg}</button>
                </div>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    updateElapsedTimer();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
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
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body" style="justify-content: center; align-items: center;">
            <div style="text-align: center;">
                <h1 style="font-size: 5rem; color: #28a745; margin-bottom: 20px;">WORKOUT COMPLETE</h1>
                <p style="font-size: 2rem; color: #8892a0;">Saving session data...</p>
            </div>
        </div>
        ${getBottomBarHTML()}
    `;
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
