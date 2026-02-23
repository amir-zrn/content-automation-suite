#!/usr/bin/env python3
import argparse, json, re, time
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36"


def clean(s:str)->str:
    return re.sub(r"\s+", " ", (s or "").strip())


def fetch(url:str, timeout:int=20)->str:
    r=requests.get(url, headers={"User-Agent":UA}, timeout=timeout)
    r.raise_for_status()
    return r.text


def parse_generic(url:str, html:str, limit:int=20):
    soup=BeautifulSoup(html, "html.parser")
    out=[]

    # Try headlines
    for sel in ["article h1, article h2, article h3", "h1,h2,h3", "a[title]"]:
        nodes=soup.select(sel)
        for n in nodes:
            text=clean(n.get_text(" ")) if n.name != "a" else clean(n.get("title", ""))
            if len(text) < 20:
                continue
            out.append({"title": text, "source": url})
            if len(out) >= limit:
                return out
    return out[:limit]


def run(urls:list[str], out_path:Path, limit:int):
    rows=[]
    for u in urls:
        try:
            html=fetch(u)
            items=parse_generic(u, html, limit=limit)
            rows.extend(items)
            time.sleep(0.8)
        except Exception as e:
            rows.append({"title": f"ERROR: {u} -> {e}", "source": u})

    payload={
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(rows),
        "items": rows
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(str(out_path))


if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--urls", nargs="+", required=True)
    ap.add_argument("--out", default="./out/trend_signals.json")
    ap.add_argument("--limit", type=int, default=15)
    args=ap.parse_args()
    run(args.urls, Path(args.out), args.limit)
