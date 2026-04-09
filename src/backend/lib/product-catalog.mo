import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Types "../types/product-catalog";
import Common "../types/common";

module {

  // ----- Products -----

  public func getProducts(
    products : List.List<Types.Product>,
    category : ?Text,
    brand : ?Text,
    minPrice : ?Float,
    maxPrice : ?Float,
    minRating : ?Float,
    sortBy : ?Text,
  ) : [Types.Product] {
    let filtered = products.filter(func(p : Types.Product) : Bool {
      let catOk = switch (category) {
        case (?c) { p.category == c };
        case null { true };
      };
      let brandOk = switch (brand) {
        case (?b) { p.brand == b };
        case null { true };
      };
      let minPriceOk = switch (minPrice) {
        case (?mp) { p.price >= mp };
        case null { true };
      };
      let maxPriceOk = switch (maxPrice) {
        case (?mp) { p.price <= mp };
        case null { true };
      };
      let minRatingOk = switch (minRating) {
        case (?mr) { p.rating >= mr };
        case null { true };
      };
      catOk and brandOk and minPriceOk and maxPriceOk and minRatingOk;
    });

    let arr = filtered.toArray();

    switch (sortBy) {
      case (?"price_asc") {
        arr.sort(func(a : Types.Product, b : Types.Product) : { #less; #equal; #greater } {
          if (a.price < b.price) { #less } else if (a.price > b.price) { #greater } else { #equal }
        })
      };
      case (?"price_desc") {
        arr.sort(func(a : Types.Product, b : Types.Product) : { #less; #equal; #greater } {
          if (b.price < a.price) { #less } else if (b.price > a.price) { #greater } else { #equal }
        })
      };
      case (?"rating_desc") {
        arr.sort(func(a : Types.Product, b : Types.Product) : { #less; #equal; #greater } {
          if (b.rating < a.rating) { #less } else if (b.rating > a.rating) { #greater } else { #equal }
        })
      };
      case (?"newest") {
        arr.sort(func(a : Types.Product, b : Types.Product) : { #less; #equal; #greater } {
          let ai = switch (Nat.fromText(a.id)) { case (?n) n; case null 0 };
          let bi = switch (Nat.fromText(b.id)) { case (?n) n; case null 0 };
          Nat.compare(bi, ai)
        })
      };
      case _ { arr };
    };
  };

  public func getProduct(
    products : List.List<Types.Product>,
    id : Common.ProductId,
  ) : ?Types.Product {
    products.find(func(p : Types.Product) : Bool { p.id == id });
  };

  // ----- Reviews -----

  public func getProductReviews(
    reviews : List.List<Types.Review>,
    productId : Common.ProductId,
  ) : [Types.Review] {
    reviews.filter(func(r : Types.Review) : Bool { r.productId == productId }).toArray();
  };

  public func addReview(
    reviews : List.List<Types.Review>,
    products : List.List<Types.Product>,
    nextReviewId : { var val : Nat },
    productId : Common.ProductId,
    userId : Common.UserId,
    authorName : Text,
    rating : Nat,
    title : Text,
    body : Text,
  ) : Types.Review {
    // Ensure product exists
    switch (products.find(func(p : Types.Product) : Bool { p.id == productId })) {
      case null { Runtime.trap("Product not found") };
      case (?_) {};
    };
    let id = nextReviewId.val.toText();
    nextReviewId.val += 1;
    let review : Types.Review = {
      id;
      productId;
      userId;
      authorName;
      rating;
      title;
      body;
      helpful = 0;
      createdAt = Time.now();
    };
    reviews.add(review);
    review;
  };

  // ----- Cart -----

  public func getCart(
    carts : Map.Map<Common.UserId, Types.Cart>,
    userId : Common.UserId,
  ) : ?Types.Cart {
    carts.get(userId);
  };

  public func addToCart(
    carts : Map.Map<Common.UserId, Types.Cart>,
    products : List.List<Types.Product>,
    userId : Common.UserId,
    productId : Common.ProductId,
    quantity : Nat,
  ) : Types.Cart {
    let product = switch (products.find(func(p : Types.Product) : Bool { p.id == productId })) {
      case (?p) { p };
      case null { Runtime.trap("Product not found") };
    };
    let existing = carts.get(userId);
    let currentItems : [Types.CartItem] = switch (existing) {
      case (?cart) { cart.items };
      case null { [] };
    };
    // Update or add item
    var found = false;
    let updatedItems = currentItems.map(func(item : Types.CartItem) : Types.CartItem {
      if (item.productId == productId) {
        found := true;
        { item with quantity = item.quantity + quantity };
      } else {
        item;
      }
    });
    let finalItems : [Types.CartItem] = if (found) {
      updatedItems;
    } else {
      updatedItems.concat([{ productId; quantity; price = product.price }]);
    };
    let cart : Types.Cart = {
      userId;
      items = finalItems;
      updatedAt = Time.now();
    };
    carts.add(userId, cart);
    cart;
  };

  public func removeFromCart(
    carts : Map.Map<Common.UserId, Types.Cart>,
    userId : Common.UserId,
    productId : Common.ProductId,
  ) : Types.Cart {
    let existing = switch (carts.get(userId)) {
      case (?c) { c };
      case null { Runtime.trap("Cart not found") };
    };
    let newItems = existing.items.filter(func(item : Types.CartItem) : Bool {
      item.productId != productId
    });
    let cart : Types.Cart = {
      existing with
      items = newItems;
      updatedAt = Time.now();
    };
    carts.add(userId, cart);
    cart;
  };

  public func clearCart(
    carts : Map.Map<Common.UserId, Types.Cart>,
    userId : Common.UserId,
  ) {
    carts.remove(userId);
  };

  // ----- Orders -----

  public func placeOrder(
    carts : Map.Map<Common.UserId, Types.Cart>,
    orders : List.List<Types.Order>,
    nextOrderId : { var val : Nat },
    userId : Common.UserId,
    shippingAddress : Text,
  ) : Types.Order {
    let cart = switch (carts.get(userId)) {
      case (?c) { c };
      case null { Runtime.trap("Cart is empty") };
    };
    if (cart.items.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    let total = cart.items.foldLeft(0.0, func(acc : Float, item : Types.CartItem) : Float {
      acc + item.price * item.quantity.toFloat()
    });
    let id = nextOrderId.val.toText();
    nextOrderId.val += 1;
    let order : Types.Order = {
      id;
      userId;
      items = cart.items;
      total;
      shippingAddress;
      status = "Pending";
      createdAt = Time.now();
    };
    orders.add(order);
    carts.remove(userId);
    order;
  };

  public func getOrders(
    orders : List.List<Types.Order>,
    userId : Common.UserId,
  ) : [Types.Order] {
    orders.filter(func(o : Types.Order) : Bool { o.userId == userId }).toArray();
  };

  public func getOrder(
    orders : List.List<Types.Order>,
    id : Common.OrderId,
  ) : ?Types.Order {
    orders.find(func(o : Types.Order) : Bool { o.id == id });
  };

  // ----- Sample data seed -----

  public func seedProducts(products : List.List<Types.Product>) {
    let items : [Types.Product] = [
      // Mobiles
      {
        id = "0";
        name = "iPhone 15 Pro";
        category = "Mobiles";
        brand = "Apple";
        price = 999.0;
        originalPrice = 1099.0;
        rating = 4.8;
        reviewCount = 2341;
        imageUrl = "https://picsum.photos/seed/0/400/400";
        images = [
          "https://picsum.photos/seed/0/400/400",
          "https://picsum.photos/seed/0a/400/400",
          "https://picsum.photos/seed/0b/400/400",
        ];
        description = "Experience the pinnacle of iPhone technology with the iPhone 15 Pro. Featuring a titanium design, the A17 Pro chip, and a versatile 48MP camera system with 5x optical zoom for stunning photography.";
        specifications = [
          { key = "Processor"; value = "A17 Pro chip" },
          { key = "Display"; value = "6.1-inch Super Retina XDR OLED" },
          { key = "Camera"; value = "48MP main + 12MP ultra-wide + 12MP 5x telephoto" },
          { key = "Battery"; value = "3274 mAh, up to 23hr video playback" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = true;
      },
      {
        id = "1";
        name = "Samsung Galaxy S24";
        category = "Mobiles";
        brand = "Samsung";
        price = 899.0;
        originalPrice = 999.0;
        rating = 4.7;
        reviewCount = 1876;
        imageUrl = "https://picsum.photos/seed/1/400/400";
        images = [
          "https://picsum.photos/seed/1/400/400",
          "https://picsum.photos/seed/1a/400/400",
          "https://picsum.photos/seed/1b/400/400",
        ];
        description = "The Samsung Galaxy S24 brings Galaxy AI features to your fingertips. With a Snapdragon 8 Gen 3 processor, ProVisual Engine, and 50MP triple camera, it redefines what a smartphone can do.";
        specifications = [
          { key = "Processor"; value = "Snapdragon 8 Gen 3" },
          { key = "Display"; value = "6.2-inch Dynamic AMOLED 2X, 120Hz" },
          { key = "Camera"; value = "50MP main + 12MP ultra-wide + 10MP 3x telephoto" },
          { key = "Battery"; value = "4000 mAh with 25W fast charging" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = true;
      },
      {
        id = "2";
        name = "OnePlus 12";
        category = "Mobiles";
        brand = "OnePlus";
        price = 699.0;
        originalPrice = 799.0;
        rating = 4.5;
        reviewCount = 1024;
        imageUrl = "https://picsum.photos/seed/2/400/400";
        images = [
          "https://picsum.photos/seed/2/400/400",
          "https://picsum.photos/seed/2a/400/400",
          "https://picsum.photos/seed/2b/400/400",
        ];
        description = "The OnePlus 12 delivers flagship performance at a competitive price. Powered by Snapdragon 8 Gen 3, Hasselblad cameras, and 100W SUPERVOOC charging, it's built for speed enthusiasts.";
        specifications = [
          { key = "Processor"; value = "Snapdragon 8 Gen 3" },
          { key = "Display"; value = "6.82-inch LTPO AMOLED, 1-120Hz" },
          { key = "Camera"; value = "50MP Hasselblad main + 48MP ultra-wide + 64MP 3x telephoto" },
          { key = "Battery"; value = "5400 mAh with 100W SUPERVOOC" },
        ];
        inStock = true;
        isFeatured = false;
        isTrending = true;
      },
      // Laptops
      {
        id = "3";
        name = "MacBook Air M3";
        category = "Laptops";
        brand = "Apple";
        price = 1299.0;
        originalPrice = 1399.0;
        rating = 4.9;
        reviewCount = 3102;
        imageUrl = "https://picsum.photos/seed/3/400/400";
        images = [
          "https://picsum.photos/seed/3/400/400",
          "https://picsum.photos/seed/3a/400/400",
          "https://picsum.photos/seed/3b/400/400",
        ];
        description = "The MacBook Air with M3 chip is impossibly thin and light, delivering exceptional performance for everyday tasks and creative work. Up to 18 hours of battery life keeps you going all day.";
        specifications = [
          { key = "Processor"; value = "Apple M3 chip (8-core CPU, 10-core GPU)" },
          { key = "Display"; value = "13.6-inch Liquid Retina, 2560x1664" },
          { key = "Memory"; value = "8GB unified memory" },
          { key = "Storage"; value = "256GB SSD" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = true;
      },
      {
        id = "4";
        name = "Dell XPS 15";
        category = "Laptops";
        brand = "Dell";
        price = 1199.0;
        originalPrice = 1349.0;
        rating = 4.6;
        reviewCount = 1543;
        imageUrl = "https://picsum.photos/seed/4/400/400";
        images = [
          "https://picsum.photos/seed/4/400/400",
          "https://picsum.photos/seed/4a/400/400",
          "https://picsum.photos/seed/4b/400/400",
        ];
        description = "The Dell XPS 15 is a powerhouse laptop with a stunning InfinityEdge OLED display, Intel Core i7 processor, and NVIDIA GeForce RTX 4060 graphics — perfect for creative professionals.";
        specifications = [
          { key = "Processor"; value = "Intel Core i7-13700H" },
          { key = "Display"; value = "15.6-inch OLED, 3.5K 120Hz" },
          { key = "Graphics"; value = "NVIDIA GeForce RTX 4060 8GB" },
          { key = "Memory"; value = "16GB DDR5 RAM" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = true;
      },
      {
        id = "5";
        name = "HP Spectre x360";
        category = "Laptops";
        brand = "HP";
        price = 1099.0;
        originalPrice = 1249.0;
        rating = 4.5;
        reviewCount = 987;
        imageUrl = "https://picsum.photos/seed/5/400/400";
        images = [
          "https://picsum.photos/seed/5/400/400",
          "https://picsum.photos/seed/5a/400/400",
          "https://picsum.photos/seed/5b/400/400",
        ];
        description = "The HP Spectre x360 is the ultimate 2-in-1 laptop, combining elegant design with powerful performance. Use it as a laptop, tent, or tablet with its versatile 360-degree hinge.";
        specifications = [
          { key = "Processor"; value = "Intel Core i7-1355U" },
          { key = "Display"; value = "14-inch OLED Touch, 2880x1800" },
          { key = "Memory"; value = "16GB LPDDR5 RAM" },
          { key = "Battery"; value = "66Wh, up to 17 hours" },
        ];
        inStock = true;
        isFeatured = false;
        isTrending = false;
      },
      // Accessories
      {
        id = "6";
        name = "Sony WH-1000XM5";
        category = "Accessories";
        brand = "Sony";
        price = 349.0;
        originalPrice = 399.0;
        rating = 4.8;
        reviewCount = 4521;
        imageUrl = "https://picsum.photos/seed/6/400/400";
        images = [
          "https://picsum.photos/seed/6/400/400",
          "https://picsum.photos/seed/6a/400/400",
          "https://picsum.photos/seed/6b/400/400",
        ];
        description = "The Sony WH-1000XM5 leads the industry in noise cancellation with 8 microphones and two processors. Enjoy 30 hours of battery life and crystal-clear hands-free calling.";
        specifications = [
          { key = "Driver"; value = "30mm dynamic driver" },
          { key = "Noise Cancelling"; value = "Industry-leading ANC with 8 mics" },
          { key = "Battery"; value = "30 hours (ANC on)" },
          { key = "Connectivity"; value = "Bluetooth 5.2, multipoint" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = false;
      },
      {
        id = "7";
        name = "Samsung Galaxy Watch 6";
        category = "Accessories";
        brand = "Samsung";
        price = 299.0;
        originalPrice = 349.0;
        rating = 4.4;
        reviewCount = 1203;
        imageUrl = "https://picsum.photos/seed/7/400/400";
        images = [
          "https://picsum.photos/seed/7/400/400",
          "https://picsum.photos/seed/7a/400/400",
          "https://picsum.photos/seed/7b/400/400",
        ];
        description = "The Samsung Galaxy Watch 6 features advanced health monitoring including body composition, sleep coaching, and heart rate tracking in a sleek, durable design.";
        specifications = [
          { key = "Display"; value = "1.5-inch Super AMOLED, sapphire crystal" },
          { key = "Health"; value = "BioActive Sensor: heart rate, SpO2, ECG" },
          { key = "Battery"; value = "425 mAh, up to 40 hours" },
          { key = "Water Resistance"; value = "5ATM + IP68" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = false;
      },
      {
        id = "8";
        name = "Apple AirPods Pro";
        category = "Accessories";
        brand = "Apple";
        price = 249.0;
        originalPrice = 279.0;
        rating = 4.7;
        reviewCount = 6782;
        imageUrl = "https://picsum.photos/seed/8/400/400";
        images = [
          "https://picsum.photos/seed/8/400/400",
          "https://picsum.photos/seed/8a/400/400",
          "https://picsum.photos/seed/8b/400/400",
        ];
        description = "AirPods Pro (2nd generation) feature the H2 chip for up to 2x more Active Noise Cancellation, Adaptive Transparency mode, and Personalized Spatial Audio for an immersive listening experience.";
        specifications = [
          { key = "Chip"; value = "Apple H2 chip" },
          { key = "ANC"; value = "Active Noise Cancellation, Adaptive Transparency" },
          { key = "Battery"; value = "6hrs ANC on; 30hrs with case" },
          { key = "Connectivity"; value = "Bluetooth 5.3, H2-powered" },
        ];
        inStock = true;
        isFeatured = false;
        isTrending = false;
      },
      // Appliances
      {
        id = "9";
        name = "LG OLED TV 55in";
        category = "Appliances";
        brand = "LG";
        price = 1499.0;
        originalPrice = 1799.0;
        rating = 4.8;
        reviewCount = 2890;
        imageUrl = "https://picsum.photos/seed/9/400/400";
        images = [
          "https://picsum.photos/seed/9/400/400",
          "https://picsum.photos/seed/9a/400/400",
          "https://picsum.photos/seed/9b/400/400",
        ];
        description = "The LG OLED C3 delivers perfect blacks, infinite contrast, and over a billion colors. With the α9 AI Processor Gen6 and Dolby Vision IQ, experience cinema-quality entertainment at home.";
        specifications = [
          { key = "Display"; value = "55-inch OLED evo, 4K 120Hz" },
          { key = "Processor"; value = "α9 AI Processor Gen6" },
          { key = "HDR"; value = "Dolby Vision IQ, HDR10, HLG" },
          { key = "Smart TV"; value = "webOS 23, ThinQ AI" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = false;
      },
      {
        id = "10";
        name = "Samsung Smart Refrigerator";
        category = "Appliances";
        brand = "Samsung";
        price = 1299.0;
        originalPrice = 1499.0;
        rating = 4.6;
        reviewCount = 876;
        imageUrl = "https://picsum.photos/seed/10/400/400";
        images = [
          "https://picsum.photos/seed/10/400/400",
          "https://picsum.photos/seed/10a/400/400",
          "https://picsum.photos/seed/10b/400/400",
        ];
        description = "The Samsung Family Hub smart refrigerator features a 21.5-inch touchscreen, internal cameras to see your food remotely, and AI-powered energy management to keep food fresh longer.";
        specifications = [
          { key = "Capacity"; value = "28 cu. ft. French Door" },
          { key = "Smart Features"; value = "Family Hub 7.0, 21.5-inch touchscreen" },
          { key = "Cooling"; value = "Twin Cooling Plus, All-Around Cooling" },
          { key = "Energy"; value = "Energy Star certified" },
        ];
        inStock = true;
        isFeatured = true;
        isTrending = false;
      },
      {
        id = "11";
        name = "Bosch Dishwasher";
        category = "Appliances";
        brand = "Bosch";
        price = 799.0;
        originalPrice = 949.0;
        rating = 4.5;
        reviewCount = 1432;
        imageUrl = "https://picsum.photos/seed/11/400/400";
        images = [
          "https://picsum.photos/seed/11/400/400",
          "https://picsum.photos/seed/11a/400/400",
          "https://picsum.photos/seed/11b/400/400",
        ];
        description = "The Bosch 500 Series dishwasher features PureDry, AutoAir, and a flexible 3rd rack. With 44 dBa, it's one of the quietest dishwashers on the market — perfect for open-concept kitchens.";
        specifications = [
          { key = "Noise Level"; value = "44 dBa ultra-quiet operation" },
          { key = "Capacity"; value = "16 place settings, flexible 3rd rack" },
          { key = "Drying"; value = "PureDry, AutoAir door opening" },
          { key = "Programs"; value = "6 wash cycles, Sanitize option" },
        ];
        inStock = true;
        isFeatured = false;
        isTrending = false;
      },
    ];

    for (item in items.values()) {
      products.add(item);
    };
  };
};
