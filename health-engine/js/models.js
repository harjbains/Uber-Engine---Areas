/**
 * @typedef {Object} HealthSettings
 * @property {string} owner_id - UUID of the owner
 * @property {number} weekly_strength_goal - Weekly target (default 3)
 * @property {number} weekly_cardio_goal - Weekly target (default 3)
 * @property {number} weekly_mobility_goal - Weekly target (default 3)
 * @property {boolean} sound_enabled
 * @property {boolean} celebrations_enabled
 * @property {string} weight_unit - 'kg'
 * @property {string} distance_unit - 'km'
 */

/**
 * @typedef {Object} HealthStrengthExercise
 * @property {string} id - UUID
 * @property {string} owner_id - UUID
 * @property {string} name
 * @property {number} display_order
 * @property {number} sets
 * @property {number} min_reps
 * @property {number} max_reps
 * @property {number} current_weight_kg
 * @property {number} progression_increment_kg
 * @property {number} rest_seconds
 * @property {string|null} image_path - Reference to asset manifest
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} HealthCardioSettings
 * @property {string} owner_id - UUID
 * @property {number} default_duration_minutes
 * @property {number} default_speed_kmh
 * @property {number} default_incline
 */

/**
 * @typedef {Object} HealthMobilityExercise
 * @property {string} id - UUID
 * @property {string} owner_id - UUID
 * @property {string} name
 * @property {string} measurement_type - 'TIME' or 'REPS'
 * @property {number} target_value
 * @property {number} sets
 * @property {number} rest_seconds
 * @property {boolean} per_side
 * @property {number} display_order
 * @property {string|null} image_path
 * @property {boolean} is_active
 */

export {}; // Make this file a module
