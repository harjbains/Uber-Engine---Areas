export function initTVEmulation() {
    window.isTVMode = true; // initially true
    
    function applyTVScaling() {
        const appRoot = document.getElementById('app-root');
        if (!window.isTVMode) {
            document.body.style.backgroundColor = '';
            appRoot.style.width = '100%';
            appRoot.style.height = '100%';
            appRoot.style.position = 'static';
            appRoot.style.top = 'auto';
            appRoot.style.left = 'auto';
            appRoot.style.transform = 'none';
            appRoot.style.boxShadow = 'none';
            return;
        }
        
        document.body.style.backgroundColor = '#000';
        appRoot.style.width = '960px';
        appRoot.style.height = '480px';
        appRoot.style.position = 'fixed';
        appRoot.style.top = '50%';
        appRoot.style.left = '50%';
        appRoot.style.transformOrigin = 'center center';
        appRoot.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.1), 0 0 50px rgba(0,0,0,0.8)';
        
        const scaleX = window.innerWidth / 960;
        const scaleY = window.innerHeight / 480;
        const scale = Math.min(scaleX, scaleY);
        appRoot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    window.toggleTVMode = function() {
        window.isTVMode = !window.isTVMode;
        applyTVScaling();
    };

    window.setTVMode = function(mode) {
        window.isTVMode = mode;
        applyTVScaling();
    };

    window.addEventListener('resize', applyTVScaling);
    // Add small delay to ensure rendering context is ready
    setTimeout(applyTVScaling, 50);
}
