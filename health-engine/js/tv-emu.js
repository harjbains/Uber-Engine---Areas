export function initTVEmulation() {
    const appRoot = document.getElementById('app-root');
    
    document.body.style.backgroundColor = '#000';
    
    appRoot.style.width = '960px';
    appRoot.style.height = '480px';
    appRoot.style.position = 'fixed';
    appRoot.style.top = '50%';
    appRoot.style.left = '50%';
    appRoot.style.transformOrigin = 'center center';
    appRoot.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.1), 0 0 50px rgba(0,0,0,0.8)';
    
    function updateEmuScale() {
        const scaleX = window.innerWidth / 960;
        const scaleY = window.innerHeight / 480;
        const scale = Math.min(scaleX, scaleY);
        appRoot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    window.addEventListener('resize', updateEmuScale);
    updateEmuScale();
}
