import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove visual noise: uppercase, extreme tracking, explicit borders
content = content.replace(/uppercase tracking-widest/g, 'tracking-tight');
content = content.replace(/uppercase tracking-wider/g, 'tracking-tight');
content = content.replace(/font-bold/g, 'font-medium');
content = content.replace(/font-semibold/g, 'font-medium');
content = content.replace(/uppercase/g, ''); // Remove stray uppercase classes

// Remove border utility classes entirely
content = content.replace(/border-[a-z]+ border-\[var\(--color-aura-border\)\]/g, '');
content = content.replace(/border border-\[var\(--color-aura-border\)\]/g, '');
content = content.replace(/border-\[var\(--color-aura-border\)\]/g, '');
content = content.replace(/ border /g, ' ');

// 2. Top Nav Redesign (translucent, glass finish)
content = content.replace(
  /<nav className="h-14 md:h-16 bg-\[var\(--color-aura-card\)\] px-4 md:px-6 flex items-center justify-between shrink-0 z-30">/g,
  '<nav className="h-16 bg-black/40 backdrop-blur-2xl px-6 md:px-8 flex items-center justify-between shrink-0 z-30 sticky top-0">'
);
// Logo
content = content.replace(/bg-gradient-to-tr from-white to-gray-400.*?>G<\/div>/, 'bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-medium text-xl shadow-inner pt-1">G</div>');

// 3. Rounded corners (hardware feel)
content = content.replace(/rounded-xl/g, 'rounded-[2rem]');
content = content.replace(/rounded-lg/g, 'rounded-[1.5rem]');

// 4. Main inputs and text (airy, clean)
content = content.replace(
  /w-full h-24 md:h-32 text-base md:text-lg font-medium text-gray-800 placeholder-gray-300/g,
  'w-full h-32 md:h-40 text-2xl md:text-4xl font-light text-white placeholder-[#86868B] bg-transparent'
);

// 5. Title
content = content.replace(
  /text-xl md:text-2xl font-medium tracking-tight text-\[var\(--color-aura-text\)\]/g,
  'text-3xl md:text-4xl font-light tracking-tight text-white'
);

// 6. Sidebar adjustments (make them float or blend smoothly)
content = content.replace(/bg-\[var\(--color-aura-card\)\] p-4 hidden md:flex/, 'bg-black p-6 hidden md:flex'); 
content = content.replace(/hidden lg:flex w-\[400px\] bg-\[var\(--color-aura-bg\)\] p-6 flex-col/g, 'hidden lg:flex w-[360px] bg-black p-8 flex-col');

// 7. Card color mappings
content = content.replace(/bg-\[var\(--color-aura-card\)\]/g, 'bg-[#0A0A0A]');

// 8. Custom Navbuttons
content = content.replace(/bg-indigo-50 text-indigo-700 font-medium/g, 'bg-white/10 text-white font-medium backdrop-blur-lg');
content = content.replace(/text-gray-600 hover:bg-gray-50/g, 'text-[#86868B] hover:text-white hover:bg-white/5 transition-colors');

// 9. Buttons
content = content.replace(/aura-btn  text-\[var\(--color-aura-bg\)\]/g, 'bg-white text-black hover:scale-95 transition-transform');
content = content.replace(/bg-indigo-600 hover:bg-indigo-700 text-white/g, 'bg-white text-black hover:bg-[#E5E5EA] transition-all active:scale-95 shadow-xl shadow-white/5');

// 10. General cleanup
content = content.replace(/text-\[var\(--color-aura-text\)\]/g, 'text-white');
content = content.replace(/text-\[var\(--color-aura-text-muted\)\]/g, 'text-[#86868B]');
content = content.replace(/bg-\[var\(--color-aura-muted\)\]/g, 'bg-[#111111]');
content = content.replace(/bg-\[var\(--color-aura-bg\)\]/g, 'bg-black');

// 11. Remove badges backgrounds
content = content.replace(/bg-green-50 text-green-600/g, 'text-white');
content = content.replace(/bg-blue-50 text-blue-600/g, 'text-white');
content = content.replace(/bg-purple-50 text-purple-600/g, 'text-white');

fs.writeFileSync('src/App.tsx', content);
