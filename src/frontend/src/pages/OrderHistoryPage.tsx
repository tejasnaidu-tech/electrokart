import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types";

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  processing: {
    label: "Processing",
    icon: Package,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    badgeClass: "bg-accent/10 text-accent-foreground border-accent/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    badgeClass: "bg-primary/20 text-primary border-primary/30 font-medium",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const STATUS_TIMELINE = ["pending", "confirmed", "shipped", "delivered"];

// ── Order Detail Panel ─────────────────────────────────────────────────────────
function OrderDetailPanel({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const currentStepIdx = STATUS_TIMELINE.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  const dateStr = new Date(
    Number(order.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
      data-ocid="order-detail-panel"
    >
      {/* Header */}
      <div className="bg-muted/30 border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Order Details</p>
          <p className="font-mono text-sm font-semibold text-foreground truncate max-w-[180px]">
            #{order.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeClass}`}
          >
            <StatusIcon className="size-3" />
            {status.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Timeline */}
        {!isCancelled && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Order Progress
            </p>
            <div className="relative flex items-center justify-between">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-700"
                style={{
                  width:
                    currentStepIdx < 0
                      ? "0%"
                      : `${(currentStepIdx / (STATUS_TIMELINE.length - 1)) * 100}%`,
                }}
              />
              {STATUS_TIMELINE.map((step, i) => {
                const cfg = STATUS_CONFIG[step];
                const Icon = cfg.icon;
                const done = i <= currentStepIdx;
                return (
                  <div
                    key={step}
                    className="relative flex flex-col items-center gap-1.5 z-10"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"}`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <span
                      className={`text-[10px] font-medium capitalize ${done ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Order Date</p>
            <p className="text-sm font-medium text-foreground">{dateStr}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Total</p>
            <p className="text-sm font-bold text-foreground">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Items ({order.items.length})
          </p>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable order items
                key={idx}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Product #{item.productId.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {Number(item.quantity)} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0">
                  ${(Number(item.quantity) * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        {order.shippingAddress && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Shipping Address
            </p>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="size-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {order.shippingAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function OrderHistoryPage() {
  const { isAuthenticated, principal, login } = useAuth();
  const { data: orders, isLoading } = useOrders(principal);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="container mx-auto px-4 py-24 text-center"
          data-ocid="orders-auth-prompt"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="size-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">
            Login to View Orders
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in to see your full order history and track shipments.
          </p>
          <Button size="lg" onClick={login} data-ocid="orders-login-btn">
            Login with Internet Identity
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/account">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    data-ocid="orders-back-btn"
                  >
                    <ArrowLeft className="size-4" />
                    Account
                  </Button>
                </Link>
                <div className="w-px h-5 bg-border" />
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-primary" />
                  <h1 className="font-display font-bold text-xl text-foreground">
                    Order History
                  </h1>
                </div>
              </div>
              <Link to="/products">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                  data-ocid="orders-shop-more-btn"
                >
                  <ShoppingBag className="size-4" />
                  Shop More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Summary bar */}
          {!isLoading && orders && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-5 text-sm text-muted-foreground"
            >
              <span>
                <strong className="text-foreground">{orders.length}</strong>{" "}
                {orders.length === 1 ? "order" : "orders"} found
              </span>
              <span>•</span>
              <span>
                Total spent:{" "}
                <strong className="text-foreground">
                  ${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}
                </strong>
              </span>
            </motion.div>
          )}

          {/* Main content: table + detail panel */}
          <div
            className={`grid gap-6 ${selectedOrder ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {/* Orders list */}
            <div>
              {isLoading ? (
                <div className="space-y-3" data-ocid="orders-loading">
                  {Array.from({ length: 4 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : !orders?.length ? (
                <div
                  className="bg-card rounded-xl border border-border shadow-sm py-20 text-center"
                  data-ocid="empty-orders"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Package className="size-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                    You haven't placed any orders. Discover amazing electronics
                    to get started!
                  </p>
                  <Link to="/products">
                    <Button className="gap-2" data-ocid="empty-orders-shop-btn">
                      Browse Products
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-ocid="orders-table">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Order #
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                            Date
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                            Items
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Total
                          </th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, i) => {
                          const status =
                            STATUS_CONFIG[order.status] ??
                            STATUS_CONFIG.pending;
                          const StatusIcon = status.icon;
                          const isSelected = selectedOrder?.id === order.id;
                          return (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className={`border-b border-border last:border-0 transition-colors cursor-pointer ${isSelected ? "bg-primary/5" : "hover:bg-muted/20"}`}
                              onClick={() =>
                                setSelectedOrder(isSelected ? null : order)
                              }
                              data-ocid={`order-row-${order.id}`}
                            >
                              <td className="px-4 py-3">
                                <span className="font-mono text-xs text-foreground truncate block max-w-[90px]">
                                  {order.id.slice(0, 10)}…
                                </span>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                                {new Date(
                                  Number(order.createdAt) / 1_000_000,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-center text-muted-foreground text-xs hidden md:table-cell">
                                {order.items.length}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-foreground">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeClass}`}
                                >
                                  <StatusIcon className="size-3" />
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className={`gap-1 ${isSelected ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(isSelected ? null : order);
                                  }}
                                  data-ocid={`view-order-${order.id}`}
                                >
                                  {isSelected ? "Close" : "Details"}
                                  <ChevronRight
                                    className={`size-3.5 transition-transform ${isSelected ? "rotate-90" : ""}`}
                                  />
                                </Button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Detail Panel — shown when an order is selected */}
            {selectedOrder && (
              <div className="lg:sticky lg:top-24 lg:self-start">
                <OrderDetailPanel
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
