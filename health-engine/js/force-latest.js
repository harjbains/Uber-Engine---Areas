export function initForceLatest() {
    const btn = document.createElement('button');
    btn.innerText = 'FORCE LATEST';
    btn.style.cssText = 'position: fixed; top: 160px; right: 10px; z-index: 999999; background: #FF9800; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: "Segoe UI", sans-serif; transition: 0.2s;';

    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('click', () => {
        const url = new URL(window.location.href);
        url.searchParams.set('refresh', Date.now());
        window.location.href = url.toString();
    });

    document.body.appendChild(btn);
}
