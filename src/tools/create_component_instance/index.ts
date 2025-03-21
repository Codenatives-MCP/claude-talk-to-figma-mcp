import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { sendCommandToFigma } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "create_component_instance",
  description: "Create an instance of a component in Figma",
  schema: {
    componentKey: z.string().describe("Key of the component to instantiate"),
    x: z.number().describe("X position"),
    y: z.number().describe("Y position")
  },
  handler: async ({ componentKey, x, y }) => {
    try {
      const result = await sendCommandToFigma('create_component_instance', { componentKey, x, y });
      return {
        content: [
          {
            type: "text",
            text: `Created component instance of "${componentKey}" at position (${x}, ${y})`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating component instance: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;