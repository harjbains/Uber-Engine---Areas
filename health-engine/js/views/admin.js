import { navigate } from '../router.js';
import { getSupabase } from '../supabase.js';

export function renderAdmin(container) {
    container.innerHTML = `
        <div class="admin-mode" style="background: #0b101e; height: 100vh; overflow: hidden; padding: 0; display: flex; flex-direction: column; max-width: none;">
            <header style="background: #070b14; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="color: #2196F3; font-size: 2rem;">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 1.5rem; letter-spacing: 1px; color: white;">HEALTH <span style="color: #2196F3;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.59</span></h1>
                        <div style="font-size: 0.75rem; color: #888; letter-spacing: 2px; margin-top: 2px;">ADMINISTRATION</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div id="admin-header-clock" style="color: #ccc; font-weight: bold;"></div>
                    <button class="btn" id="btn-tv-mode" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); box-shadow: none;">Launch TV Mode</button>
                </div>
            </header>
            
            <div style="display: flex; flex: 1; overflow: hidden;">
                <nav style="width: 280px; background: #0b101e; border-right: 1px solid rgba(255,255,255,0.05); padding: 20px 0; display: flex; flex-direction: column;">
                    <ul style="list-style: none; padding: 0; margin: 0; flex: 1;" id="admin-nav">
                        <li data-tab="general" class="nav-item active">General Settings</li>
                        <li data-tab="strength" class="nav-item">Strength Configuration</li>
                        <li data-tab="cardio" class="nav-item">Cardio Configuration</li>
                        <li data-tab="mobility" class="nav-item">Mobility Configuration</li>
                        <li data-tab="data" class="nav-item" style="margin-top: 20px;">Data Management</li>
                    </ul>
                </nav>
                
                <main id="admin-content" style="flex: 1; padding: 40px; overflow-y: auto; background: #0b101e; position: relative;">
                    <!-- Tab content injected here -->
                </main>
            </div>
        </div>
        
        <style>
            .nav-item { padding: 15px 30px; cursor: pointer; color: #888; font-weight: 500; display: flex; align-items: center; gap: 15px; border-left: 4px solid transparent; transition: all 0.2s; }
            .nav-item:hover { color: #fff; background: rgba(255,255,255,0.02); }
            .nav-item.active { color: #2196F3; background: rgba(33, 150, 243, 0.08); border-left-color: #2196F3; font-weight: 600; }
            
            #admin-content h2 { font-size: 2.2rem; margin: 0 0 10px 0; color: #fff; }
            #admin-content p { color: #888; font-size: 1.1rem; margin-bottom: 30px; }
            
            .form-group { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
            .form-group label { color: #aaa; font-size: 0.95rem; font-weight: 500; }
            .form-group input, .form-group select { width: 100%; padding: 12px 15px; background: #070b14; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; box-sizing: border-box; font-size: 1rem; transition: border-color 0.2s, background 0.2s; }
            .form-group input:focus, .form-group select:focus { border-color: #2196F3; outline: none; background: rgba(0,0,0,0.5); }
            .form-group input[type="checkbox"] { width: 22px; height: 22px; accent-color: #2196F3; margin: 0; cursor: pointer; }
            
            .form-row { display: flex; gap: 20px; margin-bottom: 15px; }
            .form-row .form-group { flex: 1; }
            
            .item-card { background: #13192a; padding: 25px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
            .exercise-list { display: flex; flex-direction: column; gap: 10px; }
            
            .actions { display: flex; gap: 10px; margin-top: 20px; }
            
            .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.2); box-shadow: none; color: #fff; }
            .btn-secondary:hover { background: rgba(255,255,255,0.05); border-color: #fff; }
        </style>
    `;

    document.getElementById('btn-tv-mode').addEventListener('click', () => navigate('/tv'));

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            loadTabContent(item.dataset.tab);
        });
    });

    loadTabContent('general');
}

async function loadTabContent(tab) {
    const content = document.getElementById('admin-content');
    content.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
    
    try {
        switch(tab) {
            case 'general':
                await renderGeneralSettings(content);
                break;
            case 'strength':
                await renderStrengthConfig(content);
                break;
            case 'cardio':
                await renderCardioConfig(content);
                break;
            case 'mobility':
                await renderMobilityConfig(content);
                break;
            case 'data':
                await renderDataManagement(content);
                break;
        }
    } catch (err) {
        content.innerHTML = `<p style="color: var(--primary-color);">Error loading data: ${err.message}</p>`;
    }
}

// ---------------------------------------------------------------------------
// General Settings
// ---------------------------------------------------------------------------
async function renderGeneralSettings(content) {
    const { data: user } = await getSupabase().auth.getUser();
    if (!user.user) {
        content.innerHTML = '<p>Please log in to Supabase first.</p>';
        return;
    }
    
    let { data: settings } = await getSupabase().from('health_settings').select('*').single();
    if (!settings) {
        // Seed default
        const res = await getSupabase().from('health_settings').insert({ owner_id: user.user.id }).select().single();
        settings = res.data;
    }
    
    content.innerHTML = `
        <h2>General Settings</h2>
        <form id="general-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Weekly Strength Goal</label>
                    <input type="number" id="gen-strength" value="${settings.weekly_strength_goal}" min="0" required>
                </div>
                <div class="form-group">
                    <label>Weekly Cardio Goal</label>
                    <input type="number" id="gen-cardio" value="${settings.weekly_cardio_goal}" min="0" required>
                </div>
                <div class="form-group">
                    <label>Weekly Mobility Goal</label>
                    <input type="number" id="gen-mobility" value="${settings.weekly_mobility_goal}" min="0" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Weight Unit</label>
                    <select id="gen-weight"><option value="kg" ${settings.weight_unit==='kg'?'selected':''}>kg</option></select>
                </div>
                <div class="form-group">
                    <label>Distance Unit</label>
                    <select id="gen-dist"><option value="km" ${settings.distance_unit==='km'?'selected':''}>km</option></select>
                </div>
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="gen-sound" ${settings.sound_enabled ? 'checked' : ''}> Sound Enabled</label>
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="gen-celebrations" ${settings.celebrations_enabled ? 'checked' : ''}> Celebrations Enabled</label>
            </div>
            <div class="actions">
                <button type="submit" class="btn">Save Settings</button>
            </div>
        </form>
    `;
    
    document.getElementById('general-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await getSupabase().from('health_settings').update({
                weekly_strength_goal: parseInt(document.getElementById('gen-strength').value),
                weekly_cardio_goal: parseInt(document.getElementById('gen-cardio').value),
                weekly_mobility_goal: parseInt(document.getElementById('gen-mobility').value),
                weight_unit: document.getElementById('gen-weight').value,
                distance_unit: document.getElementById('gen-dist').value,
                sound_enabled: document.getElementById('gen-sound').checked,
                celebrations_enabled: document.getElementById('gen-celebrations').checked
            }).eq('owner_id', user.user.id);
            alert('Settings saved!');
        } catch (err) { alert(err.message); }
    });
}

// ---------------------------------------------------------------------------
// Strength Config
// ---------------------------------------------------------------------------
async function renderStrengthConfig(content) {
    const { data: exercises } = await getSupabase().from('health_strength_exercises').select('*').order('display_order', { ascending: true });
    
    let html = `<h2>Strength Configuration</h2>
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-secondary" id="btn-add-strength">Add Exercise</button>
                </div>
                <div id="strength-list"></div>`;
    content.innerHTML = html;
    
    const list = document.getElementById('strength-list');
    
    const renderList = () => {
        list.innerHTML = exercises.map((ex, i) => `
            <div class="item-card">
                <form class="strength-form" data-index="${i}">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;"><label>Name</label><input type="text" name="name" value="${ex.name}" required></div>
                        <div class="form-group"><label>Order</label><input type="number" name="display_order" value="${ex.display_order}" required></div>
                        <div class="form-group"><label>Active</label><input type="checkbox" name="is_active" ${ex.is_active ? 'checked':''}></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Sets</label><input type="number" name="sets" value="${ex.sets}" required></div>
                        <div class="form-group"><label>Min Reps</label><input type="number" name="min_reps" value="${ex.rep_min}" required></div>
                        <div class="form-group"><label>Max Reps</label><input type="number" name="max_reps" value="${ex.rep_max}" required></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Weight (kg)</label><input type="number" step="0.5" name="current_weight_kg" value="${ex.current_weight_kg}" required></div>
                        <div class="form-group"><label>Increment (kg)</label><input type="number" step="0.5" name="progression_increment_kg" value="${ex.progression_increment_kg}" required></div>
                        <div class="form-group"><label>Rest (s)</label><input type="number" name="rest_seconds" value="${ex.rest_seconds}" required></div>
                    </div>
                    <div class="form-group">
                        <label>Image Path</label><input type="text" name="image_path" value="${(ex.image_path || '').replace(/^\/?(public\/)?assets\/health-engine\//i, '')}">
                    </div>
                    <button type="submit" class="btn">Save</button>
                </form>
            </div>
        `).join('');
        
        document.querySelectorAll('.strength-form').forEach(f => {
            f.addEventListener('submit', async (e) => {
                e.preventDefault();
                const idx = e.target.dataset.index;
                const ex = exercises[idx];
                const formData = new FormData(e.target);
                
                let imgPath = formData.get('image_path') || '';
                imgPath = imgPath.replace(/^\/?(public\/)?assets\/health-engine\//i, '');
                
                const payload = {
                    name: formData.get('name'),
                    display_order: parseInt(formData.get('display_order')),
                    is_active: formData.get('is_active') === 'on',
                    sets: parseInt(formData.get('sets')),
                    rep_min: parseInt(formData.get('min_reps')),
                    rep_max: parseInt(formData.get('max_reps')),
                    current_weight_kg: parseFloat(formData.get('current_weight_kg')),
                    progression_increment_kg: parseFloat(formData.get('progression_increment_kg')),
                    rest_seconds: parseInt(formData.get('rest_seconds')),
                    image_path: imgPath
                };
                
                if (ex.id) {
                    await getSupabase().from('health_strength_exercises').update(payload).eq('id', ex.id);
                } else {
                    const { data: user } = await getSupabase().auth.getUser();
                    payload.owner_id = user.user.id;
                    const res = await getSupabase().from('health_strength_exercises').insert(payload).select().single();
                    exercises[idx] = res.data;
                }
                alert('Saved!');
            });
        });
    };
    
    if (exercises) renderList();
    
    document.getElementById('btn-add-strength').addEventListener('click', () => {
        const nextOrder = exercises.length > 0 ? Math.max(...exercises.map(e => e.display_order)) + 1 : 1;
        exercises.unshift({
            name: '', display_order: nextOrder, sets: 3, rep_min: 8, rep_max: 12,
            current_weight_kg: 0, progression_increment_kg: 2.5, rest_seconds: 90, image_path: '', is_active: true
        });
        renderList();
    });
}

// ---------------------------------------------------------------------------
// Cardio Config
// ---------------------------------------------------------------------------
async function renderCardioConfig(content) {
    const { data: user } = await getSupabase().auth.getUser();
    let { data: cardio } = await getSupabase().from('health_cardio_settings').select('*').single();
    
    if (!cardio) {
        const res = await getSupabase().from('health_cardio_settings').insert({ owner_id: user.user.id }).select().single();
        cardio = res.data;
    }
    
    content.innerHTML = `
        <h2>Cardio Configuration</h2>
        <p style="color:var(--text-muted);">Treadmill default settings.</p>
        <form id="cardio-form">
            <div class="form-row">
                <div class="form-group"><label>Default Duration (min)</label><input type="number" id="c-duration" value="${cardio.default_duration_minutes}" min="1" required></div>
                <div class="form-group"><label>Default Speed (km/h)</label><input type="number" step="0.1" id="c-speed" value="${cardio.default_speed_kmh}" min="0" required></div>
                <div class="form-group"><label>Default Incline</label><input type="number" step="0.5" id="c-incline" value="${cardio.default_incline_percent}" min="0" required></div>
            </div>
            <button type="submit" class="btn">Save Cardio Defaults</button>
        </form>
    `;
    
    document.getElementById('cardio-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await getSupabase().from('health_cardio_settings').update({
                default_duration_minutes: parseInt(document.getElementById('c-duration').value),
                default_speed_kmh: parseFloat(document.getElementById('c-speed').value),
                default_incline_percent: parseFloat(document.getElementById('c-incline').value)
            }).eq('owner_id', user.user.id);
            alert('Cardio settings saved!');
        } catch (err) { alert(err.message); }
    });
}

// ---------------------------------------------------------------------------
// Mobility Config
// ---------------------------------------------------------------------------
async function renderMobilityConfig(content) {
    const { data: exercises } = await getSupabase().from('health_mobility_exercises').select('*').order('display_order', { ascending: true });
    
    let html = `<h2>Mobility Configuration</h2>
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-secondary" id="btn-add-mobility">Add Exercise</button>
                </div>
                <div id="mobility-list"></div>`;
    content.innerHTML = html;
    
    const list = document.getElementById('mobility-list');
    
    const renderList = () => {
        list.innerHTML = exercises.map((ex, i) => `
            <div class="item-card">
                <form class="mobility-form" data-index="${i}">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;"><label>Name</label><input type="text" name="name" value="${ex.name}" required></div>
                        <div class="form-group"><label>Type</label>
                            <select name="measurement_type">
                                <option value="TIME" ${ex.measurement_type==='TIME'?'selected':''}>TIME</option>
                                <option value="REPS" ${ex.measurement_type==='REPS'?'selected':''}>REPS</option>
                            </select>
                        </div>
                        <div class="form-group"><label>Active</label><input type="checkbox" name="is_active" ${ex.is_active ? 'checked':''}></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Target (s/reps)</label><input type="number" name="target_value" value="${ex.target_value}" required></div>
                        <div class="form-group"><label>Sets</label><input type="number" name="sets" value="${ex.sets}" required></div>
                        <div class="form-group"><label>Rest (s)</label><input type="number" name="rest_seconds" value="${ex.rest_seconds}" required></div>
                        <div class="form-group"><label>Order</label><input type="number" name="display_order" value="${ex.display_order}" required></div>
                    </div>
                    <div class="form-group"><label><input type="checkbox" name="per_side" ${ex.per_side ? 'checked':''}> Per Side</label></div>
                    <div class="form-group">
                        <label>Image Path</label><input type="text" name="image_path" value="${(ex.image_path || '').replace(/^\/?(public\/)?assets\/health-engine\//i, '')}">
                    </div>
                    <button type="submit" class="btn">Save</button>
                </form>
            </div>
        `).join('');
        
        document.querySelectorAll('.mobility-form').forEach(f => {
            f.addEventListener('submit', async (e) => {
                e.preventDefault();
                const idx = e.target.dataset.index;
                const ex = exercises[idx];
                const formData = new FormData(e.target);
                
                let imgPath = formData.get('image_path') || '';
                imgPath = imgPath.replace(/^\/?(public\/)?assets\/health-engine\//i, '');
                
                const payload = {
                    name: formData.get('name'),
                    measurement_type: formData.get('measurement_type'),
                    target_value: parseInt(formData.get('target_value')),
                    sets: parseInt(formData.get('sets')),
                    rest_seconds: parseInt(formData.get('rest_seconds')),
                    display_order: parseInt(formData.get('display_order')),
                    per_side: formData.get('per_side') === 'on',
                    is_active: formData.get('is_active') === 'on',
                    image_path: imgPath
                };
                
                try {
                    if (ex.id) {
                        const { error } = await getSupabase().from('health_mobility_exercises').update(payload).eq('id', ex.id);
                        if (error) throw error;
                    } else {
                        const { data: user } = await getSupabase().auth.getUser();
                        payload.owner_id = user.user.id;
                        const res = await getSupabase().from('health_mobility_exercises').insert(payload).select().single();
                        if (res.error) throw res.error;
                        exercises[idx] = res.data;
                    }
                    alert('Saved!');
                } catch (err) {
                    alert('Error saving: ' + err.message);
                }
            });
        });
    };
    
    if (exercises) renderList();
    
    document.getElementById('btn-add-mobility').addEventListener('click', () => {
        const nextOrder = exercises.length > 0 ? Math.max(...exercises.map(e => e.display_order)) + 1 : 1;
        exercises.unshift({
            name: '', measurement_type: 'TIME', target_value: 30, sets: 1, rest_seconds: 0,
            display_order: nextOrder, per_side: false, image_path: '', is_active: true
        });
        renderList();
    });
}

// ---------------------------------------------------------------------------
// Data Management
// ---------------------------------------------------------------------------
async function renderDataManagement(content) {
    content.innerHTML = `
        <h2>Data Management</h2>
        <p>Session history and data actions.</p>
        <div class="item-card">
            <h3>Recent Sessions</h3>
            <p>Feature placeholder: Viewing recent strength, cardio, and mobility sessions.</p>
        </div>
        <div class="item-card" style="border-color: var(--primary-color);">
            <h3 style="color: var(--primary-color);">Danger Zone</h3>
            <button class="btn" style="background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color);" onclick="alert('Destructive actions require confirmation. (Not implemented in Stage 2 shell)')">Reset All Configuration</button>
        </div>
    `;
}
