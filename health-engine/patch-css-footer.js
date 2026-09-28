const fs = require('fs');
let css = fs.readFileSync('C:\\DEV\\health-engine\\css\\styles.css', 'utf8');

const tvFooterRegex = /\.tv-footer \{[\s\S]*?\}/;
const match = css.match(tvFooterRegex);
if(match) {
    const newFooter = `
.tv-footer {
    height: clamp(90px, 11dvh, 120px);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 40px 10px 40px;
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
}
`;
    css = css.replace(match[0], newFooter.trim());
    fs.writeFileSync('C:\\DEV\\health-engine\\css\\styles.css', css);
    console.log('Fixed tv-footer in styles.css');
}
