const fs = require('fs');

let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const responsiveCSS = `

/* =========================================================================
   Responsive TV Layout (Fit viewport strictly without scaling)
   ========================================================================= */
html, body {
    width: 100vw;
    height: 100dvh;
    overflow: hidden !important;
}

.app-container, .home-layout {
    width: 100vw;
    height: 100dvh !important;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    min-height: 0; 
    height: auto !important; 
    overflow: hidden; 
}

.workout-panel {
    min-height: 0;
}

/* Gracefully compress vertical heights/gaps/paddings when restricted vertically */
@media (max-height: 1080px) {
    .top-bar { height: clamp(50px, 8.5dvh, 90px) !important; }
    .bottom-bar { height: clamp(60px, 10dvh, 110px) !important; }
    
    .home-layout { padding: clamp(15px, 3dvh, 40px) 60px !important; }
    .header { margin-bottom: clamp(15px, 4dvh, 50px) !important; }
    .cards-container { margin-bottom: clamp(15px, 3dvh, 30px) !important; }
    .footer { height: clamp(60px, 9dvh, 100px) !important; }
    
    .main-content { padding-bottom: clamp(5px, 1.5dvh, 20px) !important; }
    .left-rail { padding: clamp(10px, 2dvh, 20px) !important; }
    .rail-item { height: clamp(50px, 7.5dvh, 80px) !important; }
    
    .controls-area { gap: clamp(10px, 2dvh, 30px) !important; }
    .submit-area { padding: clamp(15px, 3dvh, 40px) !important; }
    .btn-complete, .btn-start-purple, .btn-skip-sub {
        padding-top: clamp(10px, 2dvh, 25px) !important;
        padding-bottom: clamp(10px, 2dvh, 25px) !important;
    }
}
`;

if (!css.includes('Responsive TV Layout')) {
    css += responsiveCSS;
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Appended responsive CSS');
}
