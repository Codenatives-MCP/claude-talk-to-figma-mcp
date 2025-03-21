/**
 * Set the corner radius of a node
 * @param {Object} params - Corner radius parameters
 * @param {string} params.nodeId - The ID of the node to modify
 * @param {number} params.radius - Corner radius value
 * @param {boolean[]} [params.corners] - Optional array of 4 booleans to specify which corners to round [topLeft, topRight, bottomRight, bottomLeft]
 * @returns {Promise<Object>} Updated node information
 */
export async function setCornerRadius(params) {
  const { nodeId, radius, corners } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (radius === undefined) {
    throw new Error("Missing radius parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Check if node supports corner radius (rectangles, frames, etc.)
  if (!("cornerRadius" in node)) {
    throw new Error(`Node does not support corner radius: ${nodeId}`);
  }

  // If corners array is provided, set individual corner radii
  if (Array.isArray(corners) && corners.length === 4 && "topLeftRadius" in node) {
    const [topLeft, topRight, bottomRight, bottomLeft] = corners;
    
    // Use mixed corner radii
    node.cornerRadius = figma.mixed;
    
    // Set individual corner radii based on the boolean array
    node.topLeftRadius = topLeft ? radius : 0;
    node.topRightRadius = topRight ? radius : 0;
    node.bottomRightRadius = bottomRight ? radius : 0;
    node.bottomLeftRadius = bottomLeft ? radius : 0;
  } else {
    // Set all corners to the same radius
    node.cornerRadius = radius;
  }

  // Return node information
  const result = {
    id: node.id,
    name: node.name,
    cornerRadius: node.cornerRadius,
  };

  // Include individual corner radii if available
  if ("topLeftRadius" in node) {
    result.topLeftRadius = node.topLeftRadius;
    result.topRightRadius = node.topRightRadius;
    result.bottomRightRadius = node.bottomRightRadius;
    result.bottomLeftRadius = node.bottomLeftRadius;
  }

  return result;
} 