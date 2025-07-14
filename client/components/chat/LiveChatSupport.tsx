import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  MapPin,
  Clock,
  ShoppingBag,
  CreditCard,
  FileText,
  Camera,
  Mic,
  Image,
  Bot,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  agent?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: "online" | "busy" | "offline";
  rating: number;
}

interface LiveChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChatSupport: React.FC<LiveChatSupportProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<ChatAgent | null>(null);
  const [chatStatus, setChatStatus] = useState<
    "waiting" | "connected" | "ended"
  >("waiting");
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [quickActions, setQuickActions] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [attachmentMenu, setAttachmentMenu] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents: ChatAgent[] = [
    {
      id: "1",
      name: "Priya Sharma",
      avatar: "����‍💼",
      role: "Beauty Consultant",
      status: "online",
      rating: 4.9,
    },
    {
      id: "2",
      name: "Rahul Verma",
      avatar: "👨‍💼",
      role: "Booking Specialist",
      status: "online",
      rating: 4.8,
    },
    {
      id: "3",
      name: "Anita Patel",
      avatar: "👩‍🎨",
      role: "Service Expert",
      status: "busy",
      rating: 4.9,
    },
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simulate connecting to an agent
      setTimeout(() => {
        const agent = agents.find((a) => a.status === "online") || agents[0];
        setCurrentAgent(agent);
        setChatStatus("connected");

        // Add welcome messages
        const welcomeMessages: Message[] = [
          {
            id: "1",
            type: "system",
            content: `Connected with ${agent.name}`,
            timestamp: new Date(),
          },
          {
            id: "2",
            type: "agent",
            content: `Hi ${
              user?.name || "there"
            }! 👋 I'm ${agent.name}, your beauty consultant. How can I help you today?`,
            timestamp: new Date(),
            agent,
          },
          {
            id: "3",
            type: "agent",
            content:
              "I can help you with:\n• Service recommendations\n• Booking appointments\n• Pricing information\n• Salon locations\n• Special offers",
            timestamp: new Date(Date.now() + 1000),
            agent,
          },
        ];

        setMessages(welcomeMessages);
      }, 2000);
    }
  }, [isOpen, user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage.trim(),
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate agent response
    setTimeout(
      () => {
        setIsTyping(false);
        const agentResponse = generateAgentResponse(newMessage.trim());
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "agent",
          content: agentResponse,
          timestamp: new Date(),
          agent: currentAgent || undefined,
        };
        setMessages((prev) => [...prev, agentMessage]);
      },
      1000 + Math.random() * 2000,
    );
  };

  const generateAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Update suggested replies based on context
    if (lowerMessage.includes("book") || lowerMessage.includes("appointment")) {
      setSuggestedReplies([
        "Show me bridal packages",
        "I need hair services",
        "What's available today?",
      ]);
      return "I'd be happy to help you book an appointment! 📅 What type of service are you interested in? I can check availability and pricing for you.";
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost")
    ) {
      setSuggestedReplies([
        "Hair services pricing",
        "Bridal package cost",
        "Compare prices",
      ]);
      return "Great question about pricing! 💰 Our services range from ₹500 for basic treatments to ₹8000+ for premium packages. Which specific service would you like pricing for?";
    } else if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("near")
    ) {
      setSuggestedReplies([
        "Bandra location",
        "Show on map",
        "Home service available?",
      ]);
      return "We have multiple locations across Mumbai! 📍 I can help you find the closest salon to you. Could you share your area or preferred location?";
    } else if (
      lowerMessage.includes("bridal") ||
      lowerMessage.includes("wedding")
    ) {
      setSuggestedReplies([
        "Book bridal trial",
        "See bridal gallery",
        "Package details",
      ]);
      return "Congratulations on your upcoming wedding! 👰 Our bridal packages include makeup, hair styling, mehendi, and pre-bridal treatments. Would you like to see our complete bridal package?";
    } else if (
      lowerMessage.includes("thanks") ||
      lowerMessage.includes("thank")
    ) {
      setSuggestedReplies(["Book appointment", "Get directions", "See offers"]);
      return "You're very welcome! 😊 Is there anything else I can help you with today?";
    } else if (lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      setSuggestedReplies([
        "Book appointment",
        "View services",
        "Find location",
      ]);
      return "Hello! 👋 I'm here to help you with all your beauty needs. What would you like to know more about?";
    } else {
      setSuggestedReplies([
        "I need help booking",
        "Show me prices",
        "Find nearest salon",
      ]);
      return "I understand! Let me help you with that. Could you provide a bit more detail so I can give you the best recommendation? 💡";
    }
  };

  const endChat = () => {
    setChatStatus("ended");
    const endMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: "Chat session ended. Thank you for contacting us!",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, endMessage]);
  };

  const submitFeedback = (rating: number) => {
    setSatisfaction(rating);
    const feedbackMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: `Thank you for your ${rating}-star feedback! Your input helps us improve our service.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, feedbackMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-sm">Live Support</h3>
            {currentAgent && (
              <div className="flex items-center gap-1 text-xs text-rose-100">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                {currentAgent.name}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {currentAgent && chatStatus === "connected" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
              >
                <Video className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions && chatStatus === "connected" && (
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuickActions(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8"
              onClick={() => setNewMessage("I want to book an appointment")}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Book Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8"
              onClick={() => setNewMessage("Show me service prices")}
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Pricing
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8"
              onClick={() => setNewMessage("Find salon near me")}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Locations
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8"
              onClick={() => setNewMessage("Tell me about bridal packages")}
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Packages
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatStatus === "waiting" && (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">
              Connecting you with an agent...
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] ${message.type === "system" ? "w-full text-center" : ""}`}
            >
              {message.type === "system" && (
                <div className="text-xs text-gray-500 py-2 px-3 bg-gray-100 rounded-lg">
                  {message.content}
                </div>
              )}

              {message.type === "agent" && message.agent && (
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-xs">
                    {message.agent.avatar}
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">
                      {message.agent.name}
                    </div>
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-tl-sm whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                  </div>
                </div>
              )}

              {message.type === "user" && (
                <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white p-3 rounded-lg rounded-tr-sm text-sm">
                  {message.content}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {message.type === "user" && message.status && (
                  <span className="ml-1">
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && "✓✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-xs">
                {currentAgent?.avatar}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Replies */}
        {suggestedReplies.length > 0 && chatStatus === "connected" && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Suggested:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewMessage(reply);
                    setSuggestedReplies([]);
                  }}
                  className="text-xs h-6 px-2"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Feedback Section */}
      {chatStatus === "ended" && satisfaction === null && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">How was your experience?</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={() => submitFeedback(rating)}
                className="h-8 w-8 p-0 hover:bg-yellow-100"
              >
                <Star className="h-4 w-4 text-yellow-500" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      {chatStatus === "connected" && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAttachmentMenu(!attachmentMenu)}
                className="h-9 w-9 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Attachment Menu */}
              {attachmentMenu && (
                <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 space-y-1 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <Camera className="h-3 w-3 mr-2" />
                    Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    Document
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    Location
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              />
            </div>

            <Button
              onClick={() => setIsRecording(!isRecording)}
              className={`h-9 w-9 p-0 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 h-9 w-9 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isRecording && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording...
                </div>
              )}
              {currentAgent && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {currentAgent.name} is online
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={endChat}
                className="text-xs text-gray-500"
              >
                End Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Chat Widget Button Component
export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Simulate new message notification
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewMessage(true);
        setShowPreview(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    // Auto-hide preview after 5 seconds
    if (showPreview) {
      const timer = setTimeout(() => {
        setShowPreview(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  const openChat = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-40">
          {/* Preview Message */}
          {showPreview && (
            <div className="mb-4 mr-16 bg-white rounded-lg shadow-xl border p-3 max-w-xs animate-in slide-in-from-right">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-xs">
                  👩‍💼
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    Hi! Need help finding the perfect beauty service? I'm here
                    to assist! 💄
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Priya • Just now</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={openChat}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg transition-all hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </Button>
        </div>
      )}

      <LiveChatSupport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default LiveChatSupport;
