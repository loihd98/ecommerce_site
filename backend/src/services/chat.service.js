import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

class ChatWebSocketServer {
  constructor(server) {
    this.wss = new WebSocketServer({ server, path: "/chat" });
    this.clients = new Map(); // Map to store authenticated clients

    this.wss.on("connection", (ws, req) => {
      console.log("New WebSocket connection");

      const clientId = this.generateClientId();
      this.clients.set(clientId, { ws, userId: null });

      // Send welcome message
      this.sendMessage(ws, {
        type: "message",
        text: "Welcome to our customer support! How can I help you today?",
      });

      ws.on("message", (data) => {
        this.handleMessage(clientId, data);
      });

      ws.on("close", () => {
        console.log("Client disconnected");
        this.clients.delete(clientId);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(clientId);
      });
    });

    console.log("WebSocket server initialized");
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  sendMessage(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  handleMessage(clientId, data) {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);

      if (!client) return;

      if (message.type === "auth" && message.token) {
        // Authenticate user with JWT
        try {
          const decoded = jwt.verify(message.token, JWT_SECRET);
          client.userId = decoded.id;
          this.sendMessage(client.ws, {
            type: "auth_success",
            text: "Authentication successful",
          });
        } catch (error) {
          this.sendMessage(client.ws, {
            type: "auth_error",
            text: "Authentication failed",
          });
        }
        return;
      }

      if (message.type === "message") {
        // Process user message and generate response
        const response = this.generateBotResponse(message.text, client.userId);

        // Simulate typing delay
        setTimeout(() => {
          this.sendMessage(client.ws, {
            type: "message",
            text: response,
          });
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  generateBotResponse(message, userId) {
    const lowerMessage = message.toLowerCase();

    // Order tracking
    if (lowerMessage.includes("order") || lowerMessage.includes("track")) {
      if (userId) {
        return "You can track your orders in the Orders section of your account. Would you like me to help you with a specific order number?";
      }
      return "Please log in to track your orders. You can find the login button in the navigation menu.";
    }

    // Returns and refunds
    if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
      return "We offer a 30-day return policy on most items. You can initiate a return from your order details page. For assistance, please provide your order number and I'll help you with the process.";
    }

    // Shipping information
    if (
      lowerMessage.includes("shipping") ||
      lowerMessage.includes("delivery") ||
      lowerMessage.includes("ship")
    ) {
      return "We offer:\n• Free shipping on orders over $100\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days (additional fee)\n\nWhich option interests you?";
    }

    // Payment methods
    if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("pay") ||
      lowerMessage.includes("card")
    ) {
      return "We accept:\n• Credit/Debit cards (Visa, Mastercard, Amex)\n• Cash on Delivery\n• PayPal (coming soon)\n\nAll transactions are secure and encrypted with SSL.";
    }

    // Product inquiries
    if (
      lowerMessage.includes("product") ||
      lowerMessage.includes("item") ||
      lowerMessage.includes("stock")
    ) {
      return "You can browse our full product catalog by category or use the search feature. Looking for something specific? Let me know the product name or category!";
    }

    // Account help
    if (
      lowerMessage.includes("account") ||
      lowerMessage.includes("profile") ||
      lowerMessage.includes("password")
    ) {
      if (userId) {
        return "You can manage your account settings, addresses, and preferences in the Account section. Need help with something specific?";
      }
      return "Please create an account or log in to access your profile and order history. Registration is quick and free!";
    }

    // Contact information
    if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("email") ||
      lowerMessage.includes("phone") ||
      lowerMessage.includes("support")
    ) {
      return "Our customer support team is here to help!\n\n📧 Email: support@taphoanhadev.com\n📞 Phone: 1-800-123-4567\n⏰ Available: 24/7\n\nHow can I assist you today?";
    }

    // Greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return "Hello! 👋 Welcome to our store. I'm here to help you with:\n• Order tracking\n• Shipping information\n• Returns & refunds\n• Product inquiries\n• Account assistance\n\nWhat would you like to know?";
    }

    // Thanks
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with today? 😊";
    }

    // Complaints or issues
    if (
      lowerMessage.includes("problem") ||
      lowerMessage.includes("issue") ||
      lowerMessage.includes("complaint") ||
      lowerMessage.includes("broken") ||
      lowerMessage.includes("damaged")
    ) {
      return "I'm sorry to hear you're experiencing an issue. Could you please provide more details about the problem? If it's regarding a specific order, please share your order number so I can assist you better.";
    }

    // Discount/promotion
    if (
      lowerMessage.includes("discount") ||
      lowerMessage.includes("coupon") ||
      lowerMessage.includes("promo") ||
      lowerMessage.includes("sale")
    ) {
      return "Great news! 🎉 We currently have:\n• Free shipping on orders over $100\n• Seasonal sales on selected items\n• Newsletter subscribers get exclusive deals\n\nCheck our homepage for current promotions!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n• Orders & tracking\n• Shipping & delivery\n• Returns & refunds\n• Products & availability\n• Payment methods\n• Account management\n\nWhat would you like to know?";
  }

  broadcast(data) {
    this.clients.forEach((client) => {
      this.sendMessage(client.ws, data);
    });
  }
}

export default ChatWebSocketServer;
