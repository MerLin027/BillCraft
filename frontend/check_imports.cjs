const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
      const content = fs.readFileSync(p, 'utf8');
      const regex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const target = match[1];
        if (target.startsWith('.')) {
          const targetPath = path.resolve(path.dirname(p), target);
          let found = false;
          
          if (fs.existsSync(targetPath + '.jsx')) {
            const realName = getActualCase(path.dirname(targetPath), path.basename(targetPath) + '.jsx');
            if (realName !== path.basename(targetPath) + '.jsx') console.log(`CASE MISMATCH in ${p}: ${target} (actual: ${realName})`);
            found = true;
          } else if (fs.existsSync(targetPath + '.js')) {
            const realName = getActualCase(path.dirname(targetPath), path.basename(targetPath) + '.js');
            if (realName !== path.basename(targetPath) + '.js') console.log(`CASE MISMATCH in ${p}: ${target} (actual: ${realName})`);
            found = true;
          } else if (fs.existsSync(targetPath + '.css')) {
            found = true;
          } else if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            found = true;
          }
          
          if (!found) console.log(`BROKEN IMPORT in ${p}: ${target}`);
        }
      }
    }
  });
}

function getActualCase(dir, base) {
  try {
    const files = fs.readdirSync(dir);
    const match = files.find(f => f.toLowerCase() === base.toLowerCase());
    return match || base;
  } catch(e) {
    return base;
  }
}

walk(src);
