import React, { useState, useEffect, useRef } from "react";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import { FaPaperPlane } from "react-icons/fa";
import "../../styles/Messages.css";
import Navbar from "../../components/navbar copy/Navbar";
import {
  getChats,
  getChatMessages,
  sendMessage,
} from "../../service/Messages_service";

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
  // Note: API response has typo "messsages" instead of "messages"
  messsages?: Message[];
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  isSender: boolean;
  createdAt: string;
}

const Messages: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Store messages for each chat to prevent disappearing
  const [chatMessagesCache, setChatMessagesCache] = useState<{
    [chatId: number]: Message[];
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const chatData = await getChats();
      setChats(chatData);
    } catch (error) {
      console.error("Error loading chats:", error);
      setErrorMessage("Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatModal(true);
    setLoadingMessages(true);
    setErrorMessage(null);

    try {
      // Get chat messages using the chat ID
      const chatResponse = await getChatMessages(chat.id);

      let messagesList: Message[] = [];

      // Handle the response structure - match Flutter logic
      if (chatResponse && typeof chatResponse === "object") {
        // If response has messsages array (note the typo in API)
        if (chatResponse.messsages && Array.isArray(chatResponse.messsages)) {
          messagesList = chatResponse.messsages.map(
            (msg: {
              id: string;
              text: string;
              senderId: string;
              isSender: boolean;
              createdAt: string;
            }) => ({
              id: msg.id,
              text: msg.text,
              senderId: msg.senderId,
              isSender: msg.isSender, // true means business sent it
              createdAt: msg.createdAt,
            })
          );
        }
        // If response is a single chat object with messages
        else if (Array.isArray(chatResponse)) {
          const chatData = chatResponse[0];
          if (chatData && chatData.messsages) {
            messagesList = chatData.messsages.map(
              (msg: {
                id: string;
                text: string;
                senderId: string;
                isSender: boolean;
                createdAt: string;
              }) => ({
                id: msg.id,
                text: msg.text,
                senderId: msg.senderId,
                isSender: msg.isSender,
                createdAt: msg.createdAt,
              })
            );
          }
        }
      }

      // Sort messages by timestamp to show oldest first (newest at bottom)
      const sortedMessages = messagesList.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(sortedMessages);
      setChatMessagesCache((prev) => ({
        ...prev,
        [chat.id]: sortedMessages,
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
      setErrorMessage("Failed to load messages");
      setMessages([]);
      setChatMessagesCache((prev) => ({
        ...prev,
        [chat.id]: [],
      }));
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending) return;

    const messageText = newMessage.trim();
    setIsSending(true);
    setNewMessage(""); // Clear input immediately for better UX

    // Create optimistic message - business sending message (isSender: true)
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      senderId: "current_business", // Business is sending
      isSender: true, // Business sent this message
      createdAt: new Date().toISOString(),
    };

    // Add optimistic message to end of array (newest at bottom)
    const updatedMessages = [...messages, optimisticMessage];
    setMessages(updatedMessages);
    setChatMessagesCache((prev) => ({
      ...prev,
      [selectedChat.id]: updatedMessages,
    }));

    try {
      const response = await sendMessage(selectedChat.id, messageText);

      // Replace optimistic message with real message from server
      const finalMessages = updatedMessages.map((msg) =>
        msg.id === optimisticMessage.id
          ? {
              ...response,
              createdAt: response.createdAt || new Date().toISOString(),
            }
          : msg
      );

      // Update messages state and cache
      setMessages(finalMessages);
      setChatMessagesCache((prev) => ({
        ...prev,
        [selectedChat.id]: finalMessages,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error and restore input
      const revertedMessages = messages.filter(
        (m) => m.id !== optimisticMessage.id
      );
      setMessages(revertedMessages);
      setChatMessagesCache((prev) => ({
        ...prev,
        [selectedChat.id]: revertedMessages,
      }));
      setNewMessage(messageText); // Restore message text

      // Show error to user
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseModal = () => {
    setShowChatModal(false);
    setErrorMessage(null);
  };

  const formatTimestamp = (timestamp: string) => {
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

  const getDisplayName = (chat: Chat) => {
    if (chat.customer) {
      return `${chat.customer.firstName} ${chat.customer.lastName}`.trim();
    }
    if (chat.business) {
      return chat.business.businessName;
    }
    return "Unknown";
  };

  const getDisplayAvatar = (chat: Chat) => {
    if (chat.customer?.image) {
      return chat.customer.image;
    }
    if (chat.business?.image) {
      return chat.business.image;
    }
    return "/images/avatar.png";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="messages-page">
        <Sidebar_2
          name="Yaqeen"
          email="yaq24@gmail.com"
          avatarUrl="/images/avatar.png"
        />
        <div className="messages-content">
          <Navbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMessage && !showChatModal) {
    return (
      <div className="messages-page">
        <Sidebar_2
          name="Yaqeen"
          email="yaq24@gmail.com"
          avatarUrl="/images/avatar.png"
        />
        <div className="messages-content">
          <Navbar />
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{errorMessage}</p>
            <button className="retry-button" onClick={loadChats}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <Sidebar_2
        name="Yaqeen"
        email="yaq24@gmail.com"
        avatarUrl="/images/avatar.png"
      />

      <div className="messages-content">
        <Navbar />

        <h2 className="messages-title">Messages</h2>

        {chats.length === 0 ? (
          <div className="no-chats">
            <div className="no-chats-icon">💬</div>
            <p>No chats available</p>
            <button className="refresh-button" onClick={loadChats}>
              Refresh
            </button>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              className="review-card chat-card"
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              style={{ cursor: "pointer" }}
            >
              <div className="review-card-header">
                <div className="review-card-left">
                  <img
                    src={getDisplayAvatar(chat)}
                    alt={`${getDisplayName(chat)} avatar`}
                    className="reviewer-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/avatar.png";
                    }}
                  />
                  <div>
                    <h3 className="reviewer-name">{getDisplayName(chat)}</h3>
                    <p className="review-date">
                      {chat.customer?.email ||
                        chat.business?.phoneNumber ||
                        "No contact info"}
                    </p>
                    {chat.customer?.phoneNumber && (
                      <p className="phone-number">
                        {chat.customer.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="chat-indicator">
                  <span className="chat-badge">
                    Chat{" "}
                    {chatMessagesCache[chat.id]?.length > 0 &&
                      `(${chatMessagesCache[chat.id].length})`}
                  </span>
                </div>
              </div>
              <p className="review-text">
                {chatMessagesCache[chat.id]?.length > 0
                  ? `${chatMessagesCache[chat.id].length} message${
                      chatMessagesCache[chat.id].length !== 1 ? "s" : ""
                    }`
                  : "Click to open chat conversation"}
              </p>
            </div>
          ))
        )}

        {/* Chat Modal */}
        {showChatModal && selectedChat && (
          <div className="chat-modal-overlay" onClick={handleCloseModal}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
              <div className="chat-header">
                <div className="chat-header-info">
                  <img
                    src={getDisplayAvatar(selectedChat)}
                    alt={`${getDisplayName(selectedChat)} avatar`}
                    className="chat-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/avatar.png";
                    }}
                  />
                  <div>
                    <h3 className="chat-name">
                      {getDisplayName(selectedChat)}
                    </h3>
                    <p className="chat-email">
                      {selectedChat.customer?.email ||
                        selectedChat.business?.phoneNumber}
                    </p>
                    {selectedChat.customer?.phoneNumber && (
                      <p className="chat-phone">
                        {selectedChat.customer.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <button className="chat-close-btn" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <div className="chat-messages">
                {loadingMessages ? (
                  <div className="loading-messages">
                    <div className="loading-spinner-small"></div>
                    <p>Loading messages...</p>
                  </div>
                ) : errorMessage ? (
                  <div className="error-messages">
                    <div className="error-icon">⚠️</div>
                    <p>{errorMessage}</p>
                    <button
                      className="retry-small-button"
                      onClick={() => handleChatSelect(selectedChat)}
                    >
                      Retry
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">
                    <div className="no-messages-icon">💬</div>
                    <p>No messages yet</p>
                    <p className="no-messages-subtitle">
                      Start a conversation with {getDisplayName(selectedChat)}
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      // isSender true means business sent it (like Flutter logic)
                      const isBusinessMessage = message.isSender;

                      return (
                        <div
                          key={message.id || `message-${index}`}
                          className={`message ${
                            isBusinessMessage ? "sent" : "received"
                          }`}
                        >
                          <div className="message-content">
                            <p className="message-text">{message.text}</p>
                            <span className="message-time">
                              {formatTimestamp(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className={`send-button ${isSending ? "sending" : ""}`}
                  disabled={isSending || !newMessage.trim()}
                  title={isSending ? "Sending..." : "Send message"}
                >
                  {isSending ? (
                    <div className="sending-spinner"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
