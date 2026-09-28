const fs = require('fs');

const flexPatch = `
            /* Flex layout fix for mobility buttons */
            .wp-bottom-right {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px !important;
            }
            .set-indicator, #active-timer {
                width: 100% !important;
                flex-shrink: 0;
            }
            .btn-complete {
                flex: 1 !important;
                min-width: 120px !important;
                margin: 0 !important;
            }
`;

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
if (!mob.includes('Flex layout fix for mobility buttons')) {
    mob = mob.replace('</style>', flexPatch + '</style>');
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
}
