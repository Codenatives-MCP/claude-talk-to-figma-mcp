/**
 * Get all styles from the current document
 * @returns {Promise<Object>} Style information
 */
export async function getStyles() {
  const styles = {
    color: [],
    text: [],
    effect: [],
    grid: [],
  };

  // Get color styles
  const colorStyles = figma.getLocalPaintStyles();
  styles.color = colorStyles.map((style) => ({
    id: style.id,
    name: style.name,
    description: style.description,
    key: style.key,
    paint: style.paints[0],
  }));

  // Get text styles
  const textStyles = figma.getLocalTextStyles();
  styles.text = textStyles.map((style) => ({
    id: style.id,
    name: style.name,
    description: style.description,
    key: style.key,
    fontName: style.fontName,
    fontSize: style.fontSize,
    letterSpacing: style.letterSpacing,
    lineHeight: style.lineHeight,
    paragraphIndent: style.paragraphIndent,
    paragraphSpacing: style.paragraphSpacing,
    textCase: style.textCase,
    textDecoration: style.textDecoration,
  }));

  // Get effect styles
  const effectStyles = figma.getLocalEffectStyles();
  styles.effect = effectStyles.map((style) => ({
    id: style.id,
    name: style.name,
    description: style.description,
    key: style.key,
    effects: style.effects,
  }));

  // Get grid styles
  const gridStyles = figma.getLocalGridStyles();
  styles.grid = gridStyles.map((style) => ({
    id: style.id,
    name: style.name,
    description: style.description,
    key: style.key,
    layoutGrids: style.layoutGrids,
  }));

  return styles;
} 