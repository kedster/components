const fs = require('fs');
const path = require('path');

const partsDir = path.resolve(__dirname, '..', 'Parts');
const outFile = path.resolve(__dirname, '..', 'filelist.json');

function main() {
  if (!fs.existsSync(partsDir)) {
    console.error('Parts directory not found:', partsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(partsDir, { withFileTypes: true })
    .filter(d => d.isFile())
    .filter(d => d.name.match(/\.zip$/i))
    .map(d => ({
      title: prettyTitle(d.name),
      filename: d.name,
      description: ''
    }));

  fs.writeFileSync(outFile, JSON.stringify(files, null, 2), 'utf8');
  console.log('Wrote', outFile);
}

function prettyTitle(filename) {
  return filename.replace(/[-_\.zip]/g, ' ').replace(/\s+/g, ' ').trim();
}

main();
