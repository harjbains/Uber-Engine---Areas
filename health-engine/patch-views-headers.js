const fs = require('fs');

function getNewHeader(icon, brandColor, brandText, title, sub, isHome = false) {
    const iconDumbbell = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>`;
    const iconGear = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;

    let centerHtml = '';
    let rightHtml = '';

    if (isHome) {
        centerHtml = '';
        rightHtml = `
        <div class="datetime" style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.1;">
            <div class="date-text" id="tv-date" style="font-size: 0.9rem; color: #8892a0;">Sat, 26 Sept 2026</div>
            <div class="time-text" id="tv-time" style="font-size: 1.6rem; font-weight: bold; color: white;">--:--</div>
        </div>
        <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.2);"></div>
        <button id="btn-admin-top" style="background: transparent; border: none; color: #8892a0; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;">
            ${iconGear}
            <span style="font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase;">Settings</span>
        </button>
        `;
    } else {
        centerHtml = `
        <button class="tv-nav-home" id="btn-${isHome === 'mob' ? 'top-home' : 'home'}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            Home
        </button>
        `;
        rightHtml = `
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div class="tv-right-title">${title}</div>
            <div class="tv-right-sub">${sub}</div>
        </div>
        `;
    }

    return `
    <header class="tv-header">
        <div class="tv-header-left">
            <div class="tv-brand-icon" style="color: ${brandColor};">${icon}</div>
            <div style="display: flex; flex-direction: column;">
                <div class="tv-brand-title">${brandText}</div>
                <div class="tv-brand-sub">STRONGER &middot; FITTER &middot; HEALTHIER</div>
            </div>
        </div>
        <div class="tv-header-center">
            ${centerHtml}
        </div>
        <div class="tv-header-right">
            ${rightHtml}
        </div>
    </header>
    `;
}

// 1. HOME
let home = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', 'utf8');
const iconDumbbell = "${iconDumbbell}";
const homeHeader = getNewHeader(iconDumbbell, "#2196F3", "HEALTH <span style=\"color: #2196F3;\">ENGINE</span> <span style=\"font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;\">v2.54</span>", "", "", true);
home = home.replace(/<!-- Header -->\s*<div class="header tv-header">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Cards -->/, "<!-- Header -->\n" + homeHeader + "\n<!-- Cards -->");
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\tv-home.js', home);

// 2. STRENGTH
let strength = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', 'utf8');
const strengthHeader = getNewHeader(iconDumbbell, "#2196F3", "FITNESS <span style=\"color: #2196F3;\">ENGINE</span> <span style=\"font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;\">v2.54</span>", "STRENGTH WORKOUT", "Exercise ${state.currentIndex + 1} of ${state.exercises.length}", false);
strength = strength.replace(/<header class="top-bar tv-header">[\s\S]*?<\/header>/, strengthHeader);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\strength.js', strength);

// 3. CARDIO
let cardio = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', 'utf8');
const cardioHeader = getNewHeader("${iconRun}", "#66bb6a", "FITNESS <span style=\"color: #66bb6a;\">ENGINE</span> <span style=\"font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;\">v2.54</span>", "CARDIO WORKOUT", "Treadmill (Manual Entry)", false);
cardio = cardio.replace(/<header class="top-bar tv-header">[\s\S]*?<\/header>/, cardioHeader);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\cardio.js', cardio);

// 4. MOBILITY
let mobility = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');
const mobilityHeader = getNewHeader("${iconMobility}", "#8a2be2", "FITNESS <span style=\"color: #8a2be2;\">ENGINE</span> <span style=\"font-size: 0.4em; color: #8892a0; margin-left: 8px; vertical-align: middle;\">v2.54</span>", "MOBILITY WORKFLOW", "Exercise ${state.currentIndex + 1} of ${state.exercises.length}", 'mob');
mobility = mobility.replace(/<header class="top-bar tv-header">[\s\S]*?<\/header>/, mobilityHeader);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mobility);

console.log('Headers patched successfully');
