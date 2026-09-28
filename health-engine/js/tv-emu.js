export function initTVEmulation() {
    const btnEnter = document.createElement('button');
    btnEnter.innerText = 'TV EMULATION';
    btnEnter.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 999999; background: #e63946; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: "Segoe UI", sans-serif; transition: 0.2s;';
    
    const btnExit = document.createElement('button');
    btnExit.innerText = 'EXIT TV EMULATION';
    btnExit.style.cssText = 'display: none; position: fixed; top: 10px; left: 10px; z-index: 999999; background: #333; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: "Segoe UI", sans-serif; transition: 0.2s;';

    document.body.appendChild(btnEnter);
    document.body.appendChild(btnExit);

    const appRoot = document.getElementById('app-root');
    let isEmuMode = false;
    
    const originalBodyBg = document.body.style.backgroundColor;

    function updateEmuScale() {
        if (!isEmuMode) return;
        const scaleX = window.innerWidth / 1920;
        const scaleY = window.innerHeight / 1080;
        const scale = Math.min(scaleX, scaleY);
        // Shrink slightly to leave a tiny bit of breathing room if strictly requested? 
        // No, prompt says: "Scale the complete 1920x1080 viewport proportionally so that it fits inside the PC browser window."
        appRoot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    btnEnter.addEventListener('click', () => {
        isEmuMode = true;
        btnEnter.style.display = 'none';
        btnExit.style.display = 'block';
        
        document.body.style.backgroundColor = '#000';
        
        appRoot.style.width = '1920px';
        appRoot.style.height = '1080px';
        appRoot.style.position = 'fixed';
        appRoot.style.top = '50%';
        appRoot.style.left = '50%';
        appRoot.style.transformOrigin = 'center center';
        // Add a subtle border or glow to strictly delineate the 1920x1080 canvas
        appRoot.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.1), 0 0 50px rgba(0,0,0,0.8)';
        
        updateEmuScale();
        window.addEventListener('resize', updateEmuScale);
    });

    btnExit.addEventListener('click', () => {
        isEmuMode = false;
        btnExit.style.display = 'none';
        btnEnter.style.display = 'block';
        
        document.body.style.backgroundColor = originalBodyBg;
        
        appRoot.style.width = '';
        appRoot.style.height = '';
        appRoot.style.position = '';
        appRoot.style.top = '';
        appRoot.style.left = '';
        appRoot.style.transform = '';
        appRoot.style.transformOrigin = '';
        appRoot.style.boxShadow = '';
        
        window.removeEventListener('resize', updateEmuScale);
    });
}
