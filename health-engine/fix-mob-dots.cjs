const fs = require('fs');

let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

// 1. Fix the "lose the time icon on start button"
mob = mob.replace(/\$\{iconClock\} START/g, 'START');
mob = mob.replace(/\$\{iconClock\} RESUME/g, 'RESUME');
mob = mob.replace(/\$\{iconClock\} PAUSE/g, 'PAUSE');

// 2. Fix the dots row HTML
const searchDotsHTML = `<div class="bb-dots">
                    \${state.exercises.map((e, idx) => \`
                        <div class="bb-dot-col">
                            <div class="bb-dot \${idx < state.currentIndex ? 'completed' : idx === state.currentIndex ? 'active' : ''} \${idx === state.currentIndex ? 'sb-item' : ''}"></div>
                            <div class="bb-dot-num">\${idx + 1}</div>
                        </div>
                    \`).join('')}
                </div>`;

const replaceDotsHTML = `<div class="dots-row">
                    \${state.exercises.map((e, idx) => \`
                        <div class="dot-col">
                            <div class="dot \${idx <= state.currentIndex ? 'active' : ''}"></div>
                            <div class="dot-num \${idx <= state.currentIndex ? 'hl' : ''}">\${idx + 1}</div>
                        </div>
                    \`).join('')}
                </div>`;

// Note: there are two instances of the HTML (Active and Rest/Feedback)
mob = mob.split(searchDotsHTML).join(replaceDotsHTML);

// Also look for slightly different indentation in case it missed:
const regexDotsHTML = /<div class="bb-dots">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="bb-time">/;
// We'll just inject the CSS and if the replace above missed, we can fallback.

// 3. Inject CSS for dots
const dotsCSS = `
            .dots-row {
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
            }
            .dot-col {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            .dot {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 2px solid #556070;
            }
            .dot.active {
                background-color: #8a2be2;
                border-color: #8a2be2;
            }
            .dot-num {
                font-size: 0.75rem;
                color: #556070;
                font-weight: 700;
            }
            .dot-num.hl {
                color: white;
            }
`;

if (!mob.includes('.dots-row {')) {
    mob = mob.replace('</style>', dotsCSS + '</style>');
}

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
