import { navigate } from '../router.js';
import { resolveAssetPath } from '../assets.js';
import { getSupabase } from '../supabase.js';

export async function renderTvHome(container) {
    const bgUrl = resolveAssetPath('backgrounds/gym-main.webp');
    const strengthBg = resolveAssetPath('strength/squat.webp', 'Squat');
    const cardioBg = resolveAssetPath('cardio/treadmill.webp', 'Treadmill');
    const mobilityBg = resolveAssetPath('mobility/hamstring-stretch.webp', 'Hamstring Stretch');

    // SVG Icons
    const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>`;
    const iconRunning = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>`;
    const iconStretching = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 16.5l-3.5-3.5H16l-3.2-8.5c-.3-.8-1.1-1.3-1.9-1.3-.2 0-.4 0-.6.1L4 9.5V14h2v-3.2l2.8-1 1.2 7.7-4 3.5 1.3 1.5 4.1-3.6 1.6-4.4 2 2v6h2v-6.5l-2-2 1-4.7 2.8 2.8v4.2h2v-5.4z"/></svg>`;
    const iconCalendar = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 5h5v5H7v-5z"/></svg>`;
    const iconChart = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"/></svg>`;
    const iconTrophy = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 3h-2V1h-2v2H9V1H7v2H5c-1.1 0-2 .9-2 2v3c0 2.21 1.79 4 4 4h1.1c1.23 2.12 3.32 3.6 5.9 3.91V20H9v2h6v-2h-3v-4.09c2.58-.31 4.67-1.79 5.9-3.91H19c2.21 0 4-1.79 4-4V5c0-1.1-.9-2-2-2zm-12 5H5V5h2v3zm12 0h-2V5h2v3z"/></svg>`;
    const iconGear = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;

    // Check for recent sessions for status display
    let strengthStatus = "Ready for workout";
    let cardioStatus = "Ready for workout";
    let mobilityStatus = "Ready for workout";
    try {
        const { data: user } = await getSupabase().auth.getUser();
        if (user.user) {
            const fetchLatest = async (table) => {
                const { data } = await getSupabase().from(table)
                    .select('completed_at')
                    .eq('owner_id', user.user.id)
                    .order('completed_at', { ascending: false }).limit(1);
                return data && data.length > 0 ? new Date(data[0].completed_at) : null;
            };
            
            const formatDate = (date) => {
                if (!date) return null;
                const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
            };
            
            const [sDate, cDate, mDate] = await Promise.all([
                fetchLatest('health_strength_sessions'),
                fetchLatest('health_cardio_sessions'),
                fetchLatest('health_mobility_sessions')
            ]);
            
            if (sDate) strengthStatus = `Last session: <span style="color: #4bacff; font-weight: 500;">${formatDate(sDate)}</span>`;
            if (cDate) cardioStatus = `Last session: <span style="color: #66ff66; font-weight: 500;">${formatDate(cDate)}</span>`;
            if (mDate) mobilityStatus = `Last session: <span style="color: #d18cff; font-weight: 500;">${formatDate(mDate)}</span>`;
        }
    } catch(e) {
        // Fallbacks remain "Ready for workout"
    }

    container.innerHTML = `
        <style>
            .home-layout {  display: flex; flex-direction: column;  box-sizing: border-box; background: url('${bgUrl}') no-repeat center center/cover; position: relative; color: white; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .home-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 15, 30, 0.7); backdrop-filter: blur(8px); z-index: 0; }
            .home-content { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; justify-content: center; }
            
            .header { display: flex; justify-content: space-between; align-items: flex-start;  }
            .brand { display: flex; align-items: center; gap: 15px; }
            .brand-icon { width: 50px; height: 50px; color: #2196F3; }
            .brand-title { margin: 0; font-size: 2.5rem; font-weight: bold; letter-spacing: 2px; line-height: 1.1; }
            .brand-tag { font-size: 0.9rem; color: #aaa; letter-spacing: 5px; margin-top: 5px; text-transform: uppercase; }
            
            .header-right { display: flex; align-items: center; gap: 20px; text-align: right; }
            .datetime { display: flex; flex-direction: column; align-items: flex-end; }
            .date-text { font-size: 1.1rem; color: #ccc; }
            .time-text { font-size: 2.2rem; font-weight: bold; }
            .header-divider { width: 1px; height: 50px; background: rgba(255,255,255,0.2); margin: 0 10px; }
            .settings-btn { background: transparent; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: color 0.2s; }
            .settings-btn:hover { color: #fff; }
            .settings-btn span { font-size: 0.8rem; letter-spacing: 1px; }
            
            .cards-container { display: flex; gap: 30px; flex: 1; align-items: stretch; margin-top: auto; margin-bottom: auto; max-height: 600px; }
            
            .w-card { flex: 1; border-radius: 24px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; transition: transform 0.2s; }
            .w-card:hover { transform: scale(1.02); }
            
            .card-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: 1; }
            .card-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; }
            .card-blue .card-overlay { background: linear-gradient(to bottom, rgba(4, 20, 40, 0.5) 0%, rgba(4, 20, 40, 0.95) 100%); }
            .card-green .card-overlay { background: linear-gradient(to bottom, rgba(4, 30, 15, 0.5) 0%, rgba(4, 30, 15, 0.95) 100%); }
            .card-purple .card-overlay { background: linear-gradient(to bottom, rgba(30, 5, 40, 0.5) 0%, rgba(30, 5, 40, 0.95) 100%); }
            
            .card-content { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; padding: 40px; text-align: center; }
            
            .card-icon-container { width: 100px;  margin-bottom: auto; margin-top: 40px; }
            .card-blue .card-icon-container { color: #5eb5ff; }
            .card-green .card-icon-container { color: #66bb6a; }
            .card-purple .card-icon-container { color: #ab47bc; }
            
            .card-title { font-size: 3.5rem; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 2px; }
            .card-subtitle { font-size: 1.2rem; color: #ccc; letter-spacing: 2px; margin-bottom: 25px; text-transform: uppercase; }
            
            .card-status { background: rgba(0,0,0,0.4); border-radius: 20px; padding: 10px 25px; font-size: 1.1rem; color: #ccc;  border: 1px solid rgba(255,255,255,0.05); }
            
            .btn-start { width: 100%; padding: 25px; border-radius: 16px; font-size: 2.2rem; font-weight: bold; color: white; border: none; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
            .btn-start:hover { filter: brightness(1.1); }
            .btn-blue { background: #2196F3; box-shadow: 0 5px 20px rgba(33, 150, 243, 0.4); }
            .btn-green { background: #4CAF50; box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4); }
            .btn-purple { background: #9C27B0; box-shadow: 0 5px 20px rgba(156, 39, 176, 0.4); }
            
            .footer { display: flex; gap: 20px;  }
            .footer-btn { flex: 1; background: rgba(20, 25, 35, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; padding: 0 25px; cursor: pointer; transition: 0.2s; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
            .footer-btn:hover { background: rgba(30, 35, 50, 0.95); }
            .footer-icon { width: 40px; height: 40px; margin-right: 20px; display: flex; align-items: center; justify-content: center; }
            .footer-text { flex: 1; display: flex; flex-direction: column; justify-content: center; }
            .footer-title { font-size: 1.2rem; font-weight: bold; margin: 0 0 4px 0; }
            .footer-subtitle { font-size: 0.9rem; color: #aaa; margin: 0; }
            .footer-arrow { color: #666; font-size: 1.5rem; font-weight: bold; }
        </style>

        <div class="home-layout tv-shell">
            <div class="home-overlay"></div>
            <div class="home-content tv-shell">
                
                <!-- Header -->
                <div class="header tv-header">
                    <div class="brand">
                        <div class="brand-icon">${iconDumbbell}</div>
                        <div>
                            <h1 class="brand-title">HEALTH <span style="color: #2196F3;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.0</span></h1>
                            <div class="brand-tag">STRONGER &middot; FITTER &middot; HEALTHIER</div>
                        </div>
                    </div>
                    
                    <div class="header-right">
                        <div class="datetime">
                            <div class="date-text" id="tv-date">Sat, 26 Sept 2026</div>
                            <div class="time-text" id="tv-time">--:--</div>
                        </div>
                        <div class="header-divider"></div>
                        <button class="settings-btn" id="btn-admin-top">
                            ${iconGear}
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
                
                <!-- Cards -->
                <div class="cards-container tv-main">
                    
                    <!-- Strength -->
                    <div tabindex="0" class="w-card card-blue">
                        <div class="card-bg" style="background-image: url('${strengthBg}');"></div>
                        <div class="card-overlay"></div>
                        <div class="card-content">
                            <div class="card-icon-container">${iconDumbbell}</div>
                            <h2 class="card-title">STRENGTH</h2>
                            <div class="card-subtitle">6 EXERCISES</div>
                            <div class="card-status">${strengthStatus}</div>
                            <button class="btn-start btn-blue" id="btn-strength">START &rsaquo;</button>
                        </div>
                    </div>
                    
                    <!-- Cardio -->
                    <div tabindex="0" class="w-card card-green">
                        <div class="card-bg" style="background-image: url('${cardioBg}');"></div>
                        <div class="card-overlay"></div>
                        <div class="card-content">
                            <div class="card-icon-container">${iconRunning}</div>
                            <h2 class="card-title">CARDIO</h2>
                            <div class="card-subtitle">TREADMILL</div>
                            <div class="card-status">${cardioStatus}</div>
                            <button class="btn-start btn-green" id="btn-cardio">START &rsaquo;</button>
                        </div>
                    </div>
                    
                    <!-- Mobility -->
                    <div tabindex="0" class="w-card card-purple">
                        <div class="card-bg" style="background-image: url('${mobilityBg}');"></div>
                        <div class="card-overlay"></div>
                        <div class="card-content">
                            <div class="card-icon-container">${iconStretching}</div>
                            <h2 class="card-title">MOBILITY</h2>
                            <div class="card-subtitle">FLEXIBILITY & MOVEMENT</div>
                            <div class="card-status">${mobilityStatus}</div>
                            <button class="btn-start btn-purple" id="btn-mobility">START &rsaquo;</button>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Footer Navigation -->
                <div class="footer tv-footer">
                    <div class="footer-btn" tabindex="0">
                        <div class="footer-icon" style="color: #fff;">${iconCalendar}</div>
                        <div class="footer-text">
                            <h3 class="footer-title">TODAY</h3>
                            <p class="footer-subtitle">View today's summary</p>
                        </div>
                        <div class="footer-arrow">&rsaquo;</div>
                    </div>
                    <div class="footer-btn" tabindex="0">
                        <div class="footer-icon" style="color: #fff;">${iconChart}</div>
                        <div class="footer-text">
                            <h3 class="footer-title">HISTORY</h3>
                            <p class="footer-subtitle">View your progress</p>
                        </div>
                        <div class="footer-arrow">&rsaquo;</div>
                    </div>
                    <div class="footer-btn" tabindex="0">
                        <div class="footer-icon" style="color: #FFD700;">${iconTrophy}</div>
                        <div class="footer-text">
                            <h3 class="footer-title">BADGES</h3>
                            <p class="footer-subtitle">View achievements</p>
                        </div>
                        <div class="footer-arrow">&rsaquo;</div>
                    </div>
                    <div class="footer-btn" tabindex="0" id="btn-admin-bottom">
                        <div class="footer-icon" style="color: #fff;">${iconGear}</div>
                        <div class="footer-text">
                            <h3 class="footer-title">SETTINGS</h3>
                            <p class="footer-subtitle">Sound, display, etc.</p>
                        </div>
                        <div class="footer-arrow">&rsaquo;</div>
                    </div>
                </div>
                
            </div>
        </div>
    `;

    // Clock and Date
    const updateTime = () => {
        const timeEl = document.getElementById('tv-time');
        const dateEl = document.getElementById('tv-date');
        if (timeEl && dateEl) {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }
    };
    updateTime();
    setInterval(updateTime, 1000);

    // Event listeners
    // Make the whole card clickable for TV
    container.querySelectorAll('.w-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest && e.target.closest('.btn-start')) return; 
            if (card.classList.contains('card-blue')) navigate('/strength');
            if (card.classList.contains('card-green')) navigate('/cardio');
            if (card.classList.contains('card-purple')) navigate('/mobility');
        });
    });

    document.getElementById('btn-strength').addEventListener('click', () => navigate('/strength'));
    document.getElementById('btn-cardio').addEventListener('click', () => navigate('/cardio'));
    document.getElementById('btn-mobility').addEventListener('click', () => navigate('/mobility'));
    
    const goAdmin = () => navigate('/admin');
    document.getElementById('btn-admin-top').addEventListener('click', goAdmin);
    document.getElementById('btn-admin-bottom').addEventListener('click', goAdmin);
}
