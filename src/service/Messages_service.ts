import axiosInstance from "../api/api";

// Types for the chat functionality - matching Flutter structure
interface Chat {
  id: number;
  adminConversation: boolean;
  businessId: string;
  customerId: string;
  business?: {
    id: string;
    businessName: string;
    image: string;
    phoneNumber: string;
    bankAccountNumber: string;
    address: string;
  };
  customer?: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    image: string;
  };
  // Note: API has typo "messsages" instead of "messages"
  messsages?: Message[];
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  isSender: boolean;
  createdAt: string;
}

interface SendMessageRequest {
  text: string;
}

// Type for chat response from API
interface ChatResponse {
  id: number;
  adminConversation: boolean;
  businessId: string;
  customerId: string;
  business?: Chat["business"];
  customer?: Chat["customer"];
  messsages?: Message[];
}

// Type for API message response
interface ApiMessageResponse {
  id?: string;
  text?: string;
  senderId?: string;
  isSender?: boolean;
  createdAt?: string;
}

// Type for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// Get all chats - matching Flutter implementation
export const getChats = async (skip: number = 0): Promise<Chat[]> => {
  try {
    console.log("Fetching chats...");
    const response = await axiosInstance.get(`/api/Business/chat?skip=${skip}`);
    console.log("Chats response status:", response.status);
    console.log("Chats response data:", response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to load chats: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw new Error(`Error loading chats: ${error}`);
  }
};

// Get messages for a specific chat - matching Flutter implementation
export const getChatMessages = async (
  chatId: number
): Promise<ChatResponse> => {
  try {
    console.log(`Fetching chat messages for chatId: ${chatId}`);
    const response = await axiosInstance.get(`/api/Business/chat/${chatId}`);
    console.log("Chat response status:", response.status);
    console.log("Chat response body:", response.data);

    if (response.status === 200) {
      const chatData = response.data;

      // Handle both array and single object responses (like Flutter)
      let chat: ChatResponse;
      if (Array.isArray(chatData) && chatData.length > 0) {
        chat = chatData[0] as ChatResponse;
      } else if (chatData && typeof chatData === "object") {
        chat = chatData as ChatResponse;
      } else {
        console.log("Unexpected chat data format:", chatData);
        throw new Error("Unexpected response format");
      }

      console.log("Chat info loaded, keys:", Object.keys(chat));

      // Return the full chat object so we can extract messages
      return chat;
    } else {
      throw new Error(`Failed to load chat: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw new Error(`Error loading chat: ${error}`);
  }
};

// Send a message to a specific chat - matching Flutter implementation
export const sendMessage = async (
  chatId: number,
  text: string
): Promise<Message> => {
  try {
    console.log(`Sending message to chatId: ${chatId}, text: ${text}`);

    const requestData: SendMessageRequest = { text };
    const response = await axiosInstance.post(
      `/api/Business/chat/${chatId}`,
      requestData
    );

    console.log("Send message response status:", response.status);
    console.log("Send message response:", response.data);

    if (response.status === 200 || response.status === 201) {
      // Message sent successfully
      const messageData = response.data as ApiMessageResponse;

      // If the API returns the sent message, use it
      if (messageData && messageData.id && messageData.text) {
        return {
          id: messageData.id,
          text: messageData.text,
          senderId: messageData.senderId || "current_business",
          isSender:
            messageData.isSender !== undefined ? messageData.isSender : true,
          createdAt: messageData.createdAt || new Date().toISOString(),
        };
      }

      // If API doesn't return complete message data, create a proper response
      return {
        id: messageData.id || `sent-${Date.now()}-${Math.random()}`,
        text: text,
        senderId: "current_business",
        isSender: true, // Business is sending
        createdAt: messageData.createdAt || new Date().toISOString(),
      };
    } else {
      throw new Error(`Failed to send message: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error(`Error sending message: ${error}`);
  }
};

// Real-time message handling using WebSocket or SignalR
// Note: This would typically connect to a SignalR hub for real-time updates
class MessageService {
  private connection: unknown = null;

  // Initialize real-time connection (if using SignalR)
  public async startConnection(): Promise<void> {
    try {
      // This would be implemented with SignalR connection
      // For now, we'll use polling or manual refresh
      console.log("Real-time connection started");
    } catch (error) {
      console.error("Error starting connection:", error);
    }
  }

  // Listen for incoming messages
  public onReceiveMessage(callback: (message: Message) => void): void {
    // This would set up the SignalR listener for "ReceiveMessage"
    if (
      this.connection &&
      typeof this.connection === "object" &&
      this.connection !== null
    ) {
      // Type assertion for connection with 'on' method (SignalR-like)
      const signalRConnection = this.connection as {
        on: (event: string, callback: (message: Message) => void) => void;
      };
      signalRConnection.on("ReceiveMessage", callback);
    }
  }

  // Stop the connection
  public async stopConnection(): Promise<void> {
    try {
      if (
        this.connection &&
        typeof this.connection === "object" &&
        this.connection !== null
      ) {
        // Type assertion for connection with 'stop' method (SignalR-like)
        const signalRConnection = this.connection as {
          stop: () => Promise<void>;
        };
        await signalRConnection.stop();
        this.connection = null;
      }
    } catch (error) {
      console.error("Error stopping connection:", error);
    }
  }
}

export const messageService = new MessageService();

// Utility functions - matching Flutter implementation
export const formatMessageDate = (dateString: string): string => {
  try {
    const dateTime = new Date(dateString);
    const now = new Date();
    const difference = now.getTime() - dateTime.getTime();
    const daysDiff = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(difference / (1000 * 60 * 60));

    if (daysDiff > 0) {
      return dateTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hoursDiff > 0) {
      return dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    // Removed unused 'e' parameter
    return "";
  }
};

export const getDisplayName = (chat: Chat): string => {
  if (chat.customer) {
    const fullName = `${chat.customer.firstName || ""} ${
      chat.customer.lastName || ""
    }`.trim();
    return fullName || "Unknown Customer";
  }
  if (chat.business) {
    return chat.business.businessName || "Unknown Business";
  }
  return "Unknown User";
};

export const getDisplayAvatar = (chat: Chat): string => {
  if (chat.customer?.image && chat.customer.image.trim() !== "") {
    return chat.customer.image;
  }
  if (chat.business?.image && chat.business.image.trim() !== "") {
    return chat.business.image;
  }
  return "/images/avatar.png";
};

// Error handling utility - matching Flutter error handling approach
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response: {
        status: number;
        data?: ApiErrorResponse;
      };
    };

    // Server responded with error status
    const status = axiosError.response.status;
    const message =
      axiosError.response.data?.message || axiosError.response.data?.error;

    if (status === 401) {
      return "Authentication failed. Please login again.";
    } else if (status === 403) {
      return "Access denied. You don't have permission.";
    } else if (status === 404) {
      return "Chat not found.";
    } else if (status >= 500) {
      return "Server error. Please try again later.";
    } else if (message) {
      return message;
    } else {
      return `Error: ${status}`;
    }
  } else if (error && typeof error === "object" && "request" in error) {
    // Request was made but no response received
    return "Network error. Please check your connection.";
  } else {
    // Something else happened
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage || "An unexpected error occurred.";
  }
};

// Additional utility function to match Flutter's timestamp formatting
export const formatTimestamp = (timestamp: string): string => {
  try {
    const dateTime = new Date(timestamp);
    const now = new Date();
    const difference = now.getTime() - dateTime.getTime();
    const daysDiff = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(difference / (1000 * 60 * 60));

    if (daysDiff > 0) {
      return dateTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hoursDiff > 0) {
      return dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    // Removed unused 'e' parameter
    return "";
  }
};

// Helper function to extract messages from chat response
export const extractMessagesFromChat = (
  chatResponse: ChatResponse | ChatResponse[]
): Message[] => {
  if (!chatResponse) return [];

  // Handle the API response structure with "messsages" (note the typo)
  let messages: Message[] = [];

  if (
    !Array.isArray(chatResponse) &&
    chatResponse.messsages &&
    Array.isArray(chatResponse.messsages)
  ) {
    messages = chatResponse.messsages;
  } else if (Array.isArray(chatResponse)) {
    // If response is array of chats, get first chat's messages
    const firstChat = chatResponse[0];
    if (firstChat && firstChat.messsages) {
      messages = firstChat.messsages;
    }
  }

  // Convert API messages to our format and sort by timestamp (oldest first)
  return messages
    .map((msg: Message) => ({
      id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      text: msg.text || "",
      senderId: msg.senderId || "",
      isSender: msg.isSender || false,
      createdAt: msg.createdAt || new Date().toISOString(),
    }))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
};
