import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

if (existsSync('build')) rmSync('build', { recursive: true, force: true });
mkdirSync('build', { recursive: true });
cpSync('dist', 'build/dist', { recursive: true });
cpSync('src/styles.css', 'build/dist/styles.css');
cpSync('public', 'build/public', { recursive: true });
cpSync('index.html', 'build/index.html');

if (existsSync('netlify-drop')) rmSync('netlify-drop', { recursive: true, force: true });
mkdirSync('netlify-drop', { recursive: true });
cpSync('build/index.html', 'netlify-drop/index.html');
mkdirSync('netlify-drop/assets', { recursive: true });
cpSync('build/dist', 'netlify-drop/assets', { recursive: true });
cpSync('public', 'netlify-drop', { recursive: true });

writeFileSync('netlify-drop/_redirects', '/* /index.html 200\n');
console.log('Build complete. Netlify folder: netlify-drop');
