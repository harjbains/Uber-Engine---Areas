const fs = require('fs');
let code = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

code = code.replace(
    /<button id="btn-close-howto" class="btn-complete"/g, 
    '<button id="btn-close-howto"'
);

// We want to add display flex, remove any implicit flex:1 from global buttons, and fix height to exactly 60px.
code = code.replace(
    /box-shadow: 0 4px 15px rgba\(0,123,255,0\.4\); outline: none; border-radius: 12px; font-weight: bold; cursor: pointer; color: white; border: 2px solid transparent;"/g,
    'box-shadow: 0 4px 15px rgba(0,123,255,0.4); outline: none; border-radius: 12px; font-weight: bold; cursor: pointer; color: white; border: 2px solid transparent; display: flex; align-items: center; justify-content: center; flex: 0 0 60px !important;"'
);

fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', code);
