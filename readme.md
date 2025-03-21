# Cursor/Claude Desktop Figma MCP

This project implements a Model Context Protocol (MCP) integration between Cursor/Claude Desktop and Figma, allowing the client agent to communicate programmatically with Figma for reading and modifying designs.

https://github.com/user-attachments/assets/129a14d2-ed73-470f-9a4c-2240b2a4885c

## Project Structure

- `src/talk_to_figma_mcp/` - TypeScript MCP server for Figma integration from client-end
- `src/cursor_mcp_plugin/` - Figma plugin for communicating with Cursor/Claude Desktop through the MCP server
- `src/tools/` - All available tool definitions and associated functions
- `src/socket.ts` - WebSocket server that facilitates communication between the MCP server and Figma plugin

## Capabilities

The MCP server provides the agent with tool descriptions detailing the available interactions with Figma. The agent will provide this to the LLM to have it determine whether any tools need to be called. The suggested tools are then called by the agent and executed through the server.

The Figma plugin executes the functions and API commands that are associated with the tools and returns their results to the client through the MCP server. Using the current set of available tools, you can create, delete, and fetch information about different elements, set styling parameters, organize layouts, and manage components and styles.

Here is the list of currently available tools: 

- `join_channel` - Join a specific channel to communicate with Figma
- `get_document_info` - Get information about the current Figma document
- `get_selection` - Get information about the current selection
- `get_node_info` - Get detailed information about a specific node
- `create_rectangle` - Create a new rectangle with position, size, and optional name
- `create_frame` - Create a new frame with position, size, and optional name
- `create_text` - Create a new text node with customizable font properties
- `set_fill_color` - Set the fill color of a node (RGBA)
- `set_stroke_color` - Set the stroke color and weight of a node
- `set_corner_radius` - Set the corner radius of a node with optional per-corner control
- `move_node` - Move a node to a new position
- `resize_node` - Resize a node with new dimensions
- `delete_node` - Delete a node
- `get_styles` - Get information about local styles
- `get_local_components` - Get information about local components
- `get_team_components` - Get information about team components
- `create_component_instance` - Create an instance of a component
- `export_node_as_image` - Export a node as an image (PNG, JPG, SVG, or PDF)

## Installation

Ensure that you have the Cursor/Claude Desktop client application and the Figma desktop application installed, up-to-date, and signed in with sufficient access for MCP/development plugin setup.

[Cursor](https://github.com/oslook/cursor-ai-downloads) / [Claude Desktop](https://claude.ai/download) / [Figma](https://www.figma.com/downloads/)

1. Clone/Download repository from [here.](https://github.com/Codenatives-MCP/claude-talk-to-figma-mcp)
2. If your system does not have **bun**, install it using `curl -fsSL https://bun.sh/install | bash` in MacOS/Linux or `npm install -g bun` in Windows.
3. Run `bun install` in MCP directory to configure the necessary libraries. **\***
4. Add MCP server startup command to client config JSON: **\***
    - For Cursor, go to Cursor Settings > MCP > Add new global MCP server.
    - For Claude Desktop, go to File > Settings > Developer > Edit Config.
    - The config file should look like this for MacOS/Linux where **{PWD}** is the repository directory:
    ```json
    {
        "mcpServers": {
            # Any other previously used servers can be seen here
            ...
            "TalkToFigma": {
                "command": "bun",
                "args": [
                    "{PWD}/src/talk_to_figma_mcp/server.ts"
                ]
            },
            ...
        }
    }
    ```
    - The config file on Windows will be the same except that the filepath should have double backward slashes so that it is correctly interpreted by the Windows shell.

5. Connect the Figma plugin from the desktop app:
    - On a Figma file, go to the top-left icon > Plugins > Development > Import plugin from manifest.
    - Select `src/cursor_mcp_plugin/manifest.json` from the repository directory.

6. Check if the MCP tools are available in Cursor Settings/Claude chat, which may involve restarting the client (it's OK for now if there is an error showing that "Client is closed" or "Disconnected/Failed" as the WebSocket server has not yet started). If they are present, you have successfully connected the client to the MCP server.

<small>**\*** If you are using Cursor, you can skip these steps by running `bun setup` or `./scripts/setup.sh` in the repository directory. However, the MCP server access will be limited to that directory when opened by Cursor.</small> 

### Common Issues:
- Check if **npm** and/or **bun** are correctly installed and usable on a fresh shell. Try restarting the client if this issue remains.
- Check that there is no issue with the formatting of the config JSON and you have correctly set up the new server (commands and arguments **within** the MCP server name **within** "mcpServers").
- Check that the filepath is valid and correctly formatted as a string with single forward slashes (**/**) for MacOS/Linux and double backward slashes (**\\\\**) for Windows.
- Check that the commands given are correct. On Windows, try changing the command to ```cmd``` and adding two arguments (```/c``` and ```bun```) before the filepath. This will open a command prompt window which you should not close.

## Usage

1. Run ```bun start``` or ```bun run src/socket.ts``` from the repository directory to activate the WebSocket server.
2. Ensure that Cursor/Claude Desktop is connected to the MCP server. At this point, it should be showing that it has successfully connected and all the tools are available.
3. On the Figma file you would like to access, go to the top-left icon > Plugins > Development > Manage plugins in development, and select the 'Cursor MCP Plugin' to connect to the WebSocket server.
4.  Include the channel name from the Figma plugin window in the prompt for the client agent. Eg. "Talk to Figma using channel abcdef1".
5. Describe what you want to design as a prompt to Cursor/Claude Desktop and observe the changes it makes to your Figma file.

### Common Issues

- If the WebSocket server is unable to start, check if there are any services running on the specified port (3055) and end them before retrying.
- If the MCP server is down but the tools are/were previously available, try restarting the client and possibly shutting down any active services on the server port.

## Development

### Editing Existing Tools

Navigate to the directory of the tool you wish to update and edit the `plugin.js` file to change the operation of the tool. If there are any changes to the tool definition, such as descriptions, input parameters, return formats, etc. then modify `index.ts` with any necessary updates.

### Building New Tools

1. Navigate to the tools directory:

   ```
   cd src/tools
   ```

2. Create a new directory with the tool name and add an `index.ts` and `plugin.js` file.

3. Define the tool parameters and any return format in `index.ts`.

4. Program the tool's functions and commands in `plugin.js`.

5. Import the new tool into the index files - `mcp-defs.ts` and `plugin-handlers.js`.

6. Upon restarting the server and the client, the new tool should be visible.

## Best Practices

When working with the Figma MCP:

1. Always join a channel before sending commands
2. Get document overview using `get_document_info` first
3. Check current selection with `get_selection` before modifications
4. Use appropriate creation tools based on needs:
   - `create_frame` for containers
   - `create_rectangle` for basic shapes
   - `create_text` for text elements
5. Verify changes using `get_node_info`
6. Use component instances when possible for consistency
7. Handle errors appropriately as all commands can throw exceptions

## License

MIT
