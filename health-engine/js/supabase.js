// Initialize Supabase Client
// Connects to the existing Map Engine Supabase project statically

const SUPABASE_URL = "https://doaokmhdfwdwtkwxxksx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r_oYKrDrzU-BGgNIerSu9w_DSLnSTLJ";

let supabaseClient = null;

export async function initSupabase() {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        console.log("Supabase client initialized for Health Engine");
        return true;
    }
    
    throw new Error("Supabase library not loaded");
}

export function getSupabase() {
    if (!supabaseClient) {
        console.warn("Supabase client accessed before initialization");
    }
    return supabaseClient;
}
