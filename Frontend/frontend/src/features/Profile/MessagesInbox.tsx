import { useState, useEffect, useRef } from "react";
import { getUserConversations, getMessagesByUsers, getProfileById } from '../../shared/config/api';
import { io } from "socket.io-client";
import { BACKEND_URL } from '../../shared/config/backend';
import type { User } from '../../shared/Interface/User';
import defaultUser from '../../assets/user.png';
import "./MessagesInbox.css";

interface Conversation {
  _id: string;
  members: string[];
  updatedAt: string;
}

interface Message {
  from: string;
  text: string;
  createdAt?: string;
}

interface ConversationWithDetails extends Conversation {
  otherUser?: User;
  lastMessage?: Message;
  unreadCount?: number;
}

export default function MessagesInbox({ onClose, currentUserId }: { onClose: () => void; currentUserId: string }) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const socket = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await getUserConversations(currentUserId);
        const convos: Conversation[] = response.data;
        
        // Load details for each conversation
        const conversationsWithDetails = await Promise.all(
          convos.map(async (conv) => {
            const otherUserId = conv.members.find(id => id !== currentUserId);
            if (!otherUserId) return null;

            try {
              // Get other user's profile
              const userResponse = await getProfileById(otherUserId);
              const otherUser = userResponse.data.user;

              // Get last message
              const messagesResponse = await getMessagesByUsers(currentUserId, otherUserId);
              const allMessages = messagesResponse.data;
              const lastMessage = allMessages.length > 0 ? allMessages[allMessages.length - 1] : undefined;

              return {
                ...conv,
                otherUser,
                lastMessage,
                unreadCount: 0 // You can implement unread count logic later
              };
            } catch (error) {
              console.error('Error loading conversation details:', error);
              return null;
            }
          })
        );

        setConversations(conversationsWithDetails.filter(c => c !== null) as ConversationWithDetails[]);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Setup socket for real-time messages
    socket.current = io(BACKEND_URL);
    socket.current.emit("join", currentUserId);

    socket.current.on("getMessage", (data: Message) => {
      // Update messages if viewing this conversation
      if (selectedConversation) {
        const otherUserId = selectedConversation.members.find(id => id !== currentUserId);
        if (data.from === otherUserId || data.from === currentUserId) {
          setMessages(prev => {
            const exists = prev.some(msg => 
              msg.text === data.text && 
              msg.from === data.from &&
              Math.abs(new Date(msg.createdAt || '').getTime() - new Date(data.createdAt || '').getTime()) < 1000
            );
            if (exists) return prev;
            return [...prev, data];
          });
        }
      }

      // Update last message in conversations list
      setConversations(prev => prev.map(conv => {
        const otherUserId = conv.members.find(id => id !== currentUserId);
        if (data.from === otherUserId || data.from === currentUserId) {
          return { ...conv, lastMessage: data };
        }
        return conv;
      }));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currentUserId, selectedConversation]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const otherUserId = selectedConversation.members.find(id => id !== currentUserId);
    if (!otherUserId) return;

    const loadMessages = async () => {
      try {
        const response = await getMessagesByUsers(currentUserId, otherUserId);
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [selectedConversation, currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConversationClick = (conversation: ConversationWithDetails) => {
    setSelectedConversation(conversation);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const otherUserId = selectedConversation.members.find(id => id !== currentUserId);
    if (!otherUserId) return;

    // Send via socket.io
    if (!socket.current) return;
    socket.current.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: otherUserId,
      text: messageText,
    });

    // Update local chat (message will also come back via socket, but this provides immediate feedback)
    setMessages(prev => [...prev, { 
      from: currentUserId, 
      text: messageText, 
      createdAt: new Date().toISOString() 
    }]);
    setMessageText("");
  };

  if (loading) {
    return (
      <div className="messages-inbox-overlay" onClick={onClose}>
        <div className="messages-inbox-container" onClick={(e) => e.stopPropagation()}>
          <div className="messages-inbox-header">
            <h2>Messages</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="loading">Loading conversations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-inbox-overlay" onClick={onClose}>
      <div className="messages-inbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="messages-inbox-header">
          <h2>Messages</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {!selectedConversation ? (
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">No messages yet</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className="conversation-item"
                  onClick={() => handleConversationClick(conv)}
                >
                  <img
                    src={conv.otherUser?.profilePicture?.url || defaultUser}
                    alt={conv.otherUser?.username || 'User'}
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <div className="conversation-name">{conv.otherUser?.fullName || conv.otherUser?.username || 'Unknown User'}</div>
                    <div className="conversation-preview">
                      {conv.lastMessage?.text || 'No messages yet'}
                    </div>
                  </div>
                  <div className="conversation-time">
                    {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="conversation-view">
            <div className="conversation-header">
              <button className="back-btn" onClick={() => setSelectedConversation(null)}>←</button>
              <img
                src={selectedConversation.otherUser?.profilePicture?.url || defaultUser}
                alt={selectedConversation.otherUser?.username || 'User'}
                className="conversation-header-avatar"
              />
              <div className="conversation-header-info">
                <div className="conversation-header-name">
                  {selectedConversation.otherUser?.fullName || selectedConversation.otherUser?.username || 'Unknown User'}
                </div>
                <div className="conversation-header-profession">
                  {selectedConversation.otherUser?.profession || ''}
                </div>
              </div>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">No messages in this conversation</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message-bubble ${msg.from === currentUserId ? 'sent' : 'received'}`}
                  >
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{formatTime(msg.createdAt)}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-container">
              <textarea
                className="message-input-textarea"
                placeholder="Type your message..."
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              ></textarea>
              <button 
                className="message-send-btn" 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


