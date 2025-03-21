/**
 * Join a specific channel to communicate with Figma
 * @param {Object} params - Channel parameters
 * @param {string} params.channel - The name of the channel to join
 * @returns {Promise<Object>} Channel join status
 */
export async function joinChannel(params = {}) {
  const { channel = "" } = params;
  
  // For the client-side implementation, we'll just set a property in figma.clientStorage
  // that the UI can check to determine which channel to join
  try {
    await figma.clientStorage.setAsync("activeChannel", channel);
    
    // Notify the UI about the channel change
    figma.ui.postMessage({
      type: "join-channel",
      channel: channel
    });
    
    return {
      success: true,
      channel: channel,
      message: `Set active channel to: ${channel || "default"}`
    };
  } catch (error) {
    console.error("Error joining channel:", error);
    throw new Error(`Failed to join channel: ${error.message}`);
  }
} 