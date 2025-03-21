import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "delete_node",
  description: "Delete a node from Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to delete")
  },
  handler: async ({ nodeId }) => {
    try {
      const result = await sendCommandToFigma('delete_node', { nodeId });
      return {
        content: [
          {
            type: "text",
            text: `Deleted node "${nodeId}"`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting node: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;
