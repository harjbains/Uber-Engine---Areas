import { getSupabase } from '../supabase.js';
import { navigate } from '../router.js';
import { resolveAssetPath } from '../assets.js';

let state = {
    duration: 30, // min
    distance: 5.0, // km
    speed: 10.0, // km/h
    incline: 1.0 // %
};

export function renderCardio(container) {
    const iconRun = `<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 6.7 1.4 1.3-6.4z"/></svg>`;
    const iconCheck = `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

    const render = () => {
        container.innerHTML = `
            <div class="app-container">
                <header class="top-bar">
                    <div class="logo-area">
                        <div class="logo-icon">${iconRun}</div>
                        <div class="logo-text-block">
                            <div class="logo-title">FITNESS <span class="text-green">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v1.6</span></div>
                            <div class="logo-tag">CARDIO &middot; ENDURANCE &middot; HEALTH</div>
                        </div>
                    </div>
                    <div class="nav-home" tabindex="0" id="btn-home">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="margin-right: 8px;"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                        Home
                    </div>
                    <div class="top-right-info">
                        <div class="tr-title">CARDIO WORKOUT</div>
                        <div class="tr-sub">Treadmill (Manual Entry)</div>
                    </div>
                </header>
                
                <div class="main-content" style="justify-content: center; align-items: center;">
                    <main class="workout-panel" style="position: relative; overflow: hidden; width: 100%; max-width: 1400px; display: flex; flex-direction: column; align-items: center;">
                        <div class="wp-bg" style="background-image: url('${resolveAssetPath('backgrounds/treadmill-background.png')}');"></div>
                        <div class="wp-overlay"></div>
                        <div class="wp-content" style="position: relative; z-index: 3; padding: 60px; display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%;">
                            <h1 class="exercise-name" style="text-align: center; margin-bottom: 50px;">TREADMILL RUN</h1>
                            
                            <div class="controls-area">
                                <div class="control-box box-dur">
                                    <div class="ctrl-lbl">DURATION (MIN)</div>
                                    <div class="ctrl-interactive bg-green-grad">
                                        <div class="ctrl-arrow-container" tabindex="0" id="dur-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
                                        <div class="ctrl-val">${state.duration}</div>
                                        <div class="ctrl-arrow-container" tabindex="0" id="dur-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub">Increment: 1 min</div>
                                </div>
                                
                                <div class="control-box box-dist">
                                    <div class="ctrl-lbl">DISTANCE (KM)</div>
                                    <div class="ctrl-interactive bg-blue-grad">
                                        <div class="ctrl-arrow-container" tabindex="0" id="dist-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
                                        <div class="ctrl-val">${state.distance.toFixed(1)}</div>
                                        <div class="ctrl-arrow-container" tabindex="0" id="dist-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub">Increment: 0.1 km</div>
                                </div>
                                
                                <div class="control-box box-spd">
                                    <div class="ctrl-lbl">AVG SPEED (KM/H)</div>
                                    <div class="ctrl-interactive bg-purple-grad">
                                        <div class="ctrl-arrow-container" tabindex="0" id="spd-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
                                        <div class="ctrl-val">${state.speed.toFixed(1)}</div>
                                        <div class="ctrl-arrow-container" tabindex="0" id="spd-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub">Increment: 0.1 km/h</div>
                                </div>
                                
                                <div class="control-box box-inc">
                                    <div class="ctrl-lbl">INCLINE (%)</div>
                                    <div class="ctrl-interactive bg-orange-grad">
                                        <div class="ctrl-arrow-container" tabindex="0" id="inc-up"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 6l9 12H3z" fill="white"/></svg></div>
                                        <div class="ctrl-val">${state.incline.toFixed(1)}</div>
                                        <div class="ctrl-arrow-container" tabindex="0" id="inc-down"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 18l9-12H3z" fill="white"/></svg></div>
                                    </div>
                                    <div class="ctrl-sub">Increment: 0.5 %</div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 60px; width: 100%; display: flex; justify-content: center;">
                                <button class="btn-complete" id="btn-record" style="width: 400px;">
                                    ${iconCheck} SAVE WORKOUT
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
                
                <footer class="bottom-bar">
                    <div class="bb-btn-end" tabindex="0" id="btn-end">
                        <div class="bb-end-x">&times;</div>
                        <div class="bb-end-text">
                            <div class="bb-end-t1">CANCEL</div>
                            <div class="bb-end-t2">Return home</div>
                        </div>
                    </div>
                </footer>
            </div>
            
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                button { outline: none; border: none; cursor: pointer; font-family: inherit; }
                
                .app-container { width: 100vw; height: 100vh; background-color: #050810; color: white; display: flex; flex-direction: column; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                
                .top-bar { height: 100px; background-color: #070b14; display: flex; align-items: center; padding: 0 40px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .logo-area { display: flex; align-items: center; gap: 15px; width: 350px; }
                .logo-icon { color: white; }
                .logo-text-block { display: flex; flex-direction: column; }
                .logo-title { font-size: 1.8rem; font-weight: 900; letter-spacing: 1px; }
                .text-green { color: #28a745; }
                .logo-tag { font-size: 0.7rem; color: #8892a0; letter-spacing: 3px; font-weight: 700; margin-top: 2px; }
                
                .nav-home { display: flex; align-items: center; font-size: 1.2rem; color: #8892a0; cursor: pointer; flex: 1; justify-content: center; transition: color 0.2s; }
                .nav-home:hover { color: white; }
                
                .top-right-info { display: flex; flex-direction: column; text-align: right; width: 350px; }
                .tr-title { font-size: 1.5rem; font-weight: 800; letter-spacing: 1px; }
                .tr-sub { font-size: 1.15rem; color: #8892a0; margin-top: 4px; font-weight: 500; }
                
                .main-content { display: flex; flex: 1; overflow: hidden; background-color: #050810; }
                
                .workout-panel { background: #0b111e; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; }
                .wp-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; z-index: 1; opacity: 1; }
                .wp-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(11,17,30,0.2) 0%, rgba(11,17,30,0.6) 100%); z-index: 2; }
                .exercise-name { font-size: 4.2rem; font-weight: 900; letter-spacing: 2px; line-height: 1; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
                
                .controls-area { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; }
                
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
                .box-dur { border: 1px solid rgba(40, 167, 69, 0.12); }
                .box-dist { border: 1px solid rgba(150, 200, 255, 0.12); }
                .box-spd { border: 1px solid rgba(200, 150, 255, 0.12); }
                .box-inc { border: 1px solid rgba(255, 165, 0, 0.12); }
                
                .ctrl-lbl { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 20px; color: white; text-align: center; }
                
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
                .bg-green-grad { background: linear-gradient(180deg, #28a745 0%, #20c997 100%); }
                .bg-blue-grad { background: linear-gradient(180deg, #1e87f0 0%, #00b3ff 100%); }
                .bg-purple-grad { background: linear-gradient(180deg, #8b45f7 0%, #bb6df9 100%); }
                .bg-orange-grad { background: linear-gradient(180deg, #fd7e14 0%, #ffc107 100%); }
                
                .ctrl-arrow-container { flex: 1; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .ctrl-arrow-container:hover { background: rgba(255,255,255,0.1); }
                
                .ctrl-val {
                    background-color: #15243d;
                    margin: 0 4px;
                    height: 110px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4.5rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                
                .ctrl-sub { font-size: 0.85rem; color: #d1d5db; margin-top: 15px; height: 20px; }
                
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
                    transition: filter 0.2s;
                }
                .btn-complete:hover { filter: brightness(1.1); }
                .btn-complete:disabled { opacity: 0.5; cursor: not-allowed; }
                
                .bottom-bar { height: 110px; background-color: #070b14; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: flex-start; padding: 0 40px; }
                
                .bb-btn-end { background-color: #111827; border-radius: 16px; height: 70px; padding: 0 25px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: background 0.2s; }
                .bb-btn-end:hover { background-color: #1a2238; }
                .bb-end-x { font-size: 2rem; font-weight: bold; }
                .bb-end-text { display: flex; flex-direction: column; }
                .bb-end-t1 { font-size: 1rem; font-weight: 700; letter-spacing: 1px; }
                .bb-end-t2 { font-size: 0.8rem; color: #8892a0; margin-top: 2px; }
            </style>
        `;

        document.getElementById('btn-home').addEventListener('click', () => navigate('/tv'));
        document.getElementById('btn-end').addEventListener('click', () => navigate('/tv'));
        
        // Handlers
        const update = () => { render(); };
        
        document.getElementById('dur-up').addEventListener('click', () => { state.duration += 1; update(); });
        document.getElementById('dur-down').addEventListener('click', () => { if (state.duration > 1) state.duration -= 1; update(); });
        
        document.getElementById('dist-up').addEventListener('click', () => { state.distance = parseFloat((state.distance + 0.1).toFixed(1)); update(); });
        document.getElementById('dist-down').addEventListener('click', () => { if (state.distance > 0.1) state.distance = parseFloat((state.distance - 0.1).toFixed(1)); update(); });
        
        document.getElementById('spd-up').addEventListener('click', () => { state.speed = parseFloat((state.speed + 0.1).toFixed(1)); update(); });
        document.getElementById('spd-down').addEventListener('click', () => { if (state.speed > 0.1) state.speed = parseFloat((state.speed - 0.1).toFixed(1)); update(); });
        
        document.getElementById('inc-up').addEventListener('click', () => { state.incline = parseFloat((state.incline + 0.5).toFixed(1)); update(); });
        document.getElementById('inc-down').addEventListener('click', () => { if (state.incline >= 0.5) state.incline = parseFloat((state.incline - 0.5).toFixed(1)); else state.incline = 0; update(); });
        
        document.getElementById('btn-record').addEventListener('click', async () => {
            const btn = document.getElementById('btn-record');
            btn.disabled = true;
            btn.innerHTML = 'SAVING...';
            
            try {
                const { data: user } = await getSupabase().auth.getUser();
                if (!user.user) throw new Error("Not authenticated");

                const { error: insertErr } = await getSupabase().from('health_cardio_sessions').insert({
                    owner_id: user.user.id,
                    duration_minutes: state.duration,
                    distance_km: state.distance,
                    avg_speed_kmh: state.speed,
                    incline_percentage: state.incline,
                    completed_at: new Date().toISOString()
                });

                if (insertErr) throw insertErr;
                
                container.innerHTML = `
                    <div style="width:100vw; height:100vh; background:#050810; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <h1 style="font-size: 5rem; color: #28a745; margin-bottom: 20px; font-family: sans-serif;">SESSION SAVED</h1>
                        <p style="font-size: 2rem; color: #8892a0; font-family: sans-serif;">Returning home...</p>
                    </div>
                `;
                setTimeout(() => navigate('/tv'), 1500);
            } catch (err) {
                alert("Failed to save cardio session: " + err.message);
                btn.disabled = false;
                btn.innerHTML = `${iconCheck} SAVE WORKOUT`;
            }
        });
    };
    
    render();
}
