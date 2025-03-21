/**
 * Export a node as an image
 * @param {Object} params - Export parameters
 * @param {string} params.nodeId - The ID of the node to export
 * @param {string} [params.format="PNG"] - Export format (PNG, JPG, SVG, PDF)
 * @param {number} [params.scale=1] - Export scale
 * @returns {Promise<Object>} Export result with image data
 */
export async function exportNodeAsImage(params) {
  const { nodeId, format = "PNG", scale = 1 } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("exportAsync" in node)) {
    throw new Error(`Node does not support exporting: ${nodeId}`);
  }

  try {
    const settings = {
      format: format,
      constraint: { type: "SCALE", value: scale },
    };

    const bytes = await node.exportAsync(settings);

    let mimeType;
    switch (format) {
      case "PNG":
        mimeType = "image/png";
        break;
      case "JPG":
        mimeType = "image/jpeg";
        break;
      case "SVG":
        mimeType = "image/svg+xml";
        break;
      case "PDF":
        mimeType = "application/pdf";
        break;
      default:
        mimeType = "application/octet-stream";
    }

    // Convert to base64
    const uint8Array = new Uint8Array(bytes);
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    const imageData = `data:${mimeType};base64,${base64}`;

    return {
      nodeId,
      format,
      scale,
      mimeType,
      imageData,
    };
  } catch (error) {
    throw new Error(`Error exporting node as image: ${error.message}`);
  }
} 