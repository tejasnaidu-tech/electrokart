import Map "mo:core/Map";
import List "mo:core/List";
import Types "types/product-catalog";
import Common "types/common";
import Lib "lib/product-catalog";
import CatalogMixin "mixins/product-catalog-api";

actor {
  let products : List.List<Types.Product> = List.empty();
  let reviews : List.List<Types.Review> = List.empty();
  let carts : Map.Map<Common.UserId, Types.Cart> = Map.empty();
  let orders : List.List<Types.Order> = List.empty();
  let nextReviewId = { var val : Nat = 0 };
  let nextOrderId = { var val : Nat = 0 };

  Lib.seedProducts(products);

  include CatalogMixin(products, reviews, carts, orders, nextReviewId, nextOrderId);
};
