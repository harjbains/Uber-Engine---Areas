const fs = require('fs');

let strengthCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
strengthCode = strengthCode.replace(
    /const \{ data: session, error: sErr \} = await getSupabase\(\)\.from\('health_strength_sessions'\)\.insert\(\{[\s\S]*?status: 'completed'[\s\S]*?\}\)\.select\(\)\.single\(\);/,
    `const completedDate = new Date();
        const startedDate = new Date(completedDate.getTime() - (duration * 1000));
        
        const { data: session, error: sErr } = await getSupabase().from('health_strength_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            started_at: startedDate.toISOString(),
            completed_at: completedDate.toISOString(),
            status: 'completed'
        }).select().single();`
);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', strengthCode);


let mobilityCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
mobilityCode = mobilityCode.replace(
    /const \{ data: session, error: sErr \} = await getSupabase\(\)\.from\('health_mobility_sessions'\)\.insert\(\{[\s\S]*?status: 'completed'[\s\S]*?\}\)\.select\(\)\.single\(\);/,
    `const completedDate = new Date();
        const startedDate = new Date(completedDate.getTime() - (duration * 1000));
        
        const { data: session, error: sErr } = await getSupabase().from('health_mobility_sessions').insert({
            owner_id: user.user.id,
            started_at: startedDate.toISOString(),
            completed_at: completedDate.toISOString(),
            status: 'completed'
        }).select().single();`
);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobilityCode);
