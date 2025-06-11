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

// Real-time message handling using WebSocket (alternative to SignalR)
class MessageService {
  private connection: WebSocket | null = null;
  private connectionStatusCallback: ((connected: boolean) => void) | null =
    null;
  private messageCallback: ((message: Message) => void) | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private reconnectDelay = 1000;

  // Initialize WebSocket or polling connection
  public async startConnection(): Promise<void> {
    try {
      // Get the token for authentication
      const token = localStorage.getItem("token");

      // Try to establish WebSocket connection to SignalR hub
      const wsUrl = `wss://go-order.koyeb.app/baseHub?access_token=${encodeURIComponent(
        token || ""
      )}`;

      this.connection = new WebSocket(wsUrl);

      // Set up event handlers
      this.setupEventHandlers();

      console.log("WebSocket connection initiated");
    } catch (error) {
      console.error("Error starting WebSocket connection:", error);
      // Fallback to polling if WebSocket fails
      this.startPolling();
      throw error;
    }
  }

  // Setup event handlers for the WebSocket connection
  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.onopen = (event: Event) => {
      console.log("WebSocket connection opened:", event);
      this.reconnectAttempts = 0;
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback(true);
      }
    };

    this.connection.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);

        // Check if this is a SignalR message for "ReceiveMessage"
        if (
          data.target === "ReceiveMessage" &&
          data.arguments &&
          data.arguments.length > 0
        ) {
          const messageData = data.arguments[0];

          // Transform the received message to our Message format
          const formattedMessage: Message = {
            id: messageData.id || `received-${Date.now()}-${Math.random()}`,
            text: messageData.text || messageData.Text || "",
            senderId: messageData.senderId || messageData.SenderId || "",
            isSender:
              messageData.isSender !== undefined
                ? messageData.isSender
                : messageData.IsSender !== undefined
                ? messageData.IsSender
                : false,
            createdAt:
              messageData.createdAt ||
              messageData.CreatedAt ||
              new Date().toISOString(),
          };

          // Call the message callback if it exists
          if (this.messageCallback) {
            this.messageCallback(formattedMessage);
          }
        }
        // Handle direct message format
        else if (data.id && data.text) {
          const formattedMessage: Message = {
            id: data.id,
            text: data.text,
            senderId: data.senderId || "",
            isSender: data.isSender || false,
            createdAt: data.createdAt || new Date().toISOString(),
          };

          if (this.messageCallback) {
            this.messageCallback(formattedMessage);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.connection.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event);
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback(false);
      }

      // Attempt to reconnect
      this.attemptReconnect();
    };

    this.connection.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback(false);
      }
    };
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    this.reconnectInterval = setTimeout(() => {
      this.startConnection().catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
  }

  // Fallback polling method if WebSocket fails
  private startPolling(): void {
    console.log("Starting polling fallback for real-time messages");
    // This could poll an endpoint for new messages every few seconds
    // For now, we'll just indicate the connection is established via polling
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback(true);
    }
  }

  // Listen for incoming messages
  public onReceiveMessage(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }

  // Listen for connection status changes
  public onConnectionStatusChange(
    callback: (connected: boolean) => void
  ): void {
    this.connectionStatusCallback = callback;
  }

  // Check if connected
  public isConnected(): boolean {
    return this.connection?.readyState === WebSocket.OPEN;
  }

  // Stop the connection
  public async stopConnection(): Promise<void> {
    try {
      if (this.reconnectInterval) {
        clearTimeout(this.reconnectInterval);
        this.reconnectInterval = null;
      }

      if (this.connection) {
        this.connection.close();
        this.connection = null;
        console.log("WebSocket connection stopped");

        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
      }
    } catch (error) {
      console.error("Error stopping WebSocket connection:", error);
    }
  }

  // Send a message through WebSocket (if needed for real-time broadcasting)
  public async sendMessageViaWebSocket(
    chatId: number,
    message: string
  ): Promise<void> {
    if (this.connection && this.isConnected()) {
      try {
        const payload = {
          target: "SendMessage",
          arguments: [chatId, message],
        };
        this.connection.send(JSON.stringify(payload));
        console.log("Message sent via WebSocket");
      } catch (error) {
        console.error("Error sending message via WebSocket:", error);
        throw error;
      }
    } else {
      throw new Error("WebSocket connection is not established");
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
