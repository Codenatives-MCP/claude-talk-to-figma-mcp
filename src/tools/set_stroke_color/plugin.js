/**
 * Set the stroke color of a node
 * @param {Object} params - Stroke color parameters
 * @param {string} params.nodeId - The ID of the node to modify
 * @param {number} params.r - Red component (0-1)
 * @param {number} params.g - Green component (0-1)
 * @param {number} params.b - Blue component (0-1)
 * @param {number} [params.a=1] - Alpha component (0-1)
 * @param {number} [params.weight=1] - Stroke weight
 * @returns {Promise<Object>} Updated node information
 */
export async function setStrokeColor(params) {
  const { nodeId, r, g, b, a = 1, weight = 1 } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("strokes" in node)) {
    throw new Error(`Node does not support strokes: ${nodeId}`);
  }

  // Create RGBA color
  const rgbColor = { r, g, b, a };

  // Set stroke
  const paintStyle = {
    type: "SOLID",
    color: {
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b,
    },
    opacity: rgbColor.a,
  };

  node.strokes = [paintStyle];

  // Set stroke weight if available
  if ("strokeWeight" in node) {
    node.strokeWeight = weight;
  }

  return {
    id: node.id,
    name: node.name,
    strokes: node.strokes,
    strokeWeight: "strokeWeight" in node ? node.strokeWeight : undefined,
  };
} 