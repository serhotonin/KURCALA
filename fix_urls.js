const fs = require('fs');
const path = require('path');
const { globSync } = require('glob'); // Need a glob library or just a recursive function

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes("'http://localhost:3001")) {
      content = content.replace(/'http:\/\/localhost:3001/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`");
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    } else if (content.includes('"http://localhost:3001')) {
      content = content.replace(/"http:\/\/localhost:3001/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`");
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    } else if (content.includes('`http://localhost:3001')) {
        content = content.replace(/`http:\/\/localhost:3001/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}");
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
  }
});
