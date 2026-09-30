const fs = require('fs');

// PATCH STRENGTH.JS
let strengthCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');

const oldStrengthInsert = `const { data: session, error: sErr } = await getSupabase().from('health_strength_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            completed_at: new Date().toISOString(),
            status: 'completed'
        }).select().single();`;

const newStrengthInsert = `
        const completedDate = new Date();
        const startedDate = new Date(completedDate.getTime() - (duration * 1000));
        
        const { data: session, error: sErr } = await getSupabase().from('health_strength_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            started_at: startedDate.toISOString(),
            completed_at: completedDate.toISOString(),
            status: 'completed'
        }).select().single();`;

strengthCode = strengthCode.replace(oldStrengthInsert, newStrengthInsert.trim());
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', strengthCode);


// PATCH MOBILITY.JS
let mobilityCode = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const oldMobilityInsert = `const { data: session, error: sErr } = await getSupabase().from('health_mobility_sessions').insert({
            owner_id: user.user.id,
            elapsed_seconds: duration,
            completed_at: new Date().toISOString(),
            status: 'completed'
        }).select().single();`;

const newMobilityInsert = `
        const completedDate = new Date();
        const startedDate = new Date(completedDate.getTime() - (duration * 1000));
        
        const { data: session, error: sErr } = await getSupabase().from('health_mobility_sessions').insert({
            owner_id: user.user.id,
            started_at: startedDate.toISOString(),
            completed_at: completedDate.toISOString(),
            status: 'completed'
        }).select().single();`;

mobilityCode = mobilityCode.replace(oldMobilityInsert, newMobilityInsert.trim());
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobilityCode);
