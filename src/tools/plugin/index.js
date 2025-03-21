// Import plugin functions
import { getDocumentInfo } from '../get_document_info/plugin';
import { getSelection } from '../get_selection/plugin';
import { createRectangle } from '../create_rectangle/plugin';

// Export all plugin functions mapped to their command names
export default {
  get_document_info: getDocumentInfo,
  get_selection: getSelection,
  create_rectangle: createRectangle
}; 