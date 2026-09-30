const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');

const newHomeFetch = `            const fetchLatest = async (table, dateCol = 'completed_at') => {
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
            ]);`;

code = code.replace(/const fetchLatest = async \(table\) => \{[\s\S]*?fetchLatest\('health_mobility_sessions'\)\s*\]\);/, newHomeFetch);

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', code);
