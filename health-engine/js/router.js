import { renderTvHome } from './views/tv-home.js?v=2.39';
import { renderAdmin } from './views/admin.js?v=2.39';
import { renderStrength } from './views/strength.js?v=2.39';
import { renderCardio } from './views/cardio.js?v=2.39';
import { renderMobility } from './views/mobility.js?v=2.39';

const routes = {
    '/': renderTvHome,
    '/tv': renderTvHome,
    '/admin': renderAdmin,
    '/strength': renderStrength,
    '/cardio': renderCardio,
    '/mobility': renderMobility,
};

export function setupRouting() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange(); // Initial route
}

export function navigate(path) {
    window.location.hash = path;
}

function handleRouteChange() {
    let path = window.location.hash.replace('#', '');
    if (!path) path = '/';
    
    const container = document.getElementById('view-container');
    container.innerHTML = ''; // Clear current view
    
    const renderFn = routes[path];
    if (renderFn) {
        renderFn(container);
    } else {
        renderPlaceholder('404 - Not Found')(container);
    }
}

function renderPlaceholder(title) {
    return (container) => {
        container.innerHTML = `
            <div class="tv-mode" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <h1>${title}</h1>
                <p>Development Placeholder. Stage not yet implemented.</p>
                <div style="margin-top: 20px;">
                    <button class="btn" onclick="window.location.hash='/tv'">TV Home</button>
                    <button class="btn" onclick="window.location.hash='/admin'">PC Admin</button>
                </div>
            </div>
        `;
    };
}
