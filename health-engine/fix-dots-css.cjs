const fs = require('fs');
let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
const override = `
            /* Override dots for mobility */
            .dots-row { flex-wrap: wrap !important; gap: 6px !important; justify-content: center; }
            .dot-col { gap: 4px !important; }
            .dot { width: 12px !important; height: 12px !important; }
            .dot-num { font-size: 0.75rem !important; }
`;
mob = mob.replace('</style>', override + '</style>');
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
