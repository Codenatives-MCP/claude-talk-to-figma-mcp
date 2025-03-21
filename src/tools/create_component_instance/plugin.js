/**
 * Create an instance of a component
 * @param {Object} params - Component instance parameters
 * @param {string} params.componentKey - The key of the component to instantiate
 * @param {number} [params.x=0] - X position
 * @param {number} [params.y=0] - Y position
 * @returns {Promise<Object>} Created instance information
 */
export async function createComponentInstance(params) {
  const { componentKey, x = 0, y = 0 } = params || {};

  if (!componentKey) {
    throw new Error("Missing componentKey parameter");
  }

  try {
    const component = await figma.importComponentByKeyAsync(componentKey);
    const instance = component.createInstance();

    instance.x = x;
    instance.y = y;

    figma.currentPage.appendChild(instance);

    return {
      id: instance.id,
      name: instance.name,
      x: instance.x,
      y: instance.y,
      width: instance.width,
      height: instance.height,
      componentId: instance.componentId,
    };
  } catch (error) {
    throw new Error(`Error creating component instance: ${error.message}`);
  }
} 