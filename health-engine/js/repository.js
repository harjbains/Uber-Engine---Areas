import { getSupabase } from './supabase.js';

// Ensure we only query health_* tables to comply with Stage 1 rule:
// "Health Engine code does not access uber_* data."

export const SettingsRepo = {
    async getSettings() {
        const { data, error } = await getSupabase()
            .from('health_settings')
            .select('*')
            .single();
        if (error) throw error;
        return data;
    },
    
    async updateSettings(updates) {
        const { data, error } = await getSupabase()
            .from('health_settings')
            .update(updates)
            .eq('owner_id', (await getSupabase().auth.getUser()).data.user?.id);
        if (error) throw error;
        return data;
    }
};

export const StrengthRepo = {
    async getActiveExercises() {
        const { data, error } = await getSupabase()
            .from('health_strength_exercises')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    }
};

export const CardioRepo = {
    async getSettings() {
        const { data, error } = await getSupabase()
            .from('health_cardio_settings')
            .select('*')
            .single();
        if (error) throw error;
        return data;
    }
};

export const MobilityRepo = {
    async getActiveExercises() {
        const { data, error } = await getSupabase()
            .from('health_mobility_exercises')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    }
};
