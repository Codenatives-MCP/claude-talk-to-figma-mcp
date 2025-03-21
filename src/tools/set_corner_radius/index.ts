import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "set_corner_radius",
  description: "Set the corner radius of a node in Figma",
  schema: {
    nodeId: z.string().describe("The ID of the node to modify"),
    radius: z.number().min(0).describe("Corner radius value"),
    corners: z.array(z.boolean()).length(4).optional().describe("Optional array of 4 booleans to specify which corners to round [topLeft, topRight, bottomRight, bottomLeft]")
  },
  handler: async ({ nodeId, radius, corners }) => {
    try {
      const result = await sendCommandToFigma('set_corner_radius', { nodeId, radius, corners });
      
      let message = `Set corner radius of node "${nodeId}" to ${radius}px`;
      if (corners) {
        const cornerNames = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
        const roundedCorners = corners
          .map((isRounded: boolean, index: number) => isRounded ? cornerNames[index] : null)
          .filter(Boolean)
          .join(', ');
        
        message += ` for corners: ${roundedCorners}`;
      }
      
      return {
        content: [
          {
            type: "text",
            text: message
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error setting corner radius: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;
