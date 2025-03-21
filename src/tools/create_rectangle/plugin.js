/**
 * Create a new rectangle
 * @param {Object} params - Rectangle parameters
 * @param {number} params.x - X position
 * @param {number} params.y - Y position
 * @param {number} params.width - Width of the rectangle
 * @param {number} params.height - Height of the rectangle
 * @param {string} [params.name="Rectangle"] - Name for the rectangle
 * @param {string} [params.parentId] - Parent node ID to append the rectangle to
 * @returns {Promise<Object>} Created rectangle information
 */
export async function createRectangle(params) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Rectangle",
    parentId,
  } = params || {};

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(rect);
  } else {
    figma.currentPage.appendChild(rect);
  }

  return {
    id: rect.id,
    name: rect.name,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    parentId: rect.parent ? rect.parent.id : undefined,
  };
}