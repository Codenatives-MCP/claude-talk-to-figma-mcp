import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { FigmaCommand } from './types';

// WebSocket connection and request tracking
let ws: WebSocket | null = null;
const pendingRequests = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeout: NodeJS.Timeout;
}>();

// Track which channel each client is in
let currentChannel: string | null = null;

// Simple function to connect to Figma WebSocket server
export function connectToFigma(port: number = 3055) {
  // If already connected, do nothing
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.info('Already connected to Figma');
    return;
  }

  console.info(`Connecting to Figma socket server on port ${port}...`);
  ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', () => {
    console.info('Connected to Figma socket server');
    // Reset channel on new connection
    currentChannel = null;
  });

  ws.on('message', (data: any) => {
    try {
      const json = JSON.parse(data) as { message: any };
      const myResponse = json.message;
      console.debug(`Received message: ${JSON.stringify(myResponse)}`);
      console.log('myResponse', myResponse);

      // Handle response to a request
      if (myResponse.id && pendingRequests.has(myResponse.id) && myResponse.result) {
        const request = pendingRequests.get(myResponse.id)!;
        clearTimeout(request.timeout);

        if (myResponse.error) {
          console.error(`Error from Figma: ${myResponse.error}`);
          request.reject(new Error(myResponse.error));
        } else {
          if (myResponse.result) {
            request.resolve(myResponse.result);
          }
        }

        pendingRequests.delete(myResponse.id);
      } else {
        // Handle broadcast messages or events
        console.info(`Received broadcast message: ${JSON.stringify(myResponse)}`);
      }
    } catch (error) {
      console.error(`Error parsing message: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  ws.on('error', (error) => {
    console.error(`Socket error: ${error}`);
  });

  ws.on('close', () => {
    console.info('Disconnected from Figma socket server');
    ws = null;

    // Reject all pending requests
    for (const [id, request] of pendingRequests.entries()) {
      clearTimeout(request.timeout);
      request.reject(new Error('Connection closed'));
      pendingRequests.delete(id);
    }

    // Attempt to reconnect
    console.info('Attempting to reconnect in 2 seconds...');
    setTimeout(() => connectToFigma(port), 2000);
  });
}

// Function to join a channel
export async function joinChannel(channelName: string): Promise<void> {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Not connected to Figma');
  }

  try {
    await sendCommandToFigma('join', { channel: channelName });
    currentChannel = channelName;
    console.info(`Joined channel: ${channelName}`);
  } catch (error) {
    console.error(`Failed to join channel: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Function to send commands to Figma
export function sendCommandToFigma(command: FigmaCommand, params: unknown = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    // If not connected, try to connect first
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connectToFigma();
      reject(new Error('Not connected to Figma. Attempting to connect...'));
      return;
    }

    // Check if we need a channel for this command
    const requiresChannel = command !== 'join';
    if (requiresChannel && !currentChannel) {
      reject(new Error('Must join a channel before sending commands'));
      return;
    }

    const id = uuidv4();
    const request = {
      id,
      type: command === 'join' ? 'join' : 'message',
      ...(command === 'join' ? { channel: (params as any).channel } : { channel: currentChannel }),
      message: {
        id,
        command,
        params: {
          ...(params as any),
        }
      }
    };

    // Set timeout for request
    const timeout = setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        console.error(`Request ${id} to Figma timed out after 30 seconds`);
        reject(new Error('Request to Figma timed out'));
      }
    }, 30000); // 30 second timeout

    // Store the promise callbacks to resolve/reject later
    pendingRequests.set(id, { resolve, reject, timeout });

    // Send the request
    console.info(`Sending command to Figma: ${command}`);
    console.debug(`Request details: ${JSON.stringify(request)}`);
    ws.send(JSON.stringify(request));
  });
}

// Helper function to process Figma node responses
export function processFigmaNodeResponse(result: unknown): any {
  if (!result || typeof result !== 'object') {
    return result;
  }

  // Check if this looks like a node response
  const resultObj = result as Record<string, unknown>;
  if ('id' in resultObj && typeof resultObj.id === 'string') {
    // It appears to be a node response, log the details
    console.info(`Processed Figma node: ${resultObj.name || 'Unknown'} (ID: ${resultObj.id})`);

    if ('x' in resultObj && 'y' in resultObj) {
      console.debug(`Node position: (${resultObj.x}, ${resultObj.y})`);
    }

    if ('width' in resultObj && 'height' in resultObj) {
      console.debug(`Node dimensions: ${resultObj.width}×${resultObj.height}`);
    }
  }

  return result;
} 