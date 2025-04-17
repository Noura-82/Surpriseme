import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWishlistItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.safeParse(req.body);
      
      if (!userData.success) {
        return res.status(400).json({ message: "Invalid user data", errors: userData.error });
      }

      // Check if user with email already exists
      const existingUser = await storage.getUserByEmail(userData.data.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      const user = await storage.createUser(userData.data);
      
      // Return the user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Get user profile
  app.get("/api/user/profile", async (req, res) => {
    try {
      // In a real app, this would come from session/JWT
      // For demo, we'll assume user ID 1 if available, otherwise 404
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Get all gifts
  app.get("/api/gifts", async (req, res) => {
    try {
      const gifts = await storage.getGifts();
      return res.status(200).json(gifts);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      return res.status(500).json({ message: "Failed to fetch gifts" });
    }
  });

  // Get trending gifts
  app.get("/api/gifts/trending", async (req, res) => {
    try {
      const gifts = await storage.getTrendingGifts();
      return res.status(200).json(gifts);
    } catch (error) {
      console.error("Error fetching trending gifts:", error);
      return res.status(500).json({ message: "Failed to fetch trending gifts" });
    }
  });

  // Get gifts by category
  app.get("/api/gifts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const gifts = await storage.getGiftsByCategory(category);
      return res.status(200).json(gifts);
    } catch (error) {
      console.error("Error fetching gifts by category:", error);
      return res.status(500).json({ message: "Failed to fetch gifts by category" });
    }
  });

  // Get gifts by interests
  app.get("/api/gifts/interests", async (req, res) => {
    try {
      const interestsParam = req.query.interests as string;
      
      if (!interestsParam) {
        return res.status(400).json({ message: "Interests parameter is required" });
      }
      
      const interests = interestsParam.split(',');
      const gifts = await storage.getGiftsByInterests(interests);
      return res.status(200).json(gifts);
    } catch (error) {
      console.error("Error fetching gifts by interests:", error);
      return res.status(500).json({ message: "Failed to fetch gifts by interests" });
    }
  });

  // Get wishlist items
  app.get("/api/wishlist", async (req, res) => {
    try {
      // In a real app, this would come from session/JWT
      // For demo, we'll assume user ID 1
      const userId = 1;
      const wishlistItems = await storage.getWishlistItems(userId);
      return res.status(200).json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      return res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  // Add item to wishlist
  app.post("/api/wishlist", async (req, res) => {
    try {
      // Validate request body
      const itemData = {
        ...req.body,
        userId: 1 // In a real app, this would come from session/JWT
      };
      
      const validItem = insertWishlistItemSchema.safeParse(itemData);
      
      if (!validItem.success) {
        return res.status(400).json({ message: "Invalid wishlist item data", errors: validItem.error });
      }
      
      const newItem = await storage.createWishlistItem(validItem.data);
      return res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      return res.status(500).json({ message: "Failed to add item to wishlist" });
    }
  });

  // Remove item from wishlist
  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      // Check if item exists
      const item = await storage.getWishlistItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      
      // In a real app, check if the item belongs to the authenticated user
      
      const deleted = await storage.deleteWishlistItem(id);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete wishlist item" });
      }
      
      return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      return res.status(500).json({ message: "Failed to remove item from wishlist" });
    }
  });

  // Get friends wishlists
  app.get("/api/friends/wishlists", async (req, res) => {
    try {
      // In a real app, userId would come from session/JWT
      const userId = 1;
      const friendsWishlists = await storage.getFriendWishlists(userId);
      return res.status(200).json(friendsWishlists);
    } catch (error) {
      console.error("Error fetching friends wishlists:", error);
      return res.status(500).json({ message: "Failed to fetch friends wishlists" });
    }
  });

  // Mock logout endpoint (in a real app, this would destroy session/invalidate token)
  app.post("/api/auth/logout", (req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
  });

  // Health check endpoint
  app.get("/api/health", (_, res) => {
    return res.status(200).json({ status: "ok" });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
