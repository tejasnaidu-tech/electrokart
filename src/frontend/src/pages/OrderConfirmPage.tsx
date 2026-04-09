import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../hooks/useOrders";

function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const DELIVERY_STEPS = [
  { icon: CheckCircle2, label: "Order Placed", done: true },
  { icon: Package, label: "Processing", done: true },
  { icon: Truck, label: "Shipped", done: false },
  { icon: Clock, label: "Delivered", done: false },
];

export default function OrderConfirmPage() {
  const search = useSearch({ from: "/checkout/confirm" });
  const orderId = (search as { orderId?: string }).orderId ?? null;
  const { data: order } = useOrder(orderId);
  const { isAuthenticated } = useAuth();
  const estimatedDelivery = getEstimatedDelivery();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          {/* Success Header */}
          <div
            className="bg-card rounded-2xl border border-border p-8 text-center card-elevation mb-6"
            data-ocid="order-confirm"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="size-14 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h1 className="font-display font-bold text-3xl text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Thank you for your purchase. We've received your order and are
                getting it ready.
              </p>

              {/* Order number */}
              {orderId && (
                <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-lg px-4 py-2 mt-4">
                  <Package className="size-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Order ID:
                  </span>
                  <span className="font-mono font-semibold text-foreground text-sm">
                    {orderId.slice(0, 18)}
                    {orderId.length > 18 ? "..." : ""}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Delivery Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card rounded-xl border border-border p-6 card-elevation mb-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Truck className="size-5 text-primary" />
              <h2 className="font-display font-semibold text-base">
                Delivery Status
              </h2>
            </div>

            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-border mx-8" />
              <div className="absolute left-0 top-5 h-0.5 bg-primary mx-8 w-1/4" />

              {DELIVERY_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-2 relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.done
                        ? "bg-primary border-primary text-primary-foreground"
                        : i === 2
                          ? "bg-background border-primary/40 text-primary/40"
                          : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    <step.icon className="size-4" />
                  </div>
                  <span
                    className={`text-xs font-medium text-center leading-tight ${
                      step.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm bg-primary/5 border border-primary/15 rounded-lg p-3">
              <Clock className="size-4 text-primary shrink-0" />
              <span>
                Estimated delivery by{" "}
                <strong className="text-foreground">{estimatedDelivery}</strong>{" "}
                (5–7 business days)
              </span>
            </div>
          </motion.div>

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-card rounded-xl border border-border p-6 card-elevation mb-6"
              data-ocid="order-details"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="size-5 text-primary" />
                <h2 className="font-display font-semibold text-base">
                  Order Details
                </h2>
                <Badge variant="secondary" className="ml-auto capitalize">
                  {order.status}
                </Badge>
              </div>

              {/* Items */}
              {order.items.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                  {order.items.map((item, i) => (
                    <div
                      key={`${item.productId}-${i}`}
                      className="flex gap-3 text-sm"
                      data-ocid={`confirm-item-${item.productId}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted/40 shrink-0 border border-border overflow-hidden">
                        <img
                          src="/assets/images/placeholder.svg"
                          alt={item.productId}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          Product #{item.productId.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Qty {Number(item.quantity)} · ${item.price.toFixed(2)}{" "}
                          each
                        </p>
                      </div>
                      <span className="font-semibold text-foreground shrink-0">
                        ${(item.price * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="mb-4" />

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="font-bold text-base text-primary">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                {order.shippingAddress && (
                  <div className="mt-1">
                    <span className="text-muted-foreground">Shipping to:</span>
                    <p className="text-foreground text-xs mt-1 leading-relaxed">
                      {order.shippingAddress}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* No order data fallback */}
          {!order && orderId && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-card rounded-xl border border-border p-6 card-elevation mb-6"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order Reference</span>
                <span className="font-mono font-medium text-foreground">
                  {orderId}
                </span>
              </div>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {isAuthenticated && (
              <Link to="/account/orders" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                  data-ocid="view-orders-btn"
                >
                  <ShoppingBag className="size-4" />
                  View My Orders
                </Button>
              </Link>
            )}
            <Link to="/products" className="flex-1">
              <Button
                className="w-full gap-2"
                size="lg"
                data-ocid="continue-shopping-btn"
              >
                Continue Shopping <ArrowRight className="size-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
