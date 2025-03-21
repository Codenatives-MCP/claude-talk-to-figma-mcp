/**
 * Delete a node
 * @param {Object} params - Delete node parameters
 * @param {string} params.nodeId - The ID of the node to delete
 * @returns {Promise<Object>} Deleted node information
 */
export async function deleteNode(params) {
  const { nodeId } = params || {};

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const nodeInfo = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  // Remove the node
  node.remove();

  return {
    ...nodeInfo,
    deleted: true,
  };
} 