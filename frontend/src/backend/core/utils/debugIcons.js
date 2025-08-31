// Debug script to check which icons are undefined
import * as icons from './iconImports';

console.log('Icon debug report:');
Object.entries(icons).forEach(([name, icon]) => {
  if (icon === undefined) {
    console.error(`❌ ${name} is undefined`);
  } else {
    console.log(`✅ ${name} is defined`);
  }
});

export const debugIcons = () => {
  return Object.keys(icons).length;
};