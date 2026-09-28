const fs = require('fs');
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const additionalCSS = `
/* Ceiling for TV Home Cards (Prevents extreme stretching on tall screens) */
.home-content {
    justify-content: center !important;
}
.cards-container {
    max-height: 650px !important;
    margin-top: auto !important; 
    margin-bottom: auto !important; 
}
`;

if (!css.includes('Ceiling for TV Home Cards')) {
    css += additionalCSS;
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Appended max-height limits');
}
