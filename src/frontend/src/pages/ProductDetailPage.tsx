import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  LogIn,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  ThumbsUp,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProductCard, StarRating } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  useAddReview,
  useProduct,
  useProductReviews,
} from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";

function ReviewForm({
  productId,
  userId,
  displayName,
}: {
  productId: string;
  userId: string;
  displayName: string;
}) {
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { mutate: addReview, isPending } = useAddReview(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    addReview(
      {
        userId,
        authorName: displayName,
        rating: BigInt(rating),
        title: title.trim(),
        body: body.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully!");
          setTitle("");
          setBody("");
          setRating(5);
        },
        onError: () => {
          toast.error("Failed to submit review. Please try again.");
        },
      },
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-muted/30 rounded-xl border border-border p-6 space-y-4"
      data-ocid="review-form"
    >
      <h3 className="font-display font-semibold text-lg text-foreground">
        Write a Review
      </h3>

      {/* Star Picker */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Your Rating</Label>
        <div className="flex items-center gap-1" aria-label="Select rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Star
                className={`size-6 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} star{rating > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="review-title" className="text-sm font-medium">
          Review Title
        </Label>
        <Input
          id="review-title"
          placeholder="Summarize your experience..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          data-ocid="review-title-input"
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <Label htmlFor="review-body" className="text-sm font-medium">
          Review
        </Label>
        <Textarea
          id="review-body"
          placeholder="What did you like or dislike? How is the product quality?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={1000}
          data-ocid="review-body-input"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !title.trim() || !body.trim()}
        className="w-full"
        data-ocid="review-submit"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </motion.form>
  );
}

function ReviewItem({
  review,
}: {
  review: {
    id: string;
    authorName: string;
    rating: bigint;
    title: string;
    body: string;
    createdAt: bigint;
    helpful: bigint;
  };
}) {
  const initials = review.authorName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const reviewDate = new Date(
    Number(review.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="flex gap-4 py-5 border-b border-border last:border-0"
      data-ocid={`review-item-${review.id}`}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-semibold text-sm text-foreground">
              {review.authorName}
            </p>
            <StarRating rating={Number(review.rating)} />
          </div>
          <time className="text-xs text-muted-foreground shrink-0">
            {reviewDate}
          </time>
        </div>
        <p className="font-medium text-sm text-foreground mt-2 mb-1">
          {review.title}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.body}
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ThumbsUp className="size-3" />
          Helpful ({Number(review.helpful)})
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { data: product, isLoading } = useProduct(id);
  const { data: reviews } = useProductReviews(id);
  const { addItem } = useCart();
  const { isAuthenticated, principal, displayName } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Related products: same category
  const { data: allProducts } = useProducts(
    product ? { category: product.category } : {},
  );
  const relatedProducts =
    allProducts?.filter((p) => p.id !== id).slice(0, 6) ?? [];

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      quantity: qty,
      price: product.price,
      originalPrice: product.originalPrice,
    });
    toast.success("Added to cart!", {
      description: `${qty}× ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    navigate({ to: "/cart" });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="flex gap-2">
                {["sk1", "sk2", "sk3", "sk4"].map((k) => (
                  <Skeleton key={k} className="w-16 h-16 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-4/5" />
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-sm mx-auto">
            <Package className="size-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl mb-3">
              Product Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              This product may have been removed or is no longer available.
            </p>
            <Button
              onClick={() => navigate({ to: "/products" })}
              data-ocid="browse-products-btn"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const allImages = product.images?.length
    ? product.images
    : [product.imageUrl];
  const thumbnails = allImages.slice(0, 4);

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="size-3" />
            <Link
              to="/products"
              search={{ category: product.category }}
              className="hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="size-3" />
            <span
              className="text-foreground font-medium truncate max-w-[200px]"
              aria-current="page"
            >
              {product.name}
            </span>
          </nav>

          {/* Main product grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 mb-12">
            {/* ── Image Gallery ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-3"
            >
              {/* Main image */}
              <div className="relative bg-card rounded-xl border border-border overflow-hidden aspect-square flex items-center justify-center p-8 shadow-subtle">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={allImages[activeImg] || "/assets/images/placeholder.svg"}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
                {discountPct >= 5 && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-destructive text-destructive-foreground font-bold">
                      -{discountPct}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails (show up to 4) */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {thumbnails.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`aspect-square rounded-lg border-2 overflow-hidden transition-smooth bg-card p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        i === activeImg
                          ? "border-primary shadow-sm"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-ocid={`thumb-${i}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} — view ${i + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Product Info ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-5"
            >
              {/* Brand + Name */}
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
                <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating + Stock */}
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} />
                <span className="text-sm text-muted-foreground">
                  {Number(product.reviewCount).toLocaleString()} reviews
                </span>
                <Separator orientation="vertical" className="h-4" />
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-700 border border-green-200 font-semibold">
                    ✓ In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-semibold">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Price block */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display font-bold text-4xl text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-destructive">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  Quantity
                </span>
                <div
                  className="flex items-center border border-border rounded-lg overflow-hidden bg-card"
                  aria-label="Quantity selector"
                >
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40"
                    data-ocid="qty-decrease"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span
                    className="px-5 py-2 text-sm font-bold min-w-[3.5rem] text-center border-x border-border"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40"
                    data-ocid="qty-increase"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">(Max 10)</span>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  className="flex-1 min-w-[140px] gap-2 font-semibold"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  data-ocid="detail-add-cart"
                >
                  <ShoppingCart className="size-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 min-w-[140px] gap-2 font-semibold"
                  disabled={!product.inStock}
                  onClick={handleBuyNow}
                  data-ocid="detail-buy-now"
                >
                  <Zap className="size-5" />
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  aria-label="Save to wishlist"
                  className="shrink-0 px-4"
                >
                  <Heart className="size-5" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  {
                    icon: Truck,
                    label: "Free Delivery",
                    sub: "Orders over $49",
                  },
                  {
                    icon: ShieldCheck,
                    label: "2-Yr Warranty",
                    sub: "Manufacturer",
                  },
                  {
                    icon: Package,
                    label: "Easy Returns",
                    sub: "30-day policy",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-3 bg-muted/30 rounded-xl text-center border border-border/50"
                  >
                    <Icon className="size-5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      {label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Tabs defaultValue="description" data-ocid="product-tabs">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" data-ocid="reviews-tab">
                  Reviews ({reviews?.length ?? 0})
                </TabsTrigger>
              </TabsList>

              {/* Description tab */}
              <TabsContent
                value="description"
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description}
                </p>
              </TabsContent>

              {/* Specifications tab */}
              <TabsContent
                value="specs"
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                {product.specifications?.length ? (
                  <div className="divide-y divide-border">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec.key}
                        className="flex flex-col sm:flex-row py-3.5 gap-1 sm:gap-4"
                      >
                        <span className="text-sm font-semibold text-foreground sm:w-48 shrink-0">
                          {spec.key}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No specifications available for this product.
                  </p>
                )}
              </TabsContent>

              {/* Reviews tab */}
              <TabsContent
                value="reviews"
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                {/* Review form or CTA */}
                {isAuthenticated && principal ? (
                  <div className="mb-8">
                    <ReviewForm
                      productId={id}
                      userId={principal}
                      displayName={displayName ?? "Anonymous"}
                    />
                  </div>
                ) : (
                  <div className="mb-8 bg-muted/30 rounded-xl border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        Share your experience
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Login to write a review and help others decide.
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="gap-2 shrink-0"
                      data-ocid="login-to-review"
                    >
                      <Link to="/login">
                        <LogIn className="size-4" />
                        Login to Review
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Reviews list */}
                {reviews?.length ? (
                  <div>
                    {/* Rating summary */}
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                      <div className="text-center">
                        <p className="font-display font-bold text-5xl text-foreground leading-none">
                          {product.rating.toFixed(1)}
                        </p>
                        <StarRating rating={product.rating} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Number(product.reviewCount).toLocaleString()} reviews
                        </p>
                      </div>
                    </div>
                    <div data-ocid="reviews-list">
                      {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="reviews-empty"
                  >
                    <Star className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No reviews yet</p>
                    <p className="text-sm mt-1">
                      Be the first to review this product!
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* ── Related Products ──────────────────────── */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-14"
              aria-label="Related products"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-foreground">
                  Related Products
                </h2>
                <Link
                  to="/products"
                  search={{ category: product.category }}
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="size-4" />
                </Link>
              </div>
              <ScrollArea className="w-full" type="scroll">
                <div
                  className="flex gap-4 pb-4"
                  style={{ width: "max-content" }}
                  data-ocid="related-products"
                >
                  {relatedProducts.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="w-52 shrink-0"
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.section>
          )}
        </div>
      </div>
    </Layout>
  );
}
