const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', 'utf8');

// The line is: getSupabase().from('health_cardio_sessions').select('completed_at').eq('owner_id', user.user.id).gte('completed_at', startDate.toISOString()).lt('completed_at', endDate.toISOString()),
code = code.replace(
    /getSupabase\(\)\.from\('health_cardio_sessions'\)\.select\('completed_at'\)\.eq\('owner_id',\s*user\.user\.id\)\.gte\('completed_at',\s*startDate\.toISOString\(\)\)\.lt\('completed_at',\s*endDate\.toISOString\(\)\)/g,
    "getSupabase().from('health_cardio_sessions').select('performed_at').eq('owner_id', user.user.id).gte('performed_at', startDate.toISOString()).lt('performed_at', endDate.toISOString())"
);

// The line is: const cDates = (cData.data || []).map(r => new Date(r.completed_at).toDateString());
code = code.replace(
    /const cDates = \(cData\.data \|\| \[\]\)\.map\(r => new Date\(r\.completed_at\)\.toDateString\(\)\);/g,
    "const cDates = (cData.data || []).map(r => new Date(r.performed_at).toDateString());"
);

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\history.js', code);
