import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacements: Array<[RegExp, string]> = [
  [/bg-\[\#F8F9FB\]/g, 'bg-[var(--color-aura-bg)]'],
  [/bg-white/g, 'bg-[var(--color-aura-card)]'],
  [/bg-\[\#F1F3F6\]/g, 'bg-[var(--color-aura-bg)]'],
  [/bg-\[\#1A1C1E\]/g, 'bg-[var(--color-aura-card)]'],
  [/bg-gray-50/g, 'bg-[var(--color-aura-muted)]'],
  [/bg-gray-100/g, 'bg-[var(--color-aura-muted)]'],
  [/bg-indigo-50/g, 'bg-[var(--color-aura-muted)]'],
  [/bg-indigo-600/g, 'aura-btn'], // We will use the custom class
  [/hover:bg-indigo-700/g, ''],
  [/hover:bg-indigo-50/g, 'hover:bg-[var(--color-aura-muted)]'],
  [/hover:bg-gray-50/g, 'hover:bg-[var(--color-aura-muted)]'],
  [/bg-green-50/g, 'bg-[var(--color-aura-muted)] text-[var(--color-aura-text)]'],
  [/bg-blue-50/g, 'bg-[var(--color-aura-muted)] text-[var(--color-aura-text)]'],
  [/bg-purple-50/g, 'bg-[var(--color-aura-muted)] text-[var(--color-aura-text)]'],
  [/bg-amber-50/g, 'bg-[var(--color-aura-muted)] text-[var(--color-aura-text)]'],
  [/bg-red-50/g, 'bg-[var(--color-aura-muted)] text-[var(--color-aura-text)]'],
  [/text-green-600/g, 'text-[var(--color-aura-text)]'],
  [/text-blue-600/g, 'text-[var(--color-aura-text)]'],
  [/text-purple-600/g, 'text-[var(--color-aura-text)]'],
  [/text-[#1A1C1E]/g, 'text-[var(--color-aura-text)]'],
  [/text-\[\#1a1a1a\]/g, 'text-[var(--color-aura-text)]'],
  [/text-gray-900/g, 'text-[var(--color-aura-text)]'],
  [/text-gray-800/g, 'text-[var(--color-aura-text)]'],
  [/text-gray-700/g, 'text-[var(--color-aura-text)]'],
  [/text-gray-600/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-gray-500/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-gray-400/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-gray-300/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-indigo-700/g, 'text-[var(--color-aura-text)]'],
  [/text-indigo-600/g, 'text-[var(--color-aura-accent)]'],
  [/text-indigo-500/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-indigo-200/g, 'text-[var(--color-aura-text-muted)]'],
  [/text-white/g, 'text-[var(--color-aura-bg)]'], // For standard text that was white
  [/text-green-700/g, 'text-[var(--color-aura-text)]'],
  [/text-red-400/g, 'text-[var(--color-aura-red)]'],
  [/text-red-500/g, 'text-[var(--color-aura-red)]'],
  [/text-red-600/g, 'text-[var(--color-aura-red)]'],
  [/border-gray-200/g, 'border-[var(--color-aura-border)]'],
  [/border-gray-100/g, 'border-[var(--color-aura-border)]'],
  [/border-gray-50/g, 'border-[var(--color-aura-border)]'],
  [/border-indigo-100/g, 'border-[var(--color-aura-border)]'],
  [/border-green-100/g, 'border-[var(--color-aura-border)]'],
  [/hover:border-indigo-200/g, 'hover:border-[var(--color-aura-accent)]'],
  [/hover:border-indigo-100/g, 'hover:border-[var(--color-aura-accent)]'],
  [/from-indigo-600 to-cyan-400/g, 'from-white to-gray-400'],
  [/shadow-.*?\b/g, ''],
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

// Add animation classes
content = content.replace(/className=\"space-y-8\"/g, 'className="space-y-8 animate-slide-up"');
content = content.replace(/shadow-sm/g, '');
content = content.replace(/shadow-xl/g, '');

fs.writeFileSync('src/App.tsx', content);

console.log('App.tsx updated');
