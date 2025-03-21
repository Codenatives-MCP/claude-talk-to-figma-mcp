import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "move_node",
  description: "Move a node to a new position in Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to move"),
    x: z.number().describe("New X position"),
    y: z.number().describe("New Y position")
  },
  handler: async ({ nodeId, x, y }) => {
    try {
      const result = await sendCommandToFigma('move_node', { nodeId, x, y });
      return {
        content: [
          {
            type: "text",
            text: `Moved node "${nodeId}" to position (${x}, ${y})`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error moving node: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;