import 'dotenv/config';
import path from 'path';
import { buildDailyBatches } from '../src/generator.js';

const root = path.resolve(process.cwd(), '..');
const hooksCsv = process.env.HOOKS_CSV || path.join(root,'backend/data/samples/hooks_master.csv');
const accountsCsv = process.env.ACCOUNTS_CSV || path.join(root,'backend/data/samples/accounts.csv');
const outDir = process.env.OUT_DIR || path.join(root,'backend/out');

buildDailyBatches({
  hooksCsv,
  accountsCsv,
  outDir,
  ttPerAccount: Number(process.env.TT_PER_ACCOUNT || 4),
  igPerAccount: Number(process.env.IG_PER_ACCOUNT || 4),
  trendSignalsPath: process.env.TREND_SIGNALS_JSON || path.join(root,'backend/out/trend_signals.json'),
  trendHookRatio: Number(process.env.TREND_HOOK_RATIO || 0.25)
});

console.log('Generated batches in', outDir);
