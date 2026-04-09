import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OrderId = string;
export type UserId = string;
export type Timestamp = bigint;
export interface Spec {
    key: string;
    value: string;
}
export interface Cart {
    userId: UserId;
    updatedAt: Timestamp;
    items: Array<CartItem>;
}
export type ReviewId = string;
export type ProductId = string;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
    price: number;
}
export interface Order {
    id: OrderId;
    status: string;
    total: number;
    userId: UserId;
    createdAt: Timestamp;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface Review {
    id: ReviewId;
    title: string;
    body: string;
    userId: UserId;
    createdAt: Timestamp;
    authorName: string;
    productId: ProductId;
    rating: bigint;
    helpful: bigint;
}
export interface Product {
    id: ProductId;
    specifications: Array<Spec>;
    inStock: boolean;
    originalPrice: number;
    name: string;
    description: string;
    imageUrl: string;
    isFeatured: boolean;
    category: string;
    brand: string;
    rating: number;
    price: number;
    reviewCount: bigint;
    isTrending: boolean;
    images: Array<string>;
}
export interface backendInterface {
    addReview(productId: string, userId: string, authorName: string, rating: bigint, title: string, body: string): Promise<Review>;
    addToCart(userId: string, productId: string, quantity: bigint): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
    getCart(userId: string): Promise<Cart | null>;
    getOrder(id: string): Promise<Order | null>;
    getOrders(userId: string): Promise<Array<Order>>;
    getProduct(id: string): Promise<Product | null>;
    getProductReviews(productId: string): Promise<Array<Review>>;
    getProducts(category: string | null, brand: string | null, minPrice: number | null, maxPrice: number | null, minRating: number | null, sortBy: string | null): Promise<Array<Product>>;
    placeOrder(userId: string, shippingAddress: string): Promise<Order>;
    removeFromCart(userId: string, productId: string): Promise<Cart>;
}
