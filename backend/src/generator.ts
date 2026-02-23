import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { loadTrendHooks } from './trendHooks.js';

type HookRow = {
  ID: string;
  Slide_1_Hook: string;
  Slide_2_Text: string;
  Slide_3_Text: string;
  Slide_3_Comment_Bait: string;
  Slide_4_Text: string;
  Slide_5_App_Pivot: string;
  Slide_5_CTA_Overlay: string;
  Slide_6_Text: string;
};

type Account = { account: string; platform: 'tiktok'|'instagram'; status: 'active'|'paused' };

function readCsv<T=any>(p:string): T[] {
  const raw = fs.readFileSync(p,'utf8');
  return parse(raw,{columns:true,skip_empty_lines:true,relax_column_count:true});
}

function pick<T>(arr:T[], idx:number){ return arr[idx % arr.length]; }

function toIgVariant(row:HookRow){
  return {
    card_1: row.Slide_1_Hook,
    card_2: row.Slide_2_Text,
    card_3: row.Slide_3_Text,
    card_4: row.Slide_4_Text,
    card_5: row.Slide_6_Text,
  };
}

export function buildDailyBatches(opts:{
  hooksCsv:string;
  accountsCsv:string;
  outDir:string;
  ttPerAccount:number;
  igPerAccount:number;
  trendSignalsPath?: string;
  trendHookRatio?: number;
}) {
  const hooks = readCsv<HookRow>(opts.hooksCsv);
  const trendHooks = loadTrendHooks(opts.trendSignalsPath, 120);
  const trendRatio = Math.max(0, Math.min(1, opts.trendHookRatio ?? 0.25));
  const accounts = readCsv<Account>(opts.accountsCsv).filter(a=>a.status==='active');
  const tiktok = accounts.filter(a=>a.platform==='tiktok');
  const ig = accounts.filter(a=>a.platform==='instagram');

  const ttRows:any[]=[];
  const igRows:any[]=[];
  let i=0;

  for (const acc of tiktok){
    for (let n=0;n<opts.ttPerAccount;n++){
      const h = pick(hooks,i++);
      const useTrend = trendHooks.length > 0 && Math.random() < trendRatio;
      const selectedHook = useTrend ? trendHooks[(i+n) % trendHooks.length] : h.Slide_1_Hook;
      ttRows.push({
        account: acc.account,
        post_id: `TT-${acc.account.replace(/[^a-zA-Z0-9]/g,'')}-${n+1}`,
        ...h,
        Slide_1_Hook: selectedHook,
        caption: `${h.Slide_1_Hook}\n\n${h.Slide_5_CTA_Overlay}`,
        test_tag: `tt|${acc.account}|${h.ID}`
      });
    }
  }

  for (const acc of ig){
    for (let n=0;n<opts.igPerAccount;n++){
      const h = pick(hooks,i++);
      const useTrend = trendHooks.length > 0 && Math.random() < trendRatio;
      const selectedHook = useTrend ? trendHooks[(i+n) % trendHooks.length] : h.Slide_1_Hook;
      const igv = toIgVariant({...h, Slide_1_Hook: selectedHook} as HookRow);
      igRows.push({
        account: acc.account,
        post_id: `IG-${acc.account.replace(/[^a-zA-Z0-9]/g,'')}-${n+1}`,
        hook_id: h.ID,
        ...igv,
        caption: `${selectedHook} ${h.Slide_5_CTA_Overlay}`,
        test_tag: `ig|${acc.account}|${h.ID}`
      });
    }
  }

  fs.mkdirSync(opts.outDir,{recursive:true});

  const ttHeader = ['account','post_id','ID','Slide_1_Hook','Slide_2_Text','Slide_3_Text','Slide_3_Comment_Bait','Slide_4_Text','Slide_5_App_Pivot','Slide_5_CTA_Overlay','Slide_6_Text','caption','test_tag'];
  const igHeader = ['account','post_id','hook_id','card_1','card_2','card_3','card_4','card_5','caption','test_tag'];

  const toCsv=(rows:any[],header:string[])=> [header.join(','),...rows.map(r=>header.map(h=>JSON.stringify(String(r[h]??''))).join(','))].join('\n');

  fs.writeFileSync(path.join(opts.outDir,'tt_slideshows.csv'),toCsv(ttRows,ttHeader));
  fs.writeFileSync(path.join(opts.outDir,'ig_slideshows.csv'),toCsv(igRows,igHeader));
  fs.writeFileSync(path.join(opts.outDir,'summary.json'),JSON.stringify({
    generatedAt:new Date().toISOString(),
    tiktokAccounts:tiktok.length,
    igAccounts:ig.length,
    ttPosts:ttRows.length,
    igPosts:igRows.length,
    trendHooksLoaded: trendHooks.length,
    trendHookRatio: trendRatio
  },null,2));
}
