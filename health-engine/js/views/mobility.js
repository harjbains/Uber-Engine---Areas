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
                font-size: 1.6rem;
                white-space: nowrap;
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
                border-radius: 12px;
                height: 52px;
                padding: 0 20px;
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
                gap: 40px;
            }
            .bb-progress {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 0 10px;
            }
            .bb-time {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 0 10px;
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
                font-size: 1.8rem;
                font-weight: 800;
                font-family: monospace;
                letter-spacing: 2px;
                line-height: 1;
            }
            
            .bb-btn-next {
                background-color: #111827;
                border-radius: 12px;
                height: 52px;
                padding: 0 20px;
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
            .bb-next-t2 { font-size: 1rem; font-weight: 700; margin-top: 0; white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
            
        
    .sb-item.active { background-color: #8a2be2 !important; border-color: #8a2be2 !important; box-shadow: 0 4px 15px rgba(138,43,226,0.3) !important; }
    .btn-timer { background-color: #8a2be2; box-shadow: 0 4px 15px rgba(138,43,226,0.3); }
    .btn-skip { background-color: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); box-shadow: none; }
    .btn-howto { background-color: #007bff; box-shadow: 0 4px 15px rgba(0,123,255,0.3); }
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
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.32</span></div>
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
    
    content.innerHTML = activeHTML;
    
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-top-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    
    const area = document.getElementById('interaction-area');
    
    if (ex.measurement_type === 'TIME') {
        state.activeTimeRemaining = ex.target_value;
        area.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(11,16,30,0.95); padding: 5px 10px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 440px; flex-wrap: nowrap; justify-content: space-evenly; gap: 4px; box-sizing: border-box; margin: 0 auto; overflow: hidden;">
                <div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 0px; white-space: nowrap;">SET <span style="color: #8a2be2; font-size: 1rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 3px;">${sideText}</span></div>
                <div style="font-size: 1.5rem; font-weight: bold; font-family: monospace; width: auto; padding: 0; text-align: center; color: white; line-height: 1;" id="active-timer">${state.activeTimeRemaining}s</div>
                <button class="btn-start-purple" id="btn-timer-toggle" style="margin: 0; border-radius: 50px; box-shadow: none; width: auto; max-width: none; white-space: nowrap;">${iconClock} START</button>
                <button class="btn-skip-sub" id="btn-done" style="margin: 0; border-radius: 50px; width: auto; max-width: none; white-space: nowrap;">SKIP</button>
                ${ex.name.toLowerCase().includes('adductor') ? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>` : ''}
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
            <div style="display: flex; align-items: center; gap: 10px; background: rgba(11,16,30,0.95); padding: 5px 10px; border-radius: 50px; border: 1px solid rgba(138,43,226,0.3); box-shadow: 0 5px 20px rgba(0,0,0,0.8); width: 100%; max-width: 440px; flex-wrap: nowrap; justify-content: space-evenly; gap: 4px; box-sizing: border-box; margin: 0 auto; overflow: hidden;">
                <div style="font-size: 0.8rem; font-weight: bold; color: #aaa; letter-spacing: 0px; white-space: nowrap;">SET <span style="color: #8a2be2; font-size: 1rem;">${state.currentSet}</span> OF ${ex.sets} <span style="color: white; margin-left: 3px;">${sideText}</span></div>
                <div style="font-size: 1.5rem; font-weight: bold; font-family: monospace; color: white; line-height: 1;">${ex.target_value} <span style="font-size: 0.8rem; color: #888;">REPS</span></div>
                <button class="btn-complete" id="btn-done" style="margin: 0; padding: 5px 10px; font-size: 0.7rem; border-radius: 50px; box-shadow: none; width: auto; max-width: none;">${iconCheck} COMPLETE</button>
                ${ex.name.toLowerCase().includes('adductor') ? `<button class="btn-skip-sub" id="btn-howto" style="margin: 0; border-radius: 50px; background: #007bff; border: 2px solid #007bff; color: white; cursor: pointer; white-space: nowrap; width: auto; max-width: none;">HOW TO</button>` : ''}
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
    
    content.innerHTML = restHTML;
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
        <div class="main-body tv-main" style="padding: 10px 20px; width: 100%; max-width: 100vw; min-width: 0; overflow: hidden; box-sizing: border-box; gap: 30px;">
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
    content.innerHTML = completeHTML;
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
