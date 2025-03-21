/**
 * Create a new text element
 * @param {Object} params - Text parameters
 * @param {number} [params.x=0] - X position
 * @param {number} [params.y=0] - Y position
 * @param {string} [params.text="Text"] - Text content
 * @param {string} [params.name] - Optional name for the text node
 * @param {Object} [params.fontColor] - Font color in RGBA format
 * @param {number} [params.fontSize=14] - Font size
 * @param {number} [params.fontWeight] - Font weight
 * @param {string} [params.parentId] - Parent node ID to append the text to
 * @returns {Promise<Object>} Created text node information
 */
export async function createText(params) {
  const {
    x = 0,
    y = 0,
    text = "Text",
    name,
    fontColor,
    fontSize = 14,
    fontWeight,
    parentId,
  } = params || {};

  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  
  // Set text content
  await figma.loadFontAsync(textNode.fontName);
  textNode.characters = text;
  
  // Set name (default to text content if not provided)
  textNode.name = name || text;

  // Set font size if provided
  if (fontSize) {
    textNode.fontSize = fontSize;
  }

  // Set font weight if provided
  if (fontWeight) {
    const currentFont = textNode.fontName;
    await figma.loadFontAsync({
      family: currentFont.family,
      style: getFontStyleFromWeight(fontWeight),
    });
    textNode.fontName = {
      family: currentFont.family,
      style: getFontStyleFromWeight(fontWeight),
    };
  }

  // Set font color if provided
  if (fontColor) {
    const paintStyle = {
      type: "SOLID",
      color: {
        r: parseFloat(fontColor.r) || 0,
        g: parseFloat(fontColor.g) || 0,
        b: parseFloat(fontColor.b) || 0,
      },
      opacity: parseFloat(fontColor.a) || 1,
    };
    textNode.fills = [paintStyle];
  }

  // If parentId is provided, append to that node, otherwise append to current page
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    parentNode.appendChild(textNode);
  } else {
    figma.currentPage.appendChild(textNode);
  }

  return {
    id: textNode.id,
    name: textNode.name,
    x: textNode.x,
    y: textNode.y,
    width: textNode.width,
    height: textNode.height,
    characters: textNode.characters,
    fontSize: textNode.fontSize,
    fontName: textNode.fontName,
    parentId: textNode.parent ? textNode.parent.id : undefined,
  };
}

/**
 * Helper function to convert numeric font weight to Figma font style
 * @param {number} weight - Font weight (400, 500, 700, etc.)
 * @returns {string} Figma font style
 */
function getFontStyleFromWeight(weight) {
  // Default mapping, adjust based on available font styles
  const weightMap = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
  };

  return weightMap[weight] || "Regular";
} 