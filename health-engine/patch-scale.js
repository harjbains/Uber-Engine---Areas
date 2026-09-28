const fs = require('fs');

let appJs = fs.readFileSync('C:\\DEV\\health-engine\\js\\app.js', 'utf8');

const scaleLogic = `
// TV Mode Canvas Scaling
function applyTVScale() {
    const path = window.location.hash.replace('#', '');
    const isTVMode = path !== '/admin'; // Apply fixed 16:9 scaling to TV views

    const container = document.getElementById('view-container');
    if (!container) return;
    
    if (isTVMode) {
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        // Scale the fixed 16:9 application canvas uniformly using the smaller of the horizontal and vertical scale factors
        const scale = Math.min(availableWidth / 1920, availableHeight / 1080);
        
        container.style.width = '1920px';
        container.style.height = '1080px';
        container.style.transformOrigin = 'center center';
        container.style.transform = \`scale(\${scale})\`;
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.marginLeft = '-960px';
        container.style.marginTop = '-540px';
        container.style.overflow = 'hidden';
        
        // Never allow vertical or horizontal scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        // Reset for Admin mode (allow normal flow/scrolling)
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.transform = 'none';
        container.style.position = 'relative';
        container.style.left = 'auto';
        container.style.top = 'auto';
        container.style.marginLeft = '0';
        container.style.marginTop = '0';
        container.style.overflow = 'visible';
        
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

// Recalculate on viewport resize and route changes
window.addEventListener('resize', applyTVScale);
window.addEventListener('hashchange', () => setTimeout(applyTVScale, 50));
window.addEventListener('DOMContentLoaded', () => setTimeout(applyTVScale, 50));
`;

if (!appJs.includes('applyTVScale')) {
    appJs += scaleLogic;
    fs.writeFileSync('C:\\DEV\\health-engine\\js\\app.js', appJs);
    console.log('Scaling logic added to app.js');
} else {
    console.log('Scaling logic already exists in app.js');
}
