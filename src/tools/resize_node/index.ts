import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "resize_node",
  description: "Resize a node in Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to resize"),
    width: z.number().positive().describe("New width"),
    height: z.number().positive().describe("New height")
  },
  handler: async ({ nodeId, width, height }) => {
    try {
      const result = await sendCommandToFigma('resize_node', { nodeId, width, height });
      return {
        content: [
          {
            type: "text",
            text: `Resized node "${nodeId}" to ${width}x${height}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error resizing node: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;