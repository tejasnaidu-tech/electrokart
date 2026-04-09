import Map "mo:core/Map";
import List "mo:core/List";
import Lib "../lib/product-catalog";
import Types "../types/product-catalog";
import Common "../types/common";

mixin (
  products : List.List<Types.Product>,
  reviews : List.List<Types.Review>,
  carts : Map.Map<Common.UserId, Types.Cart>,
  orders : List.List<Types.Order>,
  nextReviewId : { var val : Nat },
  nextOrderId : { var val : Nat },
) {

  public query func getProducts(
    category : ?Text,
    brand : ?Text,
    minPrice : ?Float,
    maxPrice : ?Float,
    minRating : ?Float,
    sortBy : ?Text,
  ) : async [Types.Product] {
    Lib.getProducts(products, category, brand, minPrice, maxPrice, minRating, sortBy);
  };

  public query func getProduct(id : Text) : async ?Types.Product {
    Lib.getProduct(products, id);
  };

  public query func getProductReviews(productId : Text) : async [Types.Review] {
    Lib.getProductReviews(reviews, productId);
  };

  public query func getCart(userId : Text) : async ?Types.Cart {
    Lib.getCart(carts, userId);
  };

  public func addToCart(userId : Text, productId : Text, quantity : Nat) : async Types.Cart {
    Lib.addToCart(carts, products, userId, productId, quantity);
  };

  public func removeFromCart(userId : Text, productId : Text) : async Types.Cart {
    Lib.removeFromCart(carts, userId, productId);
  };

  public func clearCart(userId : Text) : async () {
    Lib.clearCart(carts, userId);
  };

  public func placeOrder(userId : Text, shippingAddress : Text) : async Types.Order {
    Lib.placeOrder(carts, orders, nextOrderId, userId, shippingAddress);
  };

  public query func getOrders(userId : Text) : async [Types.Order] {
    Lib.getOrders(orders, userId);
  };

  public query func getOrder(id : Text) : async ?Types.Order {
    Lib.getOrder(orders, id);
  };

  public func addReview(
    productId : Text,
    userId : Text,
    authorName : Text,
    rating : Nat,
    title : Text,
    body : Text,
  ) : async Types.Review {
    Lib.addReview(reviews, products, nextReviewId, productId, userId, authorName, rating, title, body);
  };
};
