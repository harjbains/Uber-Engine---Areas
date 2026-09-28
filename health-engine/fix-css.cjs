const fs = require('fs');

let str = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
str = str.replace(/\.rail-item\.active\s*\/\* Workout Panel/g, '/* Workout Panel');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', str);

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
mob = mob.replace(/\.rail-item\.active\s*\/\* Workout Panel/g, '/* Workout Panel');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
