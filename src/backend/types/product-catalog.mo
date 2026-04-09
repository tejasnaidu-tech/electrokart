import Common "common";

module {
  public type Spec = {
    key : Text;
    value : Text;
  };

  public type Product = {
    id : Common.ProductId;
    name : Text;
    category : Text; // Mobiles | Laptops | Accessories | Appliances
    brand : Text;
    price : Float;
    originalPrice : Float;
    rating : Float;
    reviewCount : Nat;
    imageUrl : Text;
    images : [Text];
    description : Text;
    specifications : [Spec];
    inStock : Bool;
    isFeatured : Bool;
    isTrending : Bool;
  };

  public type Review = {
    id : Common.ReviewId;
    productId : Common.ProductId;
    userId : Common.UserId;
    authorName : Text;
    rating : Nat;
    title : Text;
    body : Text;
    helpful : Nat;
    createdAt : Common.Timestamp;
  };

  public type CartItem = {
    productId : Common.ProductId;
    quantity : Nat;
    price : Float;
  };

  public type Cart = {
    userId : Common.UserId;
    items : [CartItem];
    updatedAt : Common.Timestamp;
  };

  public type Order = {
    id : Common.OrderId;
    userId : Common.UserId;
    items : [CartItem];
    total : Float;
    shippingAddress : Text;
    status : Text; // Pending | Confirmed | Shipped | Delivered | Cancelled
    createdAt : Common.Timestamp;
  };
};
