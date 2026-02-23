figma.showUI(__html__, { width: 380, height: 520 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "PING") {
    figma.ui.postMessage({ type: "PONG", selected: figma.currentPage.selection.length });
  }

  if (msg.type === "APPLY_TEXT_BATCH") {
    // v1 placeholder: will map CSV->layer names next phase
    figma.notify(`Received ${msg.rows?.length || 0} rows for batch apply (v1 stub)`);
    figma.ui.postMessage({ type: "APPLY_DONE", ok: true });
  }
};
