/**
 * Set the fill color of a node
 * @param {Object} params - Fill color parameters
 * @param {string} params.nodeId - The ID of the node to modify
 * @param {number} params.r - Red component (0-1)
 * @param {number} params.g - Green component (0-1)
 * @param {number} params.b - Blue component (0-1)
 * @param {number} [params.a=1] - Alpha component (0-1)
 * @returns {Promise<Object>} Updated node information
 */
export async function setFillColor(params) {
  const { nodeId, r, g, b, a = 1 } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("fills" in node)) {
    throw new Error(`Node does not support fills: ${nodeId}`);
  }

  // Create RGBA color
  const rgbColor = { r, g, b, a };

  // Set fill
  const paintStyle = {
    type: "SOLID",
    color: {
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b,
    },
    opacity: rgbColor.a,
  };

  node.fills = [paintStyle];

  return {
    id: node.id,
    name: node.name,
    fills: node.fills,
  };
} 