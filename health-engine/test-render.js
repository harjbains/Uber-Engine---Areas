const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><div id="app"></div>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock window.location
delete global.window.location;
global.window.location = { hash: '#/mobility' };

// We need to load mobility.js
// Since it uses ES modules and imports, we have to mock those or load them.
// Let's just create a dynamic import loader.
(async () => {
    try {
        const mobility = await import('file://C:/DEV/health-engine/js/views/mobility.js');
        const container = document.getElementById('app');
        await mobility.renderMobility(container);
        console.log("Rendered successfully!");
    } catch(e) {
        console.error("ERROR DURING RENDER:", e);
    }
})();
