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
            .left-rail { width: 210px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
            .rail-item { display: flex; align-items: center; padding: 6px 8px; border-radius: 10px; background-color: #0b111e; border: 1px solid rgba(255,255,255,0.02); min-height: 56px; box-sizing: border-box; }
            .rail-item:hover:not(.active) {
                background-color: #121927;
                border-color: rgba(255,255,255,0.08);
            }
            .rail-item.active {
                background-color: #007bff;
                border-color: #007bff;
            }
            .rail-num { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #556070; color: #8892a0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; margin-right: 8px; flex-shrink: 0; }
            .rail-item.active .rail-num {
                background-color: #050810;
                border-color: transparent;
                color: white;
            }
            .rail-img { width: 54px; height: 38px; border-radius: 4px; object-fit: cover; margin-right: 8px; background-color: #15243d; flex-shrink: 0; }
            .rail-item.active .rail-img {
                filter: brightness(1);
            }
            .rail-text-col {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .rail-title { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.2px; color: white; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2; padding-right: 2px; }
            .rail-item.active .rail-title { color: white; }
            
            .rail-item.active 
            
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
    .btn-complete {
        background-color: #28a745; color: white; border-radius: 16px; height: 70px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.4rem; font-weight: 700; letter-spacing: 1px;
        transition: all 0.2s; box-shadow: 0 4px 15px rgba(40,167,69,0.3); border: none; outline: none; cursor: pointer;
    }
    .btn-complete:hover { transform: scale(1.02); filter: brightness(1.1); }
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
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.38</span></div>
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
    
    // Default fallback to 0 if undefined
    if (state.activeTimeRemaining === undefined) state.activeTimeRemaining = ex.target_value;
    
    content.innerHTML = `

<div class="app-container tv-shell">
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">${iconMobility}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.38</span></div>
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
    
    <div class="main-content tv-main">
        <aside class="left-rail">
            ${state.exercises.map((e, idx) => `
                <div class="rail-item ${idx === state.currentIndex ? 'active' : ''} sb-item" tabindex="0" data-index="${idx}" style="cursor: pointer; transition: background-color 0.2s;">
                    <div class="rail-num">${idx + 1}</div>
                    <img src="${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='${resolveAssetPath(null)}'" />
                    <div class="rail-text-col">
                        <div class="rail-title">${e.name}</div>
                        
                    </div>
                </div>
            `).join('')}
        </aside>

        <main class="workout-panel">
            <div class="wp-bg" style="background-image: url('${resolveAssetPath(ex.image_path)}');"></div>
            <div class="wp-overlay"></div>
            <div class="wp-content">
                <div class="wp-left">
                    <div class="wp-top-left">
                        <h1 class="exercise-name">${ex.name.toUpperCase()}</h1>
                        <div class="stats-row">
                            <div class="stat-col"><div class="stat-lbl">SETS</div><div class="stat-val">${ex.sets}</div></div>
                            <div class="stat-divider"></div>
                            <div class="stat-col"><div class="stat-lbl">TARGET</div><div class="stat-val">${ex.target_value} ${ex.measurement_type === 'TIME' ? 's' : 'reps'}</div></div>
                        </div>
                    </div>
                    <div class="wp-bottom-left"></div>
                </div>
                
                <div class="wp-right">
                    <div class="wp-bottom-right">
                        <div class="set-indicator" style="background: rgba(5,8,16,0.9);">SET <span class="set-num-hl" style="color: #8a2be2;">${state.currentSet}</span> OF ${ex.sets} ${sideText}</div>
                        
                        ${ex.measurement_type === 'TIME' ? `
                            <div style="font-size: 3.5rem; font-weight: bold; font-family: monospace; color: white; text-align: center; margin-top: -10px; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);" id="active-timer">${state.activeTimeRemaining}s</div>
                            <button class="btn-complete btn-timer" id="btn-timer-toggle">${iconClock} START</button>
                        ` : `
                            <button class="btn-complete btn-timer" id="btn-done">${iconCheck} COMPLETE</button>
                        `}
                        
                        ${ex.measurement_type === 'TIME' ? `<button class="btn-complete btn-skip" id="btn-done" style="height: 50px; font-size: 1.1rem; margin-top: 5px;">SKIP</button>` : ''}
                        
                        ${ex.name.toLowerCase().includes('adductor') ? `<button class="btn-complete btn-howto" id="btn-howto" style="height: 50px; font-size: 1.1rem; margin-top: 5px;">HOW TO</button>` : ''}
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
                    ${state.exercises.map((e, idx) => `
                        <div class="bb-dot-col">
                            <div class="bb-dot ${idx < state.currentIndex ? 'completed' : idx === state.currentIndex ? 'active' : ''} ${idx === state.currentIndex ? 'sb-item' : ''}"></div>
                            <div class="bb-dot-num">${idx + 1}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bb-time">
                <div class="bb-lbl">TOTAL TIME</div>
                <div class="bb-time-val time-val">00:00:00</div>
            </div>
        </div>
        
        <div class="bb-btn-next" tabindex="0" style="visibility: hidden;"></div>
    </footer>
</div>`;
    
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
                toggleBtn.innerHTML = `${iconClock} RESUME`;
            } else {
                isRunning = true;
                toggleBtn.innerHTML = `${iconClock} PAUSE`;
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
    const sideText = state.currentSide === 'NONE' ? '' : ` (${state.currentSide})`;
    
    content.innerHTML = `

<div class="app-container tv-shell">
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: #8a2be2;">${iconMobility}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">FITNESS <span style="color: #8a2be2;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.38</span></div>
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
                <div class="tv-right-sub">Exercise ${state.currentIndex + 1} of ${state.exercises.length}</div>
            </div>
        </div>
    </header>
    
    <div class="main-content tv-main">
        <aside class="left-rail">
            ${state.exercises.map((e, idx) => `
                <div class="rail-item ${idx === state.currentIndex ? 'active' : ''} sb-item" tabindex="0" data-index="${idx}" style="cursor: pointer; transition: background-color 0.2s;">
                    <div class="rail-num">${idx + 1}</div>
                    <img src="${resolveAssetPath(e.image_path)}" class="rail-img" onerror="this.src='${resolveAssetPath(null)}'" />
                    <div class="rail-text-col">
                        <div class="rail-title">${e.name}</div>
                        
                    </div>
                </div>
            `).join('')}
        </aside>

        <main class="workout-panel">
            <div class="wp-bg" style="background-image: url('${resolveAssetPath(ex.image_path)}'); opacity: 0.3;"></div>
            <div class="wp-overlay"></div>
            <div class="wp-content" style="align-items: center; justify-content: center; flex-direction: column; text-align: center;">
                <h2 style="font-size: 1.5rem; color: #aaa; letter-spacing: 2px;">REST RECOVERY</h2>
                <div style="font-size: 7rem; font-weight: bold; font-family: monospace; color: white; line-height: 1.2;" id="rest-display">${formatTime(state.restTimeRemaining)}</div>
                
                <div style="background: rgba(13,27,51,0.8); padding: 30px 60px; border-radius: 20px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 1rem; color: #8892a0; letter-spacing: 2px; margin-bottom: 10px;">UP NEXT</div>
                    <div style="font-size: 2.5rem; font-weight: bold; color: white;">${ex.name}${sideText}</div>
                    <div style="font-size: 1.2rem; color: #8a2be2; font-weight: bold; margin-top: 10px;">SET ${(ex.per_side && state.currentSide==='LEFT') ? state.currentSet : state.currentSet + 1} OF ${ex.sets}</div>
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
                    ${state.exercises.map((e, idx) => `
                        <div class="bb-dot-col">
                            <div class="bb-dot ${idx < state.currentIndex ? 'completed' : idx === state.currentIndex ? 'active' : ''} ${idx === state.currentIndex ? 'sb-item' : ''}"></div>
                            <div class="bb-dot-num">${idx + 1}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bb-time">
                <div class="bb-lbl">TOTAL TIME</div>
                <div class="bb-time-val time-val">00:00:00</div>
            </div>
        </div>
        
        <div class="bb-btn-next" tabindex="0" style="visibility: hidden;"></div>
    </footer>
</div>`;
    
    updateElapsedTimer();
    bindSidebarAndNext();
    
    document.getElementById('btn-end-workout').addEventListener('click', () => { state.mode = 'COMPLETE'; renderCurrentState(); });
    document.getElementById('btn-skip-rest').addEventListener('click', () => {
        clearInterval(state.timerInterval);
        state.mode = 'ACTIVE';
        renderCurrentState();
    });
 }

function renderComplete(content) {
    clearInterval(state.timerInterval);
    content.innerHTML = `
        ${getTopBarHTML()}
        <div class="main-body tv-main" style="background: #0b101e; justify-content: center; align-items: center; width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box; gap: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);">
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
