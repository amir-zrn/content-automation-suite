#!/usr/bin/env python3
import argparse, json, re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

HOOK_PATTERNS=[
    r"^POV[:\-]", r"^Stop ", r"^How to ", r"^If you ", r"^The ", r"^Why ", r"^Things I "
]

def clean(s:str)->str:
    return re.sub(r"\s+", " ", (s or "").strip())

def hook_type(text:str)->str:
    t=text.lower()
    if t.startswith("pov"): return "pov"
    if t.startswith("stop "): return "pattern-break"
    if t.startswith("how to "): return "howto"
    if t.startswith("if you "): return "conditional"
    if "?" in t: return "question"
    return "statement"

def extract(lines:list[str], top:int=30):
    hooks=[]
    for l in lines:
        s=clean(l)
        if len(s) < 18 or len(s) > 140:
            continue
        if any(re.search(p, s, re.IGNORECASE) for p in HOOK_PATTERNS):
            hooks.append(s)
    counts=Counter(hooks)
    out=[]
    for text, freq in counts.most_common(top):
        out.append({"hook":text,"freq":freq,"hook_type":hook_type(text)})
    return out

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="Text file with one post/caption per line")
    ap.add_argument("--out", default="./out/competitor_hooks.json")
    ap.add_argument("--top", type=int, default=30)
    args=ap.parse_args()

    lines=Path(args.input).read_text(encoding="utf-8", errors="ignore").splitlines()
    hooks=extract(lines, args.top)
    payload={
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": args.input,
        "count": len(hooks),
        "items": hooks
    }
    out=Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(str(out))
