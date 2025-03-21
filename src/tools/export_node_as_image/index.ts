import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "export_node_as_image",
  description: "Export a node as an image from Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to export"),
    format: z.enum(["PNG", "JPG", "SVG", "PDF"]).optional().describe("Export format"),
    scale: z.number().positive().optional().describe("Export scale")
  },
  handler: async ({ nodeId, format = "PNG", scale = 1 }) => {
    try {
      const result = await sendCommandToFigma('export_node_as_image', { nodeId, format, scale });
      
      // Check if we have an image data result
      if (result && typeof result === 'object' && 'data' in result && 'mimeType' in result) {
        return {
          content: [
            {
              type: "text",
              text: `Exported node "${nodeId}" as ${format} with scale ${scale}`
            }
          ]
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Exported node "${nodeId}" as ${format} with scale ${scale}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error exporting node: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;