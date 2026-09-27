// Asset resolver based on Health-Engine-ASSET-MANIFEST.md

const ASSET_ROOT = 'assets/health-engine/';

const CANONICAL_MAP = {
    'Squat': 'strength/squat.webp',
    'Bench Press': 'strength/bench-press.webp',
    'Seated Shoulder Press': 'strength/seated-shoulder-press.webp',
    'Barbell Row': 'strength/barbell-row.webp',
    'EZ Bar Bicep Curl': 'strength/ez-bar-bicep-curl.webp',
    'Deadlift': 'strength/deadlift.webp',
    'Treadmill': 'cardio/treadmill.webp',
    'Standing Calf Stretch': 'mobility/standing-calf-stretch.webp',
    'Ankle Dorsiflexion': 'mobility/ankle-dorsiflexion.webp',
    'Hamstring Stretch': 'mobility/hamstring-stretch.webp',
    'Hip Flexor Stretch': 'mobility/hip-flexor-stretch.webp',
    'Figure-4 Glute Stretch': 'mobility/figure-4-glute.webp',
    'Adductor Stretch': 'mobility/adductor-stretch.webp',
    'Supported Deep-Squat Hold': 'mobility/supported-deep-squat.webp',
    'Sit-to-Stand': 'mobility/sit-to-stand.webp',
    'Supported Single-Leg Balance': 'mobility/single-leg-balance.webp',
    'Heel-to-Toe Walk': 'mobility/heel-to-toe-walk.webp',
    'Standing Hip Circles': 'mobility/standing-hip-circles.webp',
    'Thoracic Rotations': 'mobility/thoracic-rotations.webp',
    'Cat-Cow': 'mobility/cat-cow.webp',
    'Wall Shoulder Slides': 'mobility/wall-shoulder-slides.webp',
    'Doorway Chest Stretch': 'mobility/doorway-chest-stretch.webp'
};

export function resolveAssetPath(assetPath, fallbackName) {
    let resolvedPath = assetPath;
    
    // Auto-resolve known missing DB fields to their manifest paths
    if (!resolvedPath && fallbackName) {
        resolvedPath = CANONICAL_MAP[fallbackName];
    }
    
    if (!resolvedPath) {
        return generatePlaceholder('Missing Asset Path');
    }
    
    // Normalize path by stripping any root prefixes if they were saved in the DB
    resolvedPath = resolvedPath.replace(/^\/?(public\/)?assets\/health-engine\//i, '');
    
    // Resolve relative to index.html to support GitHub Pages hosting
    return `${ASSET_ROOT}${resolvedPath}`;
}

export function generatePlaceholder(title) {
    // Generate a simple data URI placeholder for missing assets
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 400, 300);
    
    ctx.fillStyle = '#666';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 360, 260);
    
    ctx.fillStyle = '#eee';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 200, 150);
    
    return canvas.toDataURL();
}

export function handleImageError(imgElement, fallbackTitle = "Asset Missing") {
    console.warn(`Asset missing: ${imgElement.src}`);
    imgElement.src = generatePlaceholder(fallbackTitle);
}
