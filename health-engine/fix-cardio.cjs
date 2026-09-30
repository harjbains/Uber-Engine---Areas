const fs = require('fs');

// Fix cardio.js
let cardioCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');
cardioCode = cardioCode.replace(
    /avg_speed_kmh:\s*state\.speed,\s*incline_percentage:\s*state\.incline,\s*completed_at:\s*new Date\(\)\.toISOString\(\)/g,
    `speed_kmh: state.speed,
                    incline_percent: state.incline,
                    performed_at: new Date().toISOString()`
);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardioCode);

// Fix history.js
let historyCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', 'utf8');
historyCode = historyCode.replace(
    /getSupabase\(\)\.from\('health_cardio_sessions'\)\.select\('completed_at'\)\.eq\('owner_id',\s*user\.user\.id\)\.gte\('completed_at',\s*startDate\.toISOString\(\)\)\.lt\('completed_at',\s*endDate\.toISOString\(\)\)/g,
    `getSupabase().from('health_cardio_sessions').select('performed_at').eq('owner_id', user.user.id).gte('performed_at', startDate.toISOString()).lt('performed_at', endDate.toISOString())`
);
historyCode = historyCode.replace(
    /const cDates = \(cData\.data \|\| \[\]\)\.map\(r => new Date\(r\.completed_at\)\.toDateString\(\)\);/g,
    `const cDates = (cData.data || []).map(r => new Date(r.performed_at).toDateString());`
);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', historyCode);

// Fix tv-home.js
let homeCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
const oldHomeFetch = `
            const fetchLatest = async (table) => {
                const { data } = await getSupabase().from(table)
                    .select('completed_at')
                    .eq('owner_id', user.user.id)
                    .order('completed_at', { ascending: false }).limit(1);
                return data && data.length > 0 ? new Date(data[0].completed_at) : null;
            };
            const [sDate, cDate, mDate] = await Promise.all([
                fetchLatest('health_strength_sessions'),
                fetchLatest('health_cardio_sessions'),
                fetchLatest('health_mobility_sessions')
            ]);
`;

const newHomeFetch = `
            const fetchLatest = async (table, dateCol = 'completed_at') => {
                const { data } = await getSupabase().from(table)
                    .select(dateCol)
                    .eq('owner_id', user.user.id)
                    .order(dateCol, { ascending: false }).limit(1);
                return data && data.length > 0 ? new Date(data[0][dateCol]) : null;
            };
            const [sDate, cDate, mDate] = await Promise.all([
                fetchLatest('health_strength_sessions', 'completed_at'),
                fetchLatest('health_cardio_sessions', 'performed_at'),
                fetchLatest('health_mobility_sessions', 'completed_at')
            ]);
`;
homeCode = homeCode.replace(oldHomeFetch.trim(), newHomeFetch.trim());
// Wait, tv-home.js might have slightly different spacing. I'll use regex.
const fetchPattern = /const fetchLatest = async \(table\) => \{[\s\S]*?fetchLatest\('health_mobility_sessions'\)\s*\]\);/m;
if (fetchPattern.test(homeCode)) {
    homeCode = homeCode.replace(fetchPattern, newHomeFetch.trim());
}
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', homeCode);
