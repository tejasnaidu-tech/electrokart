import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const VALID_PROMOS: Record<string, number> = {
  ELECTRA10: 0.1,
  SAVE20: 0.2,
  TECH15: 0.15,
};

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, removeItem, updateQuantity } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const handleApplyPromo = () => {
    const upper = promoCode.trim().toUpperCase();
    if (!upper) return;
    if (appliedPromo) {
      toast.info("Remove current promo first");
      return;
    }
    const discount = VALID_PROMOS[upper];
    if (discount) {
      setAppliedPromo({ code: upper, discount });
      toast.success(`Promo applied! ${discount * 100}% off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    } else {
      navigate({ to: "/checkout" });
    }
  };

  if (cartCount === 0) {
    return (
      <Layout>
        <div
          className="container mx-auto px-4 py-24 text-center max-w-md"
          data-ocid="empty-cart"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingCart className="size-14 text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-2xl mb-3">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Looks like you haven't added any items yet. Explore our latest
              electronics and find something you'll love.
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="gap-2 px-8"
                data-ocid="cart-shop-btn"
              >
                Continue Shopping <ArrowRight className="size-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const promoDiscount = appliedPromo ? cartTotal * appliedPromo.discount : 0;
  const tax = (cartTotal - promoDiscount) * 0.08;
  const orderTotal = cartTotal - promoDiscount + shipping + tax;

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6 flex items-center gap-3"
          >
            <ShoppingCart className="size-7 text-primary" />
            Shopping Cart
            <Badge variant="secondary" className="text-sm font-normal">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </Badge>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-3">
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-xl border border-border p-4 flex gap-4 card-elevation hover:shadow-md transition-shadow"
                  data-ocid={`cart-item-${item.productId}`}
                >
                  {/* Product Image */}
                  <Link to="/products/$id" params={{ id: item.productId }}>
                    <div className="w-24 h-24 rounded-lg bg-muted/40 overflow-hidden shrink-0 border border-border">
                      <img
                        src={
                          item.productImage || "/assets/images/placeholder.svg"
                        }
                        alt={item.productName}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <Link
                      to="/products/$id"
                      params={{ id: item.productId }}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm leading-snug"
                    >
                      {item.productName}
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-foreground text-base">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                          <Badge
                            variant="destructive"
                            className="text-xs py-0 h-4"
                          >
                            {Math.round(
                              (1 - item.price / item.originalPrice) * 100,
                            )}
                            % off
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          aria-label="Decrease quantity"
                          data-ocid={`qty-dec-${item.productId}`}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span
                          className="px-3 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center"
                          data-ocid={`qty-val-${item.productId}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-2 hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                          data-ocid={`qty-inc-${item.productId}`}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        Subtotal:{" "}
                        <strong className="text-foreground font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                        aria-label="Remove item"
                        data-ocid={`remove-${item.productId}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Shipping notice */}
              {shipping > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                  <span className="text-primary font-medium">
                    Add ${(50 - cartTotal).toFixed(2)} more to get FREE
                    shipping!
                  </span>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 w-full shrink-0">
              <div
                className="bg-card rounded-xl border border-border p-6 card-elevation sticky top-24"
                data-ocid="order-summary"
              >
                <h2 className="font-display font-semibold text-lg text-foreground mb-5">
                  Order Summary
                </h2>

                {/* Line items */}
                <div className="flex flex-col gap-2.5 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"}
                      )
                    </span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="size-3" />
                        Promo ({appliedPromo.code})
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs underline ml-1"
                          data-ocid="remove-promo"
                        >
                          Remove
                        </button>
                      </span>
                      <span className="font-medium">
                        -${promoDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-green-600 font-medium"
                          : "font-medium"
                      }
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 -mt-1">
                      🎉 Free shipping applied!
                    </p>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Tax (8%)
                    </span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-bold text-base mb-5">
                  <span>Order Total</span>
                  <span className="text-primary">${orderTotal.toFixed(2)}</span>
                </div>

                {/* Promo code */}
                {!appliedPromo && (
                  <div className="mb-5">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Tag className="size-3" /> Promo Code
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyPromo()
                        }
                        className="flex-1 h-9 text-sm"
                        data-ocid="promo-input"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleApplyPromo}
                        className="h-9 shrink-0"
                        data-ocid="apply-promo-btn"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  data-ocid="proceed-checkout"
                >
                  Proceed to Checkout <ArrowRight className="size-4" />
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You'll be asked to login before checkout
                  </p>
                )}

                <Link
                  to="/products"
                  className="block text-center text-sm text-primary hover:underline mt-3 transition-colors"
                  data-ocid="continue-shopping"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
