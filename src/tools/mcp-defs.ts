// Import tools
import getDocumentInfo from './get_document_info';
import getSelection from './get_selection';
import getNodeInfo from './get_node_info';
import createRectangle from './create_rectangle';
import createFrame from './create_frame';
import createText from './create_text';
import setFillColor from './set_fill_color';
import setStrokeColor from './set_stroke_color/index.js';
import moveNode from './move_node';
import resizeNode from './resize_node';
import deleteNode from './delete_node';
import getStyles from './get_styles';
import getLocalComponents from './get_local_components';
import createComponentInstance from './create_component_instance/index.js';
import exportNodeAsImage from './export_node_as_image';
import setCornerRadius from './set_corner_radius/index.js';
import joinChannel from './join_channel';

// Export tools as named exports for better TypeScript support
export const tools = [
  getDocumentInfo,
  getSelection,
  getNodeInfo,
  createRectangle,
  createFrame,
  createText,
  setFillColor,
  setStrokeColor,
  moveNode,
  resizeNode,
  deleteNode,
  getStyles,
  getLocalComponents,
  createComponentInstance,
  exportNodeAsImage,
  setCornerRadius,
  joinChannel,
];

// Keep default export for backward compatibility
export default tools;