
import { getSupabase } from '../supabase.js';
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
    const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>`;
    const iconCheck = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

    container.innerHTML = `<div id="strength-content" style=" ">Loading...</div>`;

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
            document.getElementById('strength-content').innerHTML = `<h2 style="padding: 40px; color: white;">No exercises configured. Please visit PC Admin.</h2>`;
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
        document.getElementById('strength-content').innerHTML = `<h2 style="padding: 40px; color: white;">Error: ${err.message}</h2>`;
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
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatRest(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
    const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>`;
    const iconCheck = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

    content.innerHTML = `
<div class="app-container tv-shell">
            <header class="top-bar tv-header">
                <div class="logo-area">
                    <div class="logo-icon">${iconDumbbell}</div>
                    <div class="logo-text-block">
                        <div class="logo-title">FITNESS <span class="text-blue">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.0</span></div>
                        <div class="logo-tag">STRONGER &middot; FITTER &middot; HEALTHIER</div>
                    </div>
                </div>
                <div class="nav-home" tabindex="0" id="btn-home">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="margin-right: 8px;"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                    Home
                </div>
                <div class="top-right-info">
                    <div class="tr-title">STRENGTH WORKOUT</div>
                    <div class="tr-sub">Exercise ${state.currentIndex + 1} of ${state.exercises.length}</div>
                </div>
            </header>

            <div class="main-content tv-main">
                
                <aside class="left-rail">
                    ${state.exercises.map((e, idx) => `
                        <div class="rail-item ${idx === state.currentIndex ? 'active' : ''}" tabindex="0" data-index="${idx}" style="cursor: pointer; transition: background-color 0.2s;">
                            <div class="rail-num">${idx + 1}</div>
                            <img src="${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='${resolveAssetPath(null)}'" />
                            <div class="rail-text-col">
                                <div class="rail-title">${e.name}</div>
                                <div class="rail-sub">${e.sets} sets &middot; ${e.rep_min} - ${e.rep_max} reps</div>
                            </div>
                        </div>
                    `).join('')}
                </aside>


                <main class="workout-panel">
                    <div class="wp-bg"></div>
                    <div class="wp-overlay"></div>
                    <div class="wp-content">
                        <div class="wp-left">
                            <div class="wp-top-left">
                                <h1 class="exercise-name">${ex.name.toUpperCase()}</h1>
                                <div class="stats-row">
                                    <div class="stat-col"><div class="stat-lbl">SETS</div><div class="stat-val">${ex.sets}</div></div>
                                    <div class="stat-divider"></div>
                                    <div class="stat-col"><div class="stat-lbl">REP RANGE</div><div class="stat-val">${ex.rep_min} &ndash; ${ex.rep_max}</div></div>
                                    <div class="stat-divider"></div>
                                    <div class="stat-col"><div class="stat-lbl">REST</div><div class="stat-val">${formatRest(ex.rest_seconds)}</div></div>
                                </div>
                            </div>
                            
                            <div class="wp-bottom-left">
                                <div class="control-box box-weight">
                                    <div class="ctrl-lbl">WEIGHT (KG)</div>
                                    <div class="ctrl-interactive bg-blue-grad">
                                        <div class="ctrl-arrow-container" id="btn-weight-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
     <div class="ctrl-val">${state.currentWeight}</div>
     <div class="ctrl-arrow-container" id="btn-weight-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub">Increment: ${ex.progression_increment_kg} kg</div>
                                </div>
                                <div class="control-box box-reps">
                                    <div class="ctrl-lbl">REPS COMPLETED</div>
                                    <div class="ctrl-interactive bg-purple-grad">
                                        <div class="ctrl-arrow-container" id="btn-reps-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
     <div class="ctrl-val">${state.currentReps}</div>
     <div class="ctrl-arrow-container" id="btn-reps-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub" style="visibility: hidden;">Increment: ${ex.progression_increment_kg} kg</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="wp-right">
                            <div class="wp-bottom-right">
                                <div class="set-indicator">SET <span class="set-num-hl">${state.currentSet}</span> OF ${ex.sets}</div>
                                <button class="btn-complete" id="btn-complete-set">
                                    ${iconCheck} COMPLETE SET
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer class="bottom-bar tv-footer">
                <div class="bb-btn-end" tabindex="0" id="btn-end">
                    <div class="bb-end-x">&times;</div>
                    <div class="bb-end-text">
                        <div class="bb-end-t1">END WORKOUT</div>
                        <div class="bb-end-t2">Save and exit</div>
                    </div>
                </div>
                
                <div class="bb-center">
                    <div class="bb-progress">
                        <div class="bb-lbl">WORKOUT PROGRESS</div>
                        
                        <div class="dots-row">
                            ${state.exercises.map((_, i) => `
                                <div class="dot-col">
                                    <div class="dot ${i <= state.currentIndex ? 'active' : ''}"></div>
                                    <div class="dot-num ${i <= state.currentIndex ? 'hl' : ''}">${i + 1}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bb-time">
                        <div class="bb-lbl">TOTAL TIME</div>
                        <div class="time-val">00:00:00</div>
                    </div>
                </div>

                <div class="bb-btn-next" style="cursor: pointer; transition: background-color 0.2s;" id="btn-next">
                    <div class="bb-next-text">
                        <div class="bb-next-t1">NEXT EXERCISE</div>
                        <div class="bb-next-t2">${state.currentIndex < state.exercises.length - 1 ? state.exercises[state.currentIndex + 1].name : 'None'}</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="color: #8892a0;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
            </footer>
        </div>
<style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            button { outline: none; border: none; cursor: pointer; font-family: inherit; }
            
            /* Global */
            .app-container {
                
                
                background-color: #050810;
                color: white;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .text-blue { color: #007bff; }
            
            /* Top Bar */
            .top-bar {
                
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .logo-area { display: flex; align-items: center; gap: 15px; width: 380px; }
            .logo-icon { color: #007bff; display: flex; align-items: center; justify-content: center; }
            .logo-title { font-size: 1.8rem; font-weight: 800; letter-spacing: 1px; line-height: 1.2; }
            .logo-tag { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #8892a0; }
            
            .nav-home { display: flex; align-items: center; font-size: 1.2rem; color: #8892a0; cursor: pointer; flex: 1; }
            
            .top-right-info { display: flex; flex-direction: column; text-align: right; }
            .tr-title { font-size: 1.5rem; font-weight: 800; letter-spacing: 1px; }
            .tr-sub { font-size: 1.15rem; color: #8892a0; margin-top: 4px; font-weight: 500; }
            
            /* Main Content Layer */
            .main-content {
                display: flex;
                flex: 1;
                
                gap: 30px;
                 /* 90 top + 110 bottom = 200 */
            }
            
            /* Left Rail */
            .left-rail {
                width: 380px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .rail-item {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-radius: 12px;
                background-color: #0b111e;
                border: 1px solid rgba(255,255,255,0.02);
                height: 80px;
            }
            .rail-item:hover:not(.active) {
                background-color: #121927;
                border-color: rgba(255,255,255,0.08);
            }
            .rail-item.active {
                background-color: #007bff;
                border-color: #007bff;
            }
            .rail-num {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 2px solid #556070;
                color: #8892a0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 1rem;
                flex-shrink: 0;
            }
            .rail-item.active .rail-num {
                background-color: #050810;
                border-color: transparent;
                color: white;
            }
            .rail-img {
                width: 65px;
                height: 45px;
                border-radius: 6px;
                object-fit: cover;
                margin: 0 15px;
                filter: brightness(0.6);
            }
            .rail-item.active .rail-img {
                filter: brightness(1);
            }
            .rail-text-col {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .rail-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #8892a0;
            }
            .rail-item.active .rail-title { color: white; }
            .rail-sub {
                font-size: 0.8rem;
                color: #556070;
                margin-top: 4px;
            }
            .rail-item.active .rail-sub { color: rgba(255,255,255,0.8); }
            
            /* Workout Panel with Full Background */
            .workout-panel {
                flex: 1;
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 24px;
                position: relative;
                overflow: hidden;
            }
            .wp-bg {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: url('${resolveAssetPath('strength/squat.webp')}');
                background-size: cover;
                background-position: top center;
                z-index: 1;
            }
            .wp-overlay {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                /* Fading from top right to bottom left, plus a left edge guard */
                background: 
                    linear-gradient(225deg, rgba(13,19,35,0) 0%, rgba(13,19,35,0.8) 50%, rgba(13,19,35,1) 85%),
                    linear-gradient(to right, rgba(13,19,35,1) 0%, rgba(13,19,35,0.7) 35%, rgba(13,19,35,0) 100%);
                z-index: 2;
            }
            .wp-content {
                position: relative;
                z-index: 3;
                padding: 40px;
                display: flex;
                gap: 40px;
                height: 100%;
                width: 100%;
            }
            
            .wp-left {
                flex: 1.2;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-width: 0;
            }
            .wp-top-left {
                min-width: 0;
            }
            .wp-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }
            
            /* Top Left */
            .exercise-name {
                font-size: 4.2rem;
                font-weight: 900;
                letter-spacing: 2px;
                margin-bottom: 30px;
                line-height: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .stats-row {
                display: flex;
                gap: 40px;
            }
            .stat-divider {
                width: 2px;
                background-color: rgba(255,255,255,0.15);
                margin: 5px 0;
                border-radius: 2px;
            }
            .stat-col {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .stat-lbl {
                font-size: 0.85rem;
                color: #8892a0;
                font-weight: 700;
                letter-spacing: 1.5px;
            }
            .stat-val {
                font-size: 2.2rem;
                font-weight: 800;
            }
            
            /* Bottom Left */
            .wp-bottom-left {
                display: flex;
                gap: 20px;
            }
            
            .control-box {
                width: 260px;
                height: 350px;
                border-radius: 20px;
                padding: 25px 25px 20px 25px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #0d1b33;
            }
            .box-weight { border: 1px solid rgba(150, 200, 255, 0.12); }
            .box-reps { border: 1px solid rgba(200, 150, 255, 0.12); }
            
            .ctrl-lbl {
                font-size: 0.95rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                margin-bottom: 20px;
                color: white;
            }
            
            .ctrl-interactive {
                width: 100%;
                height: 230px;
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                overflow: hidden;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
            }
            .bg-blue-grad { background: linear-gradient(180deg, #1e87f0 0%, #00b3ff 100%); }
            .bg-purple-grad { background: linear-gradient(180deg, #8b45f7 0%, #bb6df9 100%); }
            
            .ctrl-arrow-container {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .ctrl-val {
                background-color: #15243d;
                margin: 0 4px;
                
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4.5rem;
                font-weight: 800;
                color: white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }
            
            .ctrl-sub {
                font-size: 0.85rem;
                color: #d1d5db;
                margin-top: 15px;
                height: 20px;
            }
            
            /* Right Side Elements */
            .wp-bottom-right {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .set-indicator {
                background-color: #050810;
                border-radius: 16px;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                font-weight: 700;
                color: #8892a0;
                letter-spacing: 2px;
                border: 1px solid rgba(255,255,255,0.02);
            }
            .set-num-hl {
                color: #007bff;
                font-size: 2.2rem;
                font-weight: 900;
                margin: 0 10px;
            }
            .btn-complete {
                background-color: #28a745;
                color: white;
                border-radius: 16px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                font-weight: 800;
                gap: 15px;
                box-shadow: 0 4px 15px rgba(40,167,69,0.3);
            }
            
            /* Bottom Bar */
            .bottom-bar {
                
                background-color: #070b14;
                border-top: 1px solid rgba(255,255,255,0.05);
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            
            .bb-btn-end {
                background-color: #111827;
                border-radius: 16px;
                height: 70px;
                padding: 0 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                cursor: pointer;
            }
            .bb-end-x {
                font-size: 2rem;
                font-weight: bold;
            }
            .bb-end-text {
                display: flex;
                flex-direction: column;
            }
            .bb-end-t1 { font-size: 1rem; font-weight: 700; letter-spacing: 1px; }
            .bb-end-t2 { font-size: 0.8rem; color: #8892a0; margin-top: 2px; }
            
            .bb-center {
                display: flex;
                gap: 80px;
            }
            .bb-progress {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .bb-time {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .bb-lbl {
                font-size: 0.8rem;
                font-weight: 700;
                color: #8892a0;
                letter-spacing: 2px;
            }
            .dots-row {
                display: flex;
                gap: 15px;
                align-items: center;
            }
            .dot-col {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }
            .dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 2px solid #556070;
            }
            .dot.active {
                background-color: #007bff;
                border-color: #007bff;
            }
            .dot-num {
                font-size: 0.8rem;
                color: #556070;
                font-weight: 700;
            }
            .dot-num.hl {
                color: white;
            }
            .time-val {
                font-size: 2rem;
                font-weight: 800;
                font-family: monospace;
                letter-spacing: 2px;
                line-height: 1;
            }
            
            .bb-btn-next {
                background-color: #111827;
                border-radius: 16px;
                height: 70px;
                padding: 0 25px;
                display: flex;
                align-items: center;
                gap: 25px;
            }
            .bb-next-text {
                display: flex;
                flex-direction: column;
                text-align: right;
            }
            .bb-next-t1 { font-size: 0.8rem; font-weight: 700; color: #8892a0; letter-spacing: 1.5px; }
            .bb-next-t2 { font-size: 1.1rem; font-weight: 700; margin-top: 2px; }
            
        </style>
    `;

    // Rebind static header buttons
    document.getElementById('btn-home')?.addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end')?.addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    // Bind rail items
    content.querySelectorAll('.rail-item').forEach(item => {
        item.addEventListener('click', () => {
            const newIdx = parseInt(item.getAttribute('data-index'), 10);
            if (newIdx !== state.currentIndex) {
                state.currentIndex = newIdx;
                state.currentSet = 1;
                const nextEx = state.exercises[newIdx];
                state.currentReps = nextEx.rep_max;
                state.currentWeight = nextEx.current_weight_kg;
                renderCurrentState();
            }
        });
    });
    
    // Bind Next Exercise footer button
    document.getElementById('btn-next')?.addEventListener('click', () => {
        if (state.currentIndex < state.exercises.length - 1) {
            checkProgressionAndProceed();
        } else {
            state.mode = 'COMPLETE';
            renderCurrentState();
        }
    });
    
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
    content.innerHTML = `
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
            <div style="font-size: 1rem; color: #8892a0; letter-spacing: 2px;">REST RECOVERY</div>
            <div style="font-size: 10rem; font-weight: bold; font-family: monospace; color: #007bff; margin: 20px 0; line-height: 1;" id="rest-display">${formatTime(state.restTimeRemaining)}</div>
            <div style="background: #0a1424; padding: 25px 50px; border-radius: 16px; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.08); text-align:center;">
                <div style="font-size: 0.9rem; color: #8892a0; margin-bottom: 10px;">UP NEXT</div>
                <div style="font-size: 2.5rem; font-weight: bold; color: white;">${ex.name}</div>
                <div style="color: #007bff; font-weight: bold; margin-top: 10px; font-size: 1.2rem;">SET ${state.currentSet + 1} OF ${ex.sets}</div>
            </div>
            <button style="background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; padding: 20px 60px; font-size: 1.5rem; font-weight: bold; border-radius: 12px; cursor: pointer;" id="btn-skip-rest">SKIP REST</button>
        </div>
    `;
    
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
    
    content.innerHTML = `
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
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
        </div>
    `;
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
    content.innerHTML = `
        <div style="width:100vw; height:100vh; background:#061122; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Segoe UI', sans-serif;">
            <div style="text-align: center;">
                <h1 style="font-size: 5rem; color: #28a745; margin-bottom: 20px;">WORKOUT COMPLETE</h1>
                <p style="font-size: 2rem; color: #8892a0;">Saving session data...</p>
            </div>
        </div>
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
