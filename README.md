# Content Automation Suite (v0)

End-to-end system for high-volume content production:
- Figma plugin for slideshow rendering (TT/IG templates)
- Backend orchestrator for batch building and PostQued draft upload
- Shared schema for accounts/hooks/posts

## Stack
- Backend: Node.js + TypeScript + Express
- Figma Plugin: TypeScript (plugin + UI)
- Data: CSV/JSON inputs + local logs

## Status
- [x] Project scaffold
- [x] API + schema stubs
- [x] Figma plugin skeleton
- [ ] PostQued endpoints wiring (awaiting real key/account IDs)
- [ ] End-to-end dry-run tests

## Quick start
```bash
cd backend
npm install
npm run dev
```

## Important
Do NOT commit real API keys. Use `.env`.
