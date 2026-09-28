const fs = require('fs');
const version = 'v1.1';
const versionTag = ` <span style="font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;">${version}</span>`;

const files = [
    'C:\\DEV\\health-engine\\js\\views\\tv-home.js',
    'C:\\DEV\\health-engine\\js\\views\\strength.js',
    'C:\\DEV\\health-engine\\js\\views\\cardio.js',
    'C:\\DEV\\health-engine\\js\\views\\mobility.js',
    'C:\\DEV\\health-engine\\js\\views\\admin.js'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace ENGINE</span> with ENGINE</span> + versionTag
    // To avoid duplicating, first strip out any existing version tags if they exist (for future safety)
    code = code.replace(/ <span style="font-size: 0\.4em;[^>]*>v[0-9.]+<\/span>/g, '');
    
    // tv-home.js format: <span style="color: #2196F3;">ENGINE</span>
    // cardio/strength format: <span class="text-xxx">ENGINE</span>
    code = code.replace(/(>ENGINE<\/span>)/g, `$1${versionTag}`);
    
    fs.writeFileSync(file, code);
    console.log(`Updated version in ${file}`);
});
