import { navigate } from '../router.js';
import { getSupabase } from '../supabase.js';
import { resolveAssetPath } from '../assets.js';

let state = {
    exercises: [],
    currentIndex: 0,
    currentSet: 1,
    currentSide: 'NONE', // NONE, LEFT, RIGHT
    recordedSets: [],
    startTime: null,
    restTimeRemaining: 0,
    activeTimeRemaining: 0,
    timerInterval: null,
    mode: 'LOADING', 
    sessionData: null
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

const iconMobility = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>`;
const iconCheck = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
const iconClock = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`;

export async function renderMobility(container) {
    container.innerHTML = `
        <div class="app-container tv-shell">
            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>
        <style>
            * { box-sizing: border-box; }
            button { outline: none; border: none; cursor: pointer; font-family: inherit; }
            
            .top-bar { display: flex; justify-content: space-between; align-items: center;  background: #070b14; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .brand { display: flex; align-items: center; gap: 15px; }
            .brand-icon { width: 40px; height: 40px; color: #8a2be2; }
            .brand-title { margin: 0; font-size: 1.8rem; font-weight: bold; letter-spacing: 1px; }
            .brand-tag { font-size: 0.7rem; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
            .btn-home { background: transparent; color: #aaa; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; transition: color 0.2s; }
            .btn-home:hover { color: #fff; }
            .top-right { text-align: right; }
            .top-right-title { font-size: 1.5rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
            .top-right-sub { font-size: 0.9rem; color: #888; }
            
            .main-body { display: flex; flex: 1; overflow: hidden; }
            
            .sidebar { width: 380px; background: #0b101e; padding: 20px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; border-right: 1px solid rgba(255,255,255,0.05); }
            .sb-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 12px; background: #13192a; transition: 0.2s; border: 1px solid transparent; }
            .sb-item.active { background: #8a2be2; }
            .sb-item.completed { opacity: 0.5; }
            .sb-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); font-size: 1rem; }
            .sb-item.active .sb-num { border-color: white; background: #6b21b0; }
            .sb-img { width: 64px; height: 48px; border-radius: 8px; object-fit: cover; }
            .sb-info { display: flex; flex-direction: column; }
            .sb-name { font-size: 1.2rem; font-weight: bold; }
            .sb-sub { font-size: 0.9rem; color: #aaa; margin-top: 5px; }
            .sb-item.active .sb-sub { color: rgba(255,255,255,0.8); }
            
            .right-panel { flex: 1; position: relative; display: flex; flex-direction: column; background: #050810; }
            .rp-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 1; opacity: 1; }
            .rp-overlay { display: none; }
            .rp-content { position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; padding: 20px; justify-content: flex-end; align-items: center; }
            
            .rp-header { font-size: 2.5rem; font-weight: 800; margin: 0 0 15px 0; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
            .stats-row { display: flex; gap: 60px; margin-bottom: auto; }
            .stat-box { display: flex; flex-direction: column; gap: 8px; }
            .stat-label { font-size: 1rem; color: #aaa; letter-spacing: 2px; font-weight: bold; }
            .stat-val { font-size: 2rem; font-weight: bold; }
            
            .controls-area { display: flex; gap: 20px; align-items: stretch; margin-top: auto; }
            
            .submit-area { flex: 1; background: #13192a; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; }
            .set-indicator { font-size: 1.8rem; font-weight: bold; letter-spacing: 2px; margin-bottom: 30px; }
            .set-indicator span { font-size: 2.5rem; color: #8a2be2; margin: 0 5px; }
            .btn-complete { background: #28a745; color: white; width: auto; padding: 15px 30px; border-radius: 16px; font-size: 2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 15px; transition: 0.2s; box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4); }
            .btn-complete:hover { filter: brightness(1.1); transform: scale(1.02); }
            .btn-start-purple { background: #8a2be2; color: white; width: auto; padding: 15px 30px; border-radius: 16px; font-size: 2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 15px; transition: 0.2s; box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4); }
            .btn-start-purple:hover { filter: brightness(1.1); transform: scale(1.02); }
            .btn-skip-sub { background: rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.2); color: white; width: auto; padding: 15px 30px; border-radius: 16px; font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
            .btn-skip-sub:hover { background: rgba(255,255,255,0.1); }
            
            .bottom-bar { background: #070b14; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; padding: 15px 40px; justify-content: space-between;  position: relative; z-index: 100; }
            .btn-end { background: #13192a; border-radius: 12px; height: 52px; padding: 0 20px; display: flex; align-items: center; gap: 15px; transition: 0.2s; text-align: left; }
            .btn-end:hover { background: #1a2238; }
            .btn-end-icon { font-size: 1.5rem; font-weight: bold; }
            .btn-end-text { font-size: 0.9rem; font-weight: bold; }
            .btn-end-sub { font-size: 0.75rem; color: #aaa; font-weight: normal; }
            
            .prog-center { display: flex; align-items: center; gap: 60px; }
            .prog-block { display: flex; flex-direction: column; align-items: center; gap: 10px; }
            .prog-title { font-size: 0.8rem; color: #aaa; letter-spacing: 2px; font-weight: bold; }
            .prog-dots { display: flex; gap: 15px; align-items: center; }
            .p-dot-col { display: flex; flex-direction: column; align-items: center; gap: 5px; }
            .p-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #444; }
            .p-dot.filled { background: #8a2be2; border-color: #8a2be2; }
            .p-dot.current { border-color: #8a2be2; }
            .p-num { font-size: 0.7rem; color: #666; }
            .p-num.active { color: #8a2be2; font-weight: bold; }
            
            .total-time-val { font-size: 2.2rem; font-weight: bold; font-family: monospace; letter-spacing: 2px; }
            
            .next-block { background: #13192a; border-radius: 12px; height: 52px; padding: 0 20px; display: flex; align-items: center; gap: 20px; }
            .next-text { display: flex; flex-direction: column; text-align: right; }
            .next-title { font-size: 0.8rem; color: #aaa; font-weight: bold; letter-spacing: 1px; }
            .next-val { font-size: 1.1rem; font-weight: bold; }
            
            .rest-huge { font-size: 12rem; font-weight: bold; font-family: monospace; color: #8a2be2; text-shadow: 0 10px 40px rgba(138, 43, 226, 0.4); margin: 20px 0; line-height: 1; }
            
            .huge-timer { font-size: 10rem; font-weight: bold; font-family: monospace; color: white; text-shadow: 0 10px 40px rgba(0,0,0,0.5); margin-bottom: 20px; line-height: 1; }
            
            .fb-grid { display: flex; justify-content: center; gap: 20px; margin: 40px 0; }
            .btn-fb { border-radius: 16px; padding: 30px; width: 220px; font-size: 2rem; font-weight: bold; color: white; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: 0.2s; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
            .btn-fb:hover { filter: brightness(1.1); transform: scale(1.05); }
            .btn-fb-keep { background: #28a745; }
            .btn-fb-unsure { background: #fd7e14; }
            .btn-fb-drop { background: #dc3545; }
            .fb-sub { font-size: 1rem; opacity: 0.8; font-weight: normal; }

            /* Left Rail */
            .left-rail { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; margin-right: 10px; padding: 10px; border-right: 1px solid rgba(255,255,255,0.05); }
            .rail-item { display: flex; align-items: center; padding: 8px 12px; border-radius: 12px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); height: 60px; }
            .rail-item.active { background-color: #8a2be2; border-color: #8a2be2; }
            .rail-num { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-right: 15px; }
            .rail-item.active .rail-num { border-color: white; color: white; background-color: transparent; }
            .rail-img { width: 64px; height: 48px; border-radius: 6px; object-fit: cover; margin-right: 15px; background-color: #15243d; }
            .rail-text-col { display: flex; flex-direction: column; flex: 1; min-width: 0; }
            .rail-title { font-size: 1.05rem; font-weight: 800; letter-spacing: 0.5px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .rail-sub { font-size: 0.8rem; font-weight: 600; color: #8892a0; margin-top: 4px; }
            .rail-item.active .rail-sub { color: rgba(255,255,255,0.8); }
        </style>
    `;

    try {
        const { data: user } = await getSupabase().auth.getUser();
        if (!user.user) throw new Error("Not authenticated");
        
        const { data: exercises, error: exErr } = await getSupabase()
            .from('health_mobility_exercises')
            .select('*')
            .eq('owner_id', user.user.id)
            .order('display_order', { ascending: true });
            
        if (exErr) throw exErr;
        
        const validEx = (exercises || []).filter(e => e.sets > 0);
        if (validEx.length === 0) {
            document.getElementById('mobility-content').innerHTML = `<h2 style="padding: 40px;">No exercises configured. Please visit PC Admin.</h2>`;
            return;
        }

        state = {
            exercises: validEx,
            currentIndex: 0,
            currentSet: 1,
            currentSide: validEx[0].per_side ? 'LEFT' : 'NONE',
            recordedSets: [],
            startTime: Date.now(),
            timerInterval: setInterval(updateElapsedTimer, 1000),
            mode: 'ACTIVE',
            sessionData: null
        };
        
        renderCurrentState();

    } catch (err) {
        document.getElementById('mobility-content').innerHTML = `<h2 style="padding: 40px;">Error: ${err.message}</h2>`;
    }
}

function updateElapsedTimer() {
    const els = document.querySelectorAll('.total-time-val');
    if (els.length > 0 && state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const txt = formatTotalTime(elapsed);
        els.forEach(el => el.textContent = txt);
    }
}


function bindSidebarAndNext() {
    document.querySelectorAll('.rail-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const newIdx = parseInt(item.getAttribute('data-index'), 10);
            if (newIdx !== state.currentIndex) {
                if (state.timerInterval) clearInterval(state.timerInterval);
                // mobility.js might have a global restInterval declared in renderRest, let's clear it gracefully
                const maxId = setTimeout(function(){}, 0);
                for (let i = 0; i < maxId; i+=1) { 
                   clearInterval(i);
                }
                
                state.currentIndex = newIdx;
                state.currentSet = 1;
                state.currentSide = state.exercises[newIdx].per_side ? 'LEFT' : 'NONE';
                state.mode = 'ACTIVE';
                
                // restart global elapsed timer gracefully
                state.timerInterval = setInterval(updateElapsedTimer, 1000);
                
                renderCurrentState();
            }
        });
    });

    const nextBtn = document.getElementById('btn-next-ex');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxId = setTimeout(function(){}, 0);
            for (let i = 0; i < maxId; i+=1) { 
               clearInterval(i);
            }
            state.timerInterval = setInterval(updateElapsedTimer, 1000);
            advanceExercise();
        });
        nextBtn.addEventListener('mouseenter', () => nextBtn.style.opacity = '0.7');
        nextBtn.addEventListener('mouseleave', () => nextBtn.style.opacity = '1');
    }
}

function getTopBarHTML() {
    return `
        
    
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">${iconMobility}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.23</span></div>
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
            <div class="tv-right-sub">Exercise ${state.currentIndex + 1} of ${state.exercises.length}</div>
        </div>
        
        </div>
    </header>

    
    `;
}

function getSidebarHTML() {
    return `
        <aside class="left-rail">
            ${state.exercises.map((e, idx) => `
                <div class="rail-item ${idx === state.currentIndex ? 'active' : ''}" tabindex="0" data-index="${idx}" style="transition: background-color 0.2s;">
                    <div class="rail-num">${idx + 1}</div>
                    <img src="${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='${resolveAssetPath(null)}'" />
                    <div class="rail-text-col">
                        <div class="rail-title">${e.name}</div>
                        <div class="rail-sub">${e.sets} sets &middot; ${e.target_value} ${e.measurement_type === 'TIME' ? 'sec' : 'reps'}</div>
                    </div>
                </div>
            `).join('')}
        </aside>
    `;
}

function getBottomBarHTML() {
    const nextEx = state.currentIndex + 1 < state.exercises.length ? state.exercises[state.currentIndex + 1] : null;
    
    let dotsHtml = '';
    for(let i=0; i<state.exercises.length; i++) {
        let dotCls = 'p-dot';
        let numCls = 'p-num';
        if (i < state.currentIndex) {
            dotCls += ' filled';
        } else if (i === state.currentIndex) {
            dotCls += ' current';
            numCls += ' active';
        }
        dotsHtml += `
            <div class="p-dot-col">
                <div class="${dotCls}"></div>
                <div class="${numCls}">${i + 1}</div>
            </div>
        `;
    }
    
    return `
        <footer class="bottom-bar tv-footer">
            <button class="btn-end" id="btn-end-workout">
                <div class="btn-end-icon">&times;</div>
                <div>
                    <div class="btn-end-text">END WORKOUT</div>
                    <div class="btn-end-sub">Save and exit</div>
                </div>
            </button>
            
            <div class="prog-center">
                <div class="prog-block">
                    <div class="prog-title">WORKOUT PROGRESS</div>
                    <div class="prog-dots">
                        ${dotsHtml}
                    </div>
                </div>
                <div class="prog-block">
                    <div class="prog-title">TOTAL TIME</div>
                    <div class="total-time-val">00:00:00</div>
                </div>
            </div>
            
            <div class="next-block" tabindex="0" id="btn-next-ex" style="cursor: pointer; transition: opacity 0.2s;">
                <div class="next-text">
                    <div class="next-title">NEXT EXERCISE</div>
                    <div class="next-val">${nextEx ? nextEx.name : 'Finish'}</div>
                </div>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
        </footer>
    `;
}

function renderCurrentState() {
    const content = document.getElementById('mobility-content');
    if (!content) return;
    
    if (state.mode === 'ACTIVE') {
        renderActiveSet(content);
    } else if (state.mode === 'REST') {
        renderRest(content);
    } else if (state.mode === 'FEEDBACK') {
        renderFeedback(content);
    } else if (state.mode === 'COMPLETE') {
        renderComplete(content);
    }
}

function renderActiveSet(content) {
    const ex = state.exercises[state.currentIndex];
    const sideText = state.currentSide === 'NONE' ? '' : ` (${state.currentSide})`;
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body tv-main" style="padding: 10px 20px;">
            ${getSidebarHTML()}
            <main class="right-panel">
                <div class="rp-bg" id="main-exercise-bg" style="background-image: url('${resolveAssetPath(ex.image_path)}');"></div>
                <div class="rp-overlay"></div>
                
                <div class="rp-content">
                    <div class="controls-area" style="margin-top: auto;">
                        <div class="submit-area" id="interaction-area" style="flex-direction: row; justify-content: center; background: transparent; padding: 0; width: 100%;">
                            <!-- Injected -->
                        </div>
                    </div>
                </div>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    const area = document.getElementById('interaction-area');
    
    if (ex.measurement_type === 'TIME') {
        state.activeTimeRemaining = ex.target_value;
        area.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(11,16,30,0.95); padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 620px; justify-content: space-between;">
                <div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1.1rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 6px;">${sideText}</span></div>
                <div style="font-size: 2.2rem; font-weight: bold; font-family: monospace; width: auto; padding: 0 5px; text-align: center; color: white; line-height: 1;" id="active-timer">${state.activeTimeRemaining}s</div>
                <button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">${iconClock} START</button>
                <button class="btn-skip-sub" id="btn-done" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; border-radius: 50px; width: auto; max-width: none;">SKIP</button>
                ${ex.name.toLowerCase().includes('adductor') ? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>` : ''}
            </div>
        `;
        
        let isRunning = false;
        const toggleBtn = document.getElementById('btn-timer-toggle');
        const timerDisplay = document.getElementById('active-timer');
        
        toggleBtn.addEventListener('click', () => {
            if (isRunning) {
                isRunning = false;
                toggleBtn.innerHTML = `${iconClock} RESUME`;
                clearInterval(state.timerInterval);
            } else {
                isRunning = true;
                toggleBtn.innerHTML = `PAUSE`;
                
                state.timerInterval = setInterval(() => {
                    state.activeTimeRemaining--;
                    timerDisplay.textContent = state.activeTimeRemaining + 's';
                    
                    if (state.activeTimeRemaining <= 0) {
                        clearInterval(state.timerInterval);
                        recordSet(ex.target_value);
                    }
                }, 1000);
            }
        });
        
        document.getElementById('btn-done').addEventListener('click', () => {
            clearInterval(state.timerInterval);
            recordSet(ex.target_value - state.activeTimeRemaining);
        });
        
    } else {
        area.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(11,16,30,0.95); padding: 8px 15px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 620px; justify-content: space-between;">
                <div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 1px;">SET <span style="color: #8a2be2; font-size: 1.1rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 6px;">${sideText}</span></div>
                <div style="font-size: 2.2rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 1rem; color: #888;">REPS</span></div>
                <button class="btn-complete" id="btn-done" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">${iconCheck} COMPLETE</button>
                ${ex.name.toLowerCase().includes('adductor') ? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; padding: 6px 12px; font-size: 0.8rem; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>` : ''}
            </div>
        `;
        document.getElementById('btn-done').addEventListener('click', () => recordSet(ex.target_value));
    }
    
    const howToBtn = document.getElementById('btn-howto');
    if (howToBtn) {
        let isHowTo = false;
        const bgDiv = document.getElementById('main-exercise-bg');
        const normalImage = resolveAssetPath(ex.image_path);
        const howToImage = normalImage.replace('.png', '-howto.png').replace('.webp', '-howto.webp');
        
        howToBtn.addEventListener('click', () => {
            isHowTo = !isHowTo;
            if (isHowTo) {
                bgDiv.style.backgroundImage = `url('${howToImage}')`;
                howToBtn.innerText = 'BACK TO EXERCISE';
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = 'none';
                });
            } else {
                bgDiv.style.backgroundImage = `url('${normalImage}')`;
                howToBtn.innerText = 'HOW TO';
                Array.from(howToBtn.parentNode.children).forEach(child => {
                    if (child.id !== 'btn-howto') child.style.display = '';
                });
            }
        });
    }
}

function recordSet(actualValue) {
    const ex = state.exercises[state.currentIndex];
    
    state.recordedSets.push({
        exercise_id: ex.id,
        exercise_name: ex.name,
        exercise_order: ex.display_order,
        measurement_type: ex.measurement_type,
        target_value: ex.target_value,
        set_number: state.currentSet,
        side: state.currentSide,
        actual_value: Math.max(0, actualValue),
        feedback: null
    });
    
    if (ex.per_side && state.currentSide === 'LEFT') {
        state.currentSide = 'RIGHT';
        state.mode = 'ACTIVE';
        renderCurrentState();
    } else {
        if (state.currentSet >= ex.sets) {
            state.mode = 'FEEDBACK';
            renderCurrentState();
        } else {
            state.restTimeRemaining = ex.rest_seconds;
            state.mode = 'REST';
            renderCurrentState();
        }
    }
}

function renderRest(content) {
    const ex = state.exercises[state.currentIndex];
    const sideText = (ex.per_side && state.currentSide === 'LEFT') ? ' (RIGHT)' : '';
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body tv-main" style="padding: 10px 20px;">
            ${getSidebarHTML()}
            <main class="right-panel" style="background: #0b101e;">
                <div class="rp-content" style="align-items: center; justify-content: center; padding: 0;">
                    <div class="stat-label">REST RECOVERY</div>
                    <div class="rest-huge" id="rest-display">${formatTime(state.restTimeRemaining)}</div>
                    <div style="background: #13192a; padding: 25px 50px; border-radius: 16px; text-align: center; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.05);">
                        <div class="stat-label" style="margin-bottom: 10px;">UP NEXT</div>
                        <div style="font-size: 2rem; font-weight: bold;">${ex.name}${sideText}</div>
                        <div style="color: #8a2be2; font-weight: bold; margin-top: 5px;">SET ${(ex.per_side && state.currentSide==='LEFT') ? state.currentSet : state.currentSet + 1} OF ${ex.sets}</div>
                    </div>
                    <button class="btn-skip-sub" id="btn-skip-rest" style="padding: 20px 60px;">SKIP REST</button>
                </div>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    updateElapsedTimer();
    bindSidebarAndNext();
    
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
    const ex = state.exercises[state.currentIndex];
    if (ex.per_side && state.currentSide === 'LEFT') {
        state.currentSide = 'RIGHT';
    } else {
        state.currentSet++;
        if (ex.per_side) state.currentSide = 'LEFT';
    }
    state.mode = 'ACTIVE';
    renderCurrentState();
}

function renderFeedback(content) {
    const ex = state.exercises[state.currentIndex];
    
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body tv-main" style="padding: 10px 20px;">
            ${getSidebarHTML()}
            <main class="right-panel" style="background: #0b101e; justify-content: center; align-items: center;">
                <div style="background: #13192a; padding: 60px; border-radius: 24px; border: 2px solid #8a2be2; text-align: center; max-width: 1000px; box-shadow: 0 15px 50px rgba(138, 43, 226, 0.2);">
                    <h2 class="rp-header" style="font-size: 3rem; margin-bottom: 10px;">${ex.name} Complete</h2>
                    <p style="font-size: 1.2rem; color: #aaa;">How did this mobility exercise feel?</p>
                    
                    <div class="fb-grid">
                        <button class="btn-fb btn-fb-keep" data-fb="KEEP">KEEP<span class="fb-sub">Feels good</span></button>
                        <button class="btn-fb btn-fb-unsure" data-fb="UNSURE">UNSURE<span class="fb-sub">Needs review</span></button>
                        <button class="btn-fb btn-fb-drop" data-fb="DROP">DROP<span class="fb-sub">Too painful/hard</span></button>
                    </div>
                    
                    <button id="btn-skip-fb" style="background: transparent; color: #888; text-decoration: underline; font-size: 1.2rem; padding: 20px;">Skip Feedback</button>
                </div>
            </main>
        </div>
        ${getBottomBarHTML()}
    `;
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    const handleFeedback = (fb) => {
        state.recordedSets.forEach(s => {
            if (s.exercise_id === ex.id) s.feedback = fb;
        });
        advanceExercise();
    };
    
    document.querySelectorAll('.btn-fb').forEach(b => {
        b.addEventListener('click', () => handleFeedback(b.dataset.fb));
    });
    
    document.getElementById('btn-skip-fb').addEventListener('click', () => handleFeedback(null));
}

function advanceExercise() {
    state.currentIndex++;
    if (state.currentIndex >= state.exercises.length) {
        state.mode = 'COMPLETE';
    } else {
        state.currentSet = 1;
        state.currentSide = state.exercises[state.currentIndex].per_side ? 'LEFT' : 'NONE';
        state.mode = 'ACTIVE';
    }
    renderCurrentState();
}

function renderComplete(content) {
    clearInterval(state.timerInterval);
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%;">
            <div style="text-align: center;">
                <h1 style="font-size: 5rem; color: #8a2be2; margin-bottom: 20px;">MOBILITY COMPLETE</h1>
                <p style="font-size: 2rem; color: #aaa;">Saving session data...</p>
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
        
        const { data: session, error: sErr } = await getSupabase().from('health_mobility_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            completed_at: new Date().toISOString(),
            status: 'completed'
        }).select().single();
        if (sErr) throw sErr;
        
        const setsToInsert = state.recordedSets.map(item => ({
            owner_id: user.user.id,
            session_id: session.id,
            exercise_id: item.exercise_id,
            exercise_name: item.exercise_name,
            exercise_order: item.exercise_order,
            set_number: item.set_number,
            side: item.side,
            target_value: item.target_value,
            actual_value: item.actual_value,
            feedback: item.feedback
        }));
        
        if (setsToInsert.length > 0) {
            const { error: setErr } = await getSupabase().from('health_mobility_sets').insert(setsToInsert);
            if (setErr) throw setErr;
        }
        
        navigate('/tv');
        
    } catch (err) {
        alert("Failed to save mobility data: " + err.message);
        console.error(err);
        navigate('/tv');
    }
}
