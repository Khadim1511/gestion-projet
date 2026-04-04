const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/indigo/g, 'orange');
  newContent = newContent.replace(/purple/g, 'red'); // Replace purple with red for orange theme gradients
  
  // Specific fix for index.css HEX codes
  if (filePath.endsWith('index.css')) {
    newContent = newContent.replace(/#6366f1/g, '#f97316'); // indigo-500 hex to orange-500 hex
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('/Users/macbook/gestion-projet/frontend/src');
console.log('Done replacing colors.');
