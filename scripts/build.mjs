import { cp, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) {
  await copyFile(join(root, file), join(output, file));
}
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });
console.log('Static site ready in dist/');
