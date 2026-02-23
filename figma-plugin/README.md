# Content AutoFactory Figma Plugin (v1)

## What works now
- Load CSV from your machine
- Preview current Figma selection
- Apply CSV rows to selected containers (left-to-right)
- Text mapping by layer names with aliases

## Expected layer names (supports aliases)
- Slide_1_Hook / Slide_1_Text / card_1
- Slide_2_Text / card_2
- Slide_3_Text / card_3
- Slide_3_Comment_Bait
- Slide_4_Text / card_4
- Slide_5_App_Pivot / card_5
- Slide_5_CTA_Overlay
- Slide_6_Text

## How to run in Figma desktop
1. Open Figma Desktop
2. Plugins -> Development -> Import plugin from manifest
3. Choose: `figma-plugin/manifest.json`
4. Open your design file and select target post containers (frames/components)
5. Plugins -> Development -> Content AutoFactory
6. Upload CSV and click **Apply to Selected**

## Apply behavior
- Selection is sorted left-to-right
- Start row index controls where CSV mapping starts
- One row is applied per selected container

## Notes
- If a text layer font cannot be loaded, that field may be skipped.
- Keep your template text layer names consistent for best results.
