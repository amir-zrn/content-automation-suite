figma.showUI(__html__, { width: 460, height: 640 });

const FIELD_ALIASES = {
  slide1: ["Slide_1_Hook", "Slide_1_Text", "card_1"],
  slide2: ["Slide_2_Text", "Slide_2", "card_2"],
  slide3: ["Slide_3_Text", "Slide_3", "card_3"],
  slide3Bait: ["Slide_3_Comment_Bait", "Comment_Bait", "Slide_3_Bait"],
  slide4: ["Slide_4_Text", "Slide_4", "card_4"],
  slide5Pivot: ["Slide_5_App_Pivot", "Slide_5_Pivot", "Slide_5_Text", "card_5"],
  slide5Cta: ["Slide_5_CTA_Overlay", "Slide_5_CTA"],
  slide6: ["Slide_6_Text", "Slide_6"]
};

function normalizeName(s) {
  return (s || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "");
}

function matchesAlias(name, aliases) {
  const n = normalizeName(name);
  return aliases.some((a) => normalizeName(a) === n);
}

function mapRow(row) {
  return {
    slide1: row.Slide_1_Hook || row.Slide_1_Text || row.card_1 || "",
    slide2: row.Slide_2_Text || row.card_2 || "",
    slide3: row.Slide_3_Text || row.card_3 || "",
    slide3Bait: row.Slide_3_Comment_Bait || "",
    slide4: row.Slide_4_Text || row.card_4 || "",
    slide5Pivot: row.Slide_5_App_Pivot || row.card_5 || "",
    slide5Cta: row.Slide_5_CTA_Overlay || "",
    slide6: row.Slide_6_Text || "",
    caption: row.caption || ""
  };
}

function findTextNodes(container) {
  if (container.type === "TEXT") return [container];
  if (!container.findAll) return [];
  return container.findAll((n) => n.type === "TEXT");
}

async function safeSetText(node, value) {
  if (typeof value !== "string") return false;
  try {
    if (node.fontName === figma.mixed) {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      node.fontName = { family: "Inter", style: "Regular" };
    } else {
      await figma.loadFontAsync(node.fontName);
    }
    node.characters = value;
    return true;
  } catch (e) {
    return false;
  }
}

async function applyRowToContainer(container, row) {
  const mapped = mapRow(row);
  const textNodes = findTextNodes(container);
  let updated = 0;

  for (const node of textNodes) {
    const name = node.name || "";

    if (matchesAlias(name, FIELD_ALIASES.slide1) && mapped.slide1) {
      if (await safeSetText(node, mapped.slide1)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide2) && mapped.slide2) {
      if (await safeSetText(node, mapped.slide2)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide3) && mapped.slide3) {
      if (await safeSetText(node, mapped.slide3)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide3Bait) && mapped.slide3Bait) {
      if (await safeSetText(node, mapped.slide3Bait)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide4) && mapped.slide4) {
      if (await safeSetText(node, mapped.slide4)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide5Pivot) && mapped.slide5Pivot) {
      if (await safeSetText(node, mapped.slide5Pivot)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide5Cta) && mapped.slide5Cta) {
      if (await safeSetText(node, mapped.slide5Cta)) updated++;
      continue;
    }
    if (matchesAlias(name, FIELD_ALIASES.slide6) && mapped.slide6) {
      if (await safeSetText(node, mapped.slide6)) updated++;
      continue;
    }
  }

  return { updated, mapped };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "PING") {
    figma.ui.postMessage({
      type: "PONG",
      selection: figma.currentPage.selection.length
    });
    return;
  }

  if (msg.type === "PREVIEW_SELECTION") {
    const nodes = figma.currentPage.selection;
    figma.ui.postMessage({
      type: "SELECTION_INFO",
      count: nodes.length,
      names: nodes.map((n) => n.name)
    });
    return;
  }

  if (msg.type === "APPLY_BATCH") {
    const rows = msg.rows || [];
    const startIndex = Number(msg.startIndex || 0);
    const selection = figma.currentPage.selection;

    if (!selection.length) {
      figma.ui.postMessage({ type: "APPLY_RESULT", ok: false, error: "No frames selected." });
      return;
    }
    if (!rows.length) {
      figma.ui.postMessage({ type: "APPLY_RESULT", ok: false, error: "No rows loaded." });
      return;
    }

    const containers = [...selection].sort((a, b) => a.x - b.x);
    const results = [];

    for (let i = 0; i < containers.length; i++) {
      const row = rows[startIndex + i];
      if (!row) break;
      const res = await applyRowToContainer(containers[i], row);
      results.push({
        node: containers[i].name,
        rowIndex: startIndex + i,
        updated: res.updated,
        post_id: row.post_id || row.ID || ""
      });
    }

    figma.notify(`Applied rows to ${results.length} selected item(s).`);
    figma.ui.postMessage({ type: "APPLY_RESULT", ok: true, results });
    return;
  }

  if (msg.type === "CLOSE") {
    figma.closePlugin();
  }
};