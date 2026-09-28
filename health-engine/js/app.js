import { initDiagnostics } from './diagnostics.js?v=2.24';
import { initTVEmulation } from './tv-emu.js?v=2.4';
import { initSupabase, getSupabase } from './supabase.js';
import { setupRouting } from './router.js';

// Initialize Application
async function initApp() {
    showLoading(true);
    try {
        await initSupabase();
        
        // Check for existing session
        const { data: { session }, error } = await getSupabase().auth.getSession();
        
        if (error) throw error;
        
        if (session) {
            // Already authenticated
            showLoading(false);
            setupRouting();
            initTVEmulation();
            initDiagnostics();
        } else {
            // Need authentication
            showLoading(false);
            showAuth(true);
        }
        
    } catch (err) {
        showLoading(false);
        showError("Failed to initialize Health Engine: " + err.message);
    }
}

// Authentication Handlers
document.getElementById('btn-signin').addEventListener('click', async () => handleAuth('signInWithPassword'));
document.getElementById('btn-signup').addEventListener('click', async () => handleAuth('signUp'));

async function handleAuth(method) {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    
    if (!email || !password) {
        errorEl.textContent = "Email and password are required.";
        errorEl.style.display = 'block';
        return;
    }
    
    errorEl.style.display = 'none';
    const oldText = document.getElementById(method === 'signUp' ? 'btn-signup' : 'btn-signin').textContent;
    document.getElementById(method === 'signUp' ? 'btn-signup' : 'btn-signin').textContent = '...';
    
    try {
        const { data, error } = await getSupabase().auth[method]({ email, password });
        
        if (error) throw error;
        
        if (data.session) {
            showAuth(false);
            setupRouting();
        } else {
            errorEl.textContent = "Check your email to confirm registration.";
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    } finally {
        document.getElementById(method === 'signUp' ? 'btn-signup' : 'btn-signin').textContent = oldText;
    }
}

// UI State Management
function showLoading(show) {
    const el = document.getElementById('loading-state');
    if (show) el.classList.remove('hidden');
    else el.classList.add('hidden');
}

function showAuth(show) {
    const el = document.getElementById('auth-state');
    if (show) el.classList.remove('hidden');
    else el.classList.add('hidden');
}

function showError(msg) {
    const el = document.getElementById('error-state');
    const msgEl = document.getElementById('error-message');
    msgEl.textContent = msg;
    el.classList.remove('hidden');
}

document.getElementById('error-retry').addEventListener('click', () => {
    document.getElementById('error-state').classList.add('hidden');
    initApp();
});

// Boot
window.addEventListener('DOMContentLoaded', initApp);

// Global polyfill for TV remotes (Firestick/Silk)
// Maps Enter/Select on any focused element to a direct click event
document.addEventListener('keydown', (e) => {
    // Firestick select button usually maps to Enter (keyCode 13)
    if (e.key === 'Enter' || e.keyCode === 13 || e.key === ' ') {
        const el = document.activeElement;
        if (el && typeof el.click === 'function') {
            e.preventDefault();
            el.click();
        }
    }
});

