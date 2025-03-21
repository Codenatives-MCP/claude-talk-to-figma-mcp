// Import all tool implementations from their respective modules
import { getDocumentInfo } from './get_document_info/plugin.js';
import { getSelection } from './get_selection/plugin.js';
import { getNodeInfo } from './get_node_info/plugin.js';
import { createRectangle } from './create_rectangle/plugin.js';
import { createFrame } from './create_frame/plugin.js';
import { createText } from './create_text/plugin.js';
import { setFillColor } from './set_fill_color/plugin.js';
import { setStrokeColor } from './set_stroke_color/plugin.js';
import { moveNode } from './move_node/plugin.js';
import { resizeNode } from './resize_node/plugin.js';
import { deleteNode } from './delete_node/plugin.js';
import { getStyles } from './get_styles/plugin.js';
import { getLocalComponents } from './get_local_components/plugin.js';
import { createComponentInstance } from './create_component_instance/plugin.js';
import { exportNodeAsImage } from './export_node_as_image/plugin.js';
import { setCornerRadius } from './set_corner_radius/plugin.js';
import { joinChannel } from './join_channel/plugin.js';

// Export a map of command handlers
export const handlers = {
  'get_document_info': getDocumentInfo,
  'get_selection': getSelection,
  'get_node_info': getNodeInfo,
  'create_rectangle': createRectangle,
  'create_frame': createFrame,
  'create_text': createText,
  'set_fill_color': setFillColor,
  'set_stroke_color': setStrokeColor,
  'move_node': moveNode,
  'resize_node': resizeNode,
  'delete_node': deleteNode,
  'get_styles': getStyles,
  'get_local_components': getLocalComponents,
  'create_component_instance': createComponentInstance,
  'export_node_as_image': exportNodeAsImage,
  'set_corner_radius': setCornerRadius,
  'join_channel': joinChannel,
};

// Helper function to execute any registered command
export async function executeCommand(command, params) {
  const handler = handlers[command];
  
  if (!handler) {
    throw new Error(`Unknown command: ${command}`);
  }
  
  return await handler(params);
} 