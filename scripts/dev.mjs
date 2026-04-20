import { execSync } from 'node:child_process';
execSync('npm run build', { stdio: 'inherit' });
console.log('Open netlify-drop/index.html in a static file server for preview.');
