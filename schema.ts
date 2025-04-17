import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  password: text("password"),
  interests: json("interests").$type<string[]>(),
  occasion: text("occasion"),
  budget: integer("budget"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User insert schema
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Gifts table
export const gifts = pgTable("gifts", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").default("SAR"),
  imageUrl: text("image_url"),
  stores: json("stores").$type<string[]>(),
  rating: integer("rating"),
  trending: boolean("trending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gift insert schema
export const insertGiftSchema = createInsertSchema(gifts).omit({
  id: true,
  createdAt: true,
});

// Wishlist table
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  price: text("price").notNull(),
  link: text("link"),
  stores: json("stores").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wishlist insert schema
export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

// Friends table
export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Friend insert schema
export const insertFriendSchema = createInsertSchema(friends).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Gift = typeof gifts.$inferSelect;
export type InsertGift = z.infer<typeof insertGiftSchema>;

export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

export type Friend = typeof friends.$inferSelect;
export type InsertFriend = z.infer<typeof insertFriendSchema>;
