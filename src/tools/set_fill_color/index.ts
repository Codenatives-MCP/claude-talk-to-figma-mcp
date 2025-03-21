import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "set_fill_color",
  description: "Set the fill color of a node in Figma can be TextNode or FrameNode",
  schema: {
    nodeId: z.string().describe("The ID of the node to modify"),
    r: z.number().min(0).max(1).describe("Red component (0-1)"),
    g: z.number().min(0).max(1).describe("Green component (0-1)"),
    b: z.number().min(0).max(1).describe("Blue component (0-1)"),
    a: z.number().min(0).max(1).optional().describe("Alpha component (0-1)")
  },
  handler: async ({ nodeId, r, g, b, a = 1 }) => {
    try {
      const result = await sendCommandToFigma('set_fill_color', { nodeId, r, g, b, a });
      return {
        content: [
          {
            type: "text",
            text: `Set fill color of node "${nodeId}" to rgba(${r}, ${g}, ${b}, ${a})`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error setting fill color: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;