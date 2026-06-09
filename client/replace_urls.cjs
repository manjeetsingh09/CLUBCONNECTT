const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace single quoted string starts: 'http://localhost:5000/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/...`
  // We need to replace 'http://localhost:5000/ with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/
  // And we need to change the enclosing quotes to backticks if they were single quotes.
  
  // A simpler Regex approach:
  // 1. Replace all exact occurrences of 'http://localhost:5000' (no trailing slash) with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}` but wait, that would make it `${import.meta.env...}` inside single quotes, which is not evaluated.
  
  // To be safe, just replace `http://localhost:5000` with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`
  // AND ensure the string uses backticks if it used single quotes or double quotes.
  // Regex: (['"`])http:\/\/localhost:5000(.*?)\1
  // Replacement: \`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$2\`

  content = content.replace(/(['"`])http:\/\/localhost:5000(.*?)(\1)/g, (match, p1, p2, p3) => {
    return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${p2}\``;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceUrlsInFile(fullPath);
    }
  }
}

traverseDirectory(directoryPath);
console.log('Done.');
