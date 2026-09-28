export function initDiagnostics() {
    const btnOpen = document.createElement('button');
    btnOpen.innerText = 'TV DIAGNOSTICS';
    btnOpen.style.cssText = 'position: fixed; top: 100px; right: 10px; z-index: 999999; background: #2196F3; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: "Segoe UI", sans-serif; transition: 0.2s;';
    document.body.appendChild(btnOpen);

    const panel = document.createElement('div');
    panel.id = 'tv-diagnostics-panel';
    panel.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh; background: rgba(0, 0, 0, 0.95); z-index: 9999999; color: #0f0; font-family: monospace; overflow-y: auto; padding: 40px; box-sizing: border-box; flex-direction: column;';
    document.body.appendChild(panel);

    function getEmulationMode() {
        const root = document.getElementById('app-root');
        if (!root) return 'UNKNOWN';
        return root.style.width === '960px' ? 'ON' : 'OFF';
    }

    function renderData() {
        const vv = window.visualViewport || {};
        const ar = (window.innerWidth / window.innerHeight).toFixed(3);
        
        let orient = 'unknown';
        if (screen.orientation && screen.orientation.type) {
            orient = screen.orientation.type;
        } else if (typeof window.orientation !== 'undefined') {
            orient = window.orientation;
        }

        const route = window.location.hash || '/';
        const emuOn = getEmulationMode();

        panel.innerHTML = `
            <h2 style="color: white; margin-top: 0; font-family: sans-serif; font-size: 2.5rem;">SILK / FIRE TV DIAGNOSTICS</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <table style="width: 100%; font-size: 1.8rem; line-height: 1.8; text-align: left; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="width: 50%; padding-bottom: 8px;">window.innerWidth / .innerHeight</td>
                        <td style="color: #fff; padding-bottom: 8px;">${window.innerWidth} / ${window.innerHeight}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">window.outerWidth / .outerHeight</td>
                        <td style="color: #fff; padding: 8px 0;">${window.outerWidth} / ${window.outerHeight}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">window.devicePixelRatio</td>
                        <td style="color: #fff; padding: 8px 0;">${window.devicePixelRatio}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">screen.width / .height</td>
                        <td style="color: #fff; padding: 8px 0;">${screen.width} / ${screen.height}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">screen.availWidth / .availHeight</td>
                        <td style="color: #fff; padding: 8px 0;">${screen.availWidth} / ${screen.availHeight}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">visualViewport.width / .height</td>
                        <td style="color: #fff; padding: 8px 0;">${vv.width || 'N/A'} / ${vv.height || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">visualViewport.scale</td>
                        <td style="color: #fff; padding: 8px 0;">${vv.scale || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">document.documentElement.clientW/H</td>
                        <td style="color: #fff; padding: 8px 0;">${document.documentElement.clientWidth} / ${document.documentElement.clientHeight}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0;">Orientation / Aspect Ratio</td>
                        <td style="color: #fff; padding: 8px 0;">${orient} / ${ar}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <td style="padding: 8px 0; color: #ffeb3b;">CURRENT ROUTE</td>
                        <td style="color: #ffeb3b; padding: 8px 0;">${route}</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 8px; color: #ffeb3b;">CURRENT TV EMULATION MODE</td>
                        <td style="color: #ffeb3b; padding-top: 8px;">${emuOn}</td>
                    </tr>
                </table>
            </div>
            
            <div style="font-size: 1.4rem; color: #aaa; word-break: break-all; margin-bottom: 40px; font-family: sans-serif;">
                <strong style="color: white;">User Agent:</strong><br>${navigator.userAgent}
            </div>
            
            <div style="display: flex; gap: 30px; margin-top: auto;">
                <button id="btn-diag-refresh" style="background: #4CAF50; color: white; padding: 25px 50px; font-size: 2rem; font-weight: bold; border-radius: 12px; border: none; cursor: pointer; flex: 1;">REFRESH VALUES</button>
                <button id="btn-diag-close" style="background: #e63946; color: white; padding: 25px 50px; font-size: 2rem; font-weight: bold; border-radius: 12px; border: none; cursor: pointer; flex: 1;">CLOSE</button>
            </div>
        `;

        document.getElementById('btn-diag-refresh').addEventListener('click', renderData);
        document.getElementById('btn-diag-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    btnOpen.addEventListener('click', () => {
        panel.style.display = 'flex';
        renderData();
    });
}
