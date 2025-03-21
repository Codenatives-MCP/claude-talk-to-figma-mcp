/**
 * Get detailed information about a specific node
 * @param {string} nodeId - The ID of the node to get information about
 * @returns {Promise<Object>} Node information
 */
export async function getNodeInfo(nodeId) {
  const node = await figma.getNodeByIdAsync(nodeId);

  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  // Base node information
  const nodeInfo = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
  };

  // Add position and size for SceneNode
  if ("x" in node && "y" in node) {
    nodeInfo.x = node.x;
    nodeInfo.y = node.y;
  }

  if ("width" in node && "height" in node) {
    nodeInfo.width = node.width;
    nodeInfo.height = node.height;
  }

  // Add fills for nodes with fills
  if ("fills" in node) {
    nodeInfo.fills = node.fills;
  }

  // Add strokes for nodes with strokes
  if ("strokes" in node) {
    nodeInfo.strokes = node.strokes;
    if ("strokeWeight" in node) {
      nodeInfo.strokeWeight = node.strokeWeight;
    }
  }

  // Add children for parent nodes
  if ("children" in node) {
    nodeInfo.children = node.children.map((child) => ({
      id: child.id,
      name: child.name,
      type: child.type,
    }));
  }

  // Add text-specific properties
  if (node.type === "TEXT") {
    nodeInfo.characters = node.characters;
    nodeInfo.fontSize = node.fontSize;
    nodeInfo.fontName = node.fontName;
  }

  return nodeInfo;
} 