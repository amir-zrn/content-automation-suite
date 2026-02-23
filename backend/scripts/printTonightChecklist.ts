import fs from 'fs';
import path from 'path';

const p = path.resolve(process.cwd(), '../docs/TONIGHT_9PM_WORK_BLOCK.md');
const txt = fs.readFileSync(p, 'utf8');
console.log(txt);
