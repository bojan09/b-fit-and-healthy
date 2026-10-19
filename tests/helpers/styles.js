const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');

/** Every stylesheet the app ships, in import order, so tests assert the rules that render. */
function readAllStyles() {
  const globals = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  const imported = [...globals.matchAll(/@import "\.\.\/styles\/([^"]+)";/g)].map((match) => match[1]);
  const files = imported.map((name) => path.join(root, 'src/styles', name));
  return [globals, ...files.map((file) => fs.readFileSync(file, 'utf8'))].join('\n');
}

module.exports = { readAllStyles };
