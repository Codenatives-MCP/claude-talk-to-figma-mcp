import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "set_stroke_color",
  description: "Set the stroke color of a node in Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to modify"),
    r: z.number().min(0).max(1).describe("Red component (0-1)"),
    g: z.number().min(0).max(1).describe("Green component (0-1)"),
    b: z.number().min(0).max(1).describe("Blue component (0-1)"),
    a: z.number().min(0).max(1).optional().describe("Alpha component (0-1)"),
    weight: z.number().positive().optional().describe("Stroke weight")
  },
  handler: async ({ nodeId, r, g, b, a = 1, weight }) => {
    try {
      const result = await sendCommandToFigma('set_stroke_color', { nodeId, r, g, b, a, weight });
      return {
        content: [
          {
            type: "text",
            text: `Set stroke color of node "${nodeId}" to rgba(${r}, ${g}, ${b}, ${a})${weight ? ` with weight ${weight}` : ''}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error setting stroke color: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;