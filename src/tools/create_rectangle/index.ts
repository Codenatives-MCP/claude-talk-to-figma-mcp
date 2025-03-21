import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "create_rectangle",
  description: "Create a new rectangle in Figma",
  schema: {
    x: z.number().describe("X position"),
    y: z.number().describe("Y position"),
    width: z.number().describe("Width of the rectangle"),
    height: z.number().describe("Height of the rectangle"),
    name: z.string().optional().describe("Optional name for the rectangle"),
    parentId: z.string().optional().describe("Optional parent node ID to append the rectangle to")
  },
  handler: async ({ x, y, width, height, name, parentId }) => {
    try {
      const result = await sendCommandToFigma('create_rectangle', {
        x, y, width, height, name: name || 'Rectangle', parentId
      });
      return {
        content: [
          {
            type: "text",
            text: `Created rectangle "${JSON.stringify(result)}"`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating rectangle: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;