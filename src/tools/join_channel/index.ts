import { z } from "zod";
import { ToolDefinition } from "../utils/types";
import { joinChannel } from "../utils/websocket";

const tool: ToolDefinition = {
  name: "join_channel",
  description: "Join a specific channel to communicate with Figma",
  schema: {
    channel: z.string().describe("The name of the channel to join").default("")
  },
  handler: async ({ channel }) => {
    try {
      if (!channel) {
        // If no channel provided, ask the user for input
        return {
          content: [
            {
              type: "text",
              text: "Please provide a channel name to join:"
            }
          ],
          followUp: {
            tool: "join_channel",
            description: "Join the specified channel"
          }
        };
      }

      await joinChannel(channel);
      return {
        content: [
          {
            type: "text",
            text: `Successfully joined channel: ${channel}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error joining channel: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

export default tool;