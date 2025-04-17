import { users, User, InsertUser, gifts, Gift, InsertGift, wishlistItems, WishlistItem, InsertWishlistItem, friends, Friend, InsertFriend } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Gift operations
  getGifts(): Promise<Gift[]>;
  getGiftsByCategory(category: string): Promise<Gift[]>;
  getTrendingGifts(): Promise<Gift[]>;
  getGiftsByInterests(interests: string[]): Promise<Gift[]>;
  getGift(id: number): Promise<Gift | undefined>;
  createGift(gift: InsertGift): Promise<Gift>;
  
  // Wishlist operations
  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  getWishlistItem(id: number): Promise<WishlistItem | undefined>;
  createWishlistItem(item: InsertWishlistItem): Promise<WishlistItem>;
  deleteWishlistItem(id: number): Promise<boolean>;
  
  // Friend operations
  getFriends(userId: number): Promise<Friend[]>;
  addFriend(friend: InsertFriend): Promise<Friend>;
  getFriendWishlists(userId: number): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gifts: Map<number, Gift>;
  private wishlistItems: Map<number, WishlistItem>;
  private friends: Map<number, Friend>;
  private currentIds: {
    users: number;
    gifts: number;
    wishlistItems: number;
    friends: number;
  };

  constructor() {
    this.users = new Map();
    this.gifts = new Map();
    this.wishlistItems = new Map();
    this.friends = new Map();
    this.currentIds = {
      users: 1,
      gifts: 1,
      wishlistItems: 1,
      friends: 1
    };
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Pre-populate with some mock gifts for development
    const mockGifts: InsertGift[] = [
      { 
        nameAr: "سماعات لاسلكية فاخرة", 
        nameEn: "Premium Wireless Earbuds", 
        category: "tech",
        price: 699,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?headphones",
        stores: ["جرير", "اكسترا", "أمازون"],
        rating: 47, // Storing as integer (4.7)
        trending: true
      },
      { 
        nameAr: "اشتراك منصة ألعاب", 
        nameEn: "Gaming Platform Subscription", 
        category: "gaming",
        price: 240,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?gaming",
        stores: ["إلكترونيات", "نون", "متجر بلاي ستيشن"],
        rating: 49,
        trending: true
      },
      { 
        nameAr: "حقيبة ظهر للسفر والمغامرات", 
        nameEn: "Adventure Travel Backpack", 
        category: "travel",
        price: 450,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?backpack",
        stores: ["دكاثلون", "نمشي", "أمازون"],
        rating: 46,
        trending: false
      },
      { 
        nameAr: "قسيمة لفعالية موسم الرياض", 
        nameEn: "Riyadh Season Event Voucher", 
        category: "entertainment",
        price: 350,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?ticket",
        stores: ["تذاكري", "موقع موسم الرياض"],
        rating: 48,
        trending: true
      },
      { 
        nameAr: "حامل قهوة محمول مبتكر", 
        nameEn: "Innovative Portable Coffee Holder", 
        category: "coffee",
        price: 190,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?coffee",
        stores: ["ستاربكس", "دنكن", "أمازون"],
        rating: 43,
        trending: false
      },
      { 
        nameAr: "عطر عربي بلمسة عصرية", 
        nameEn: "Modern Arabic Perfume", 
        category: "oud",
        price: 450,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?perfume",
        stores: ["العربية للعود", "سيفورا", "نون"],
        rating: 45,
        trending: false
      },
      { 
        nameAr: "اشتراك نادي رياضي", 
        nameEn: "Gym Membership", 
        category: "sports",
        price: 750,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?gym",
        stores: ["فتنس تايم", "نادي وقت اللياقة", "جولدز جيم"],
        rating: 44,
        trending: true
      },
      { 
        nameAr: "قميص بتصميم سعودي معاصر", 
        nameEn: "Contemporary Saudi Design T-shirt", 
        category: "local",
        price: 180,
        currency: "SAR",
        imageUrl: "https://source.unsplash.com/random/300x300/?tshirt",
        stores: ["تراثنا", "مركز الموضة", "H&M"],
        rating: 42,
        trending: false
      }
    ];
    
    // Add mock gifts to storage
    mockGifts.forEach(gift => this.createGift(gift));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Gift operations
  async getGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getGiftsByCategory(category: string): Promise<Gift[]> {
    return Array.from(this.gifts.values()).filter(
      (gift) => gift.category === category,
    );
  }

  async getTrendingGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values()).filter(
      (gift) => gift.trending,
    );
  }

  async getGiftsByInterests(interests: string[]): Promise<Gift[]> {
    if (!interests || interests.length === 0) {
      return this.getGifts();
    }
    return Array.from(this.gifts.values()).filter(
      (gift) => interests.includes(gift.category),
    );
  }

  async getGift(id: number): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async createGift(insertGift: InsertGift): Promise<Gift> {
    const id = this.currentIds.gifts++;
    const gift: Gift = { ...insertGift, id, createdAt: new Date() };
    this.gifts.set(id, gift);
    return gift;
  }

  // Wishlist operations
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async getWishlistItem(id: number): Promise<WishlistItem | undefined> {
    return this.wishlistItems.get(id);
  }

  async createWishlistItem(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = this.currentIds.wishlistItems++;
    const item: WishlistItem = { ...insertItem, id, createdAt: new Date() };
    this.wishlistItems.set(id, item);
    return item;
  }

  async deleteWishlistItem(id: number): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  // Friend operations
  async getFriends(userId: number): Promise<Friend[]> {
    return Array.from(this.friends.values()).filter(
      (friend) => friend.userId === userId || friend.friendId === userId,
    );
  }

  async addFriend(insertFriend: InsertFriend): Promise<Friend> {
    const id = this.currentIds.friends++;
    const friend: Friend = { ...insertFriend, id, createdAt: new Date() };
    this.friends.set(id, friend);
    return friend;
  }

  async getFriendWishlists(userId: number): Promise<any[]> {
    // Get all friends
    const userFriends = await this.getFriends(userId);
    
    // Get accepted friends only
    const acceptedFriends = userFriends.filter(f => f.status === 'accepted');
    
    // For each friend, get their wishlist
    const friendWishlists = [];
    
    for (const friendship of acceptedFriends) {
      const friendId = friendship.userId === userId ? friendship.friendId : friendship.userId;
      const friend = await this.getUser(friendId);
      
      if (friend) {
        const wishlistItems = await this.getWishlistItems(friendId);
        
        friendWishlists.push({
          id: friendId,
          friend: {
            name: friend.name,
            avatar: `https://source.unsplash.com/random/100x100/?portrait`
          },
          occasion: "عيد ميلاد", // This would come from actual friend data
          date: "2025-05-10", // This would come from actual friend data
          items: wishlistItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price.toString(),
            link: item.link
          }))
        });
      }
    }
    
    // If we don't have actual friend data, return mock data for display purposes
    if (friendWishlists.length === 0) {
      return [
        {
          id: 1,
          friend: { name: "سارة الأحمد", avatar: "https://source.unsplash.com/random/100x100/?woman" },
          occasion: "عيد ميلاد",
          date: "2025-05-10",
          items: [
            { id: 101, name: "سماعات لاسلكية", price: "349" },
            { id: 102, name: "كتاب رواية", price: "85" }
          ]
        },
        {
          id: 2,
          friend: { name: "محمد العتيبي", avatar: "https://source.unsplash.com/random/100x100/?man" },
          occasion: "تخرج",
          date: "2025-06-20",
          items: [
            { id: 201, name: "ساعة ذكية", price: "1200" },
            { id: 202, name: "حقيبة لابتوب", price: "350" }
          ]
        }
      ];
    }
    
    return friendWishlists;
  }
}

export const storage = new MemStorage();
