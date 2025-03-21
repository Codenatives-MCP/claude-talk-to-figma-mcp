import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "create_text",
  description: "Create a new text element in Figma",
  schema: {
    x: z.number().describe("X position"),
    y: z.number().describe("Y position"),
    text: z.string().describe("Text content"),
    fontSize: z.number().optional().describe("Font size (default: 14)"),
    fontWeight: z.number().optional().describe("Font weight (e.g., 400 for Regular, 700 for Bold)"),
    fontColor: z.object({
      r: z.number().min(0).max(1).describe("Red component (0-1)"),
      g: z.number().min(0).max(1).describe("Green component (0-1)"),
      b: z.number().min(0).max(1).describe("Blue component (0-1)"),
      a: z.number().min(0).max(1).optional().describe("Alpha component (0-1)")
    }).optional().describe("Font color in RGBA format"),
    name: z.string().optional().describe("Optional name for the text node (default follows text)"),
    parentId: z.string().optional().describe("Optional parent node ID to append the text to")
  },
  handler: async ({ x, y, text, fontSize, fontWeight, fontColor, name, parentId }) => {
    try {
      const result = await sendCommandToFigma('create_text', {
        x, y, text, fontSize: fontSize || 14, fontWeight: fontWeight || 400, 
        fontColor: fontColor || { r: 0, g: 0, b: 0, a: 1 }, 
        name: name || text.substring(0, 20), parentId
      });
      return {
        content: [
          {
            type: "text",
            text: `Created text "${JSON.stringify(result)}"`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating text: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;
