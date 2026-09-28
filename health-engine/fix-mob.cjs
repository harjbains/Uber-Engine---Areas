const fs = require('fs');
let mob = fs.readFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', 'utf8');

const search = `export async function renderMobility(container) {
    container.innerHTML = \`
        <div class="app-container tv-shell">
            <div id="mobility-content" style="flex: 1; display: flex; flex-direction: column;">
                <div class="spinner" style="margin: auto;"></div>
            </div>
        </div>
        <style>`;

const replace = `export async function renderMobility(container) {
    container.innerHTML = \`
        <div id="mobility-content" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div class="spinner" style="margin: auto;"></div>
        </div>
        <style>`;

mob = mob.replace(search, replace);
fs.writeFileSync('C:\\DEV\\health-engine\\js\\views\\mobility.js', mob);
