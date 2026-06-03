import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/sm:border-l/g, '');
content = content.replace(/hover:border-\[var\(--color-aura-accent\)\]/g, 'hover:shadow-lg hover:shadow-white/5');
content = content.replace(/border-transparent/g, '');
content = content.replace(/border-amber-100/g, '');
content = content.replace(/border-red-100/g, '');
content = content.replace(/border-2/g, '');
content = content.replace(/text-amber-600/g, 'text-orange-400');
content = content.replace(/border-b/g, ''); 

fs.writeFileSync('src/App.tsx', content);
