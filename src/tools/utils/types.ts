import { z } from "zod";

// Define TypeScript interfaces for Figma responses
export interface FigmaResponse {
  id: string;
  result?: any;
  error?: string;
}

// Tool-related types
export interface ToolDefinition {
  name: string;
  description: string;
  schema: Record<string, z.ZodTypeAny>;
  handler: (params: any) => Promise<{
    content: Array<{
      type: string;
      text?: string;
      data?: string;
      mimeType?: string;
    }>;
    followUp?: {
      tool: string;
      description: string;
    };
  }>;
}

// FigmaCommand type
export type FigmaCommand =
  | 'get_document_info'
  | 'get_selection'
  | 'get_node_info'
  | 'create_rectangle'
  | 'create_frame'
  | 'create_text'
  | 'set_fill_color'
  | 'set_stroke_color'
  | 'move_node'
  | 'resize_node'
  | 'delete_node'
  | 'get_styles'
  | 'get_local_components'
  | 'get_team_components'
  | 'create_component_instance'
  | 'export_node_as_image'
  | 'execute_code'
  | 'join'
  | 'set_corner_radius'; 