import { navigate } from '../router.js';
import { getSupabase } from '../supabase.js';

let currentDate = new Date(); // Start with current month

export async function renderHistory(container) {
    const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 4h2v16H6zm12 0h2v16h-2zM2 8h2v8H2zm18 0h2v8h-2zM8 11h8v2H8z"/></svg>`;
    const iconBack = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>`;
    const iconLeft = `<svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>`;
    const iconRight = `<svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
    
    container.innerHTML = `
        <div class="app-container tv-shell" style="background: #0b101e; display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- Header -->
            <header class="tv-header">
                <div class="tv-header-left">
                    <div class="tv-brand-icon" style="color: #2196F3;">${iconDumbbell}</div>
                    <div style="display: flex; flex-direction: column;">
                        <div class="tv-brand-title">FITNESS <span style="color: #2196F3;">ENGINE</span> <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">v2.57</span></div>
                        <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
                    </div>
                </div>
                <div class="tv-header-center">
                    <button class="tv-nav-home" id="btn-home">
                        ${iconBack}
                        Home
                    </button>
                </div>
                <div class="tv-header-right">
                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div class="tv-right-title">HISTORY</div>
                        <div class="tv-right-sub" id="history-month-sub">Loading...</div>
                    </div>
                </div>
            </header>
            
            <!-- Main Content -->
            <main class="main-content tv-main" style="flex: 1; display: flex; flex-direction: column; padding: 5px 40px; box-sizing: border-box; min-height: 0;">
                
                <!-- Month Navigation -->
                <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 5px; flex-shrink: 0;">
                    <button id="btn-prev-month" class="hist-nav-btn">${iconLeft}</button>
                    <h2 id="month-title" style="font-size: 1.5rem; margin: 0; min-width: 320px; text-align: center; color: white; letter-spacing: 2px;">SEPTEMBER 2026</h2>
                    <button id="btn-next-month" class="hist-nav-btn">${iconRight}</button>
                </div>
                
                <!-- Calendar Grid -->
                <div id="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); grid-template-rows: auto repeat(6, 1fr); gap: 4px; flex: 1; min-height: 0;">
                    <!-- Headers -->
                    <div class="cal-day-header">MON</div>
                    <div class="cal-day-header">TUE</div>
                    <div class="cal-day-header">WED</div>
                    <div class="cal-day-header">THU</div>
                    <div class="cal-day-header">FRI</div>
                    <div class="cal-day-header">SAT</div>
                    <div class="cal-day-header">SUN</div>
                    <!-- Days injected here -->
                </div>
                
                <!-- Summary Strip -->
                <div class="hist-summary" style="display: flex; justify-content: space-around; align-items: center; margin-top: 5px; background: rgba(255,255,255,0.03); padding: 6px 20px; border-radius: 12px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05);">
                    <div class="sum-item">STRENGTH <span id="sum-strength" style="color: #4bacff; font-weight: bold; margin-left: 10px;">0</span></div>
                    <div class="sum-item">CARDIO <span id="sum-cardio" style="color: #66ff66; font-weight: bold; margin-left: 10px;">0</span></div>
                    <div class="sum-item">MOBILITY <span id="sum-mobility" style="color: #d18cff; font-weight: bold; margin-left: 10px;">0</span></div>
                    <div class="sum-item">TOTAL <span id="sum-total" style="color: white; font-weight: bold; margin-left: 10px;">0</span></div>
                </div>
                
            </main>
        </div>
        
        <style>
            .hist-nav-btn {
                background: transparent;
                border: none;
                color: #8892a0;
                cursor: pointer;
                transition: color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px;
                outline: none;
            }
            .hist-nav-btn:hover, .hist-nav-btn:focus { color: white; transform: scale(1.1); }
            
            .cal-day-header {
                font-size: 0.9rem;
                color: #8892a0;
                text-align: center;
                font-weight: bold;
                padding-bottom: 4px;
                letter-spacing: 2px;
            }
            
            .cal-cell {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.02);
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.05);
                transition: transform 0.2s;
            }
            .cal-cell.today {
                border: 2px solid rgba(255,255,255,0.3);
                box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
            }
            .cal-cell.out-of-month {
                opacity: 0.3;
            }
            
            .cal-date {
                font-size: 1.15rem;
                font-weight: bold;
                color: white;
                margin-bottom: 2px;
            }
            
            .cal-dots {
                display: flex;
                gap: 6px;
            }
            
            .cal-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.1);
            }
            .cal-dot.s.active { background-color: #4bacff; border-color: #4bacff; box-shadow: 0 0 10px rgba(75,172,255,0.4); }
            .cal-dot.c.active { background-color: #66ff66; border-color: #66ff66; box-shadow: 0 0 10px rgba(102,255,102,0.4); }
            .cal-dot.m.active { background-color: #d18cff; border-color: #d18cff; box-shadow: 0 0 10px rgba(209,140,255,0.4); }
            
            .sum-item {
                font-size: 1rem;
                color: #8892a0;
                letter-spacing: 1px;
                display: flex;
                align-items: baseline;
            }
        </style>
    `;
    
    document.getElementById('btn-home').addEventListener('click', () => navigate('/tv'));
    document.getElementById('btn-prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('btn-next-month').addEventListener('click', () => changeMonth(1));
    
    await loadCalendarData();

    async function loadCalendarData() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-11
        
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        document.getElementById('month-title').textContent = `${monthNames[month]} ${year}`;
        document.getElementById('history-month-sub').textContent = `${monthNames[month]} ${year}`;
        
        // Find exactly the date range we need to display (including padding days from prev/next months)
        const firstDayOfMonth = new Date(year, month, 1);
        let startDay = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon
        if (startDay === 0) startDay = 7;
        startDay--; // Now 0=Mon, 6=Sun
        
        const startDate = new Date(year, month, 1 - startDay);
        // We always display 6 weeks (42 days) so the grid doesn't resize
        const endDate = new Date(year, month, 1 - startDay + 42);
        
        // Fetch data
        const { data: user } = await getSupabase().auth.getUser();
        if (!user.user) return;
        
        const [sData, cData, mData] = await Promise.all([
            getSupabase().from('health_strength_sessions').select('completed_at').eq('owner_id', user.user.id).gte('completed_at', startDate.toISOString()).lt('completed_at', endDate.toISOString()),
            getSupabase().from('health_cardio_sessions').select('completed_at').eq('owner_id', user.user.id).gte('completed_at', startDate.toISOString()).lt('completed_at', endDate.toISOString()),
            getSupabase().from('health_mobility_sessions').select('completed_at').eq('owner_id', user.user.id).gte('completed_at', startDate.toISOString()).lt('completed_at', endDate.toISOString())
        ]);
        
        const sDates = (sData.data || []).map(r => new Date(r.completed_at).toDateString());
        const cDates = (cData.data || []).map(r => new Date(r.completed_at).toDateString());
        const mDates = (mData.data || []).map(r => new Date(r.completed_at).toDateString());
        
        let sumS = 0, sumC = 0, sumM = 0;
        
        const grid = document.getElementById('calendar-grid');
        // Remove existing days
        const headers = Array.from(grid.querySelectorAll('.cal-day-header'));
        grid.innerHTML = '';
        headers.forEach(h => grid.appendChild(h));
        
        const todayStr = new Date().toDateString();
        
        let currentIterDate = new Date(startDate);
        currentIterDate.setHours(12, 0, 0, 0);
        for (let i = 0; i < 42; i++) {
            const dateStr = currentIterDate.toDateString();
            const isCurrentMonth = currentIterDate.getMonth() === month;
            const isToday = dateStr === todayStr;
            
            const hasS = sDates.includes(dateStr);
            const hasC = cDates.includes(dateStr);
            const hasM = mDates.includes(dateStr);
            
            if (isCurrentMonth) {
                if (hasS) sumS++;
                if (hasC) sumC++;
                if (hasM) sumM++;
            }
            
            const cell = document.createElement('div');
            cell.className = `cal-cell ${isCurrentMonth ? '' : 'out-of-month'} ${isToday ? 'today' : ''}`;
            
            cell.innerHTML = `
                <div class="cal-date">${currentIterDate.getDate()}</div>
                <div class="cal-dots">
                    <div class="cal-dot s ${hasS ? 'active' : ''}"></div>
                    <div class="cal-dot c ${hasC ? 'active' : ''}"></div>
                    <div class="cal-dot m ${hasM ? 'active' : ''}"></div>
                </div>
            `;
            
            grid.appendChild(cell);
            
            currentIterDate.setDate(currentIterDate.getDate() + 1);
        }
        
        document.getElementById('sum-strength').textContent = sumS;
        document.getElementById('sum-cardio').textContent = sumC;
        document.getElementById('sum-mobility').textContent = sumM;
        document.getElementById('sum-total').textContent = sumS + sumC + sumM;
    }
    
    function changeMonth(delta) {
        currentDate.setMonth(currentDate.getMonth() + delta);
        loadCalendarData();
    }
}
