export type {
  Product,
  CartItem,
  Cart,
  Order,
  Review,
  Spec,
  ProductId,
  OrderId,
  UserId,
  Timestamp,
  ReviewId,
} from "../backend.d.ts";

export interface ProductFilters {
  category?: string | null;
  brand?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  sortBy?: string | null;
}

export interface LocalCartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export interface CartContextValue {
  cartItems: LocalCartItem[];
  cartCount: number;
  cartTotal: number;
  addItem: (item: LocalCartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  principal: string | null;
  displayName: string | null;
  login: () => void;
  logout: () => void;
}

export const CATEGORIES = [
  "Mobiles",
  "Laptops",
  "Accessories",
  "Appliances",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
] as const;

export const BRANDS = [
  "Apple",
  "Samsung",
  "Dell",
  "Sony",
  "LG",
  "OnePlus",
  "HP",
  "Lenovo",
] as const;
