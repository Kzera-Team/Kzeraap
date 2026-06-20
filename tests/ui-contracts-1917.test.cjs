const fs=require('fs');
const item=fs.readFileSync('src/presentation/item/renderers/ItemCardRenderer.ts','utf8');
const app=fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts','utf8');
if(!item.includes('item-commercial-grid')) throw new Error('missing commercial item contract');
if(item.includes('item-stock-badge')) throw new Error('Item still exposes stock contract');
if(!app.includes('history.pushState') || !app.includes('popstate')) throw new Error('missing real navigation history contract');
if(!app.includes('kzera-drawer')) throw new Error('missing drawer menu contract');
console.log('ui-contracts-1917.test.cjs OK');
