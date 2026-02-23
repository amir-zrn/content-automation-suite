# Tonight 9PM Work Block (45-60 min)

## 1) Platform wiring (highest leverage)
- Add PostQued API key + account mapping IDs
- Confirm 2 TT + 2 IG accounts for first live draft test

## 2) Content engine validation
- Run daily generator and inspect outputs:
  - `backend/out/tt_slideshows.csv`
  - `backend/out/ig_slideshows.csv`
- Validate hooks and app pivots are rotating correctly

## 3) Figma plugin prep
- Provide exact layer names for TT and IG templates
- Confirm slide/card count constraints

## 4) Tracking and analytics setup
- Share Astro MCP connection details
- Share TickTick setup details (API / integration path)
- Share calendar integration preference

## 5) Quick decision gate
- Approve phase-2 build: plugin text mapper + export automation

## Added for tonight (new)
- Add safety filters before CSV export:
  - Medical-claim risk filter/rewriter
  - Duplicate hook suppression (cross-account + recent history)
  - Risk report output (`safety_report.json`)
