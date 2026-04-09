import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
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

// ── Order Detail Drawer ────────────────────────────────────────────────────────
function OrderDetailDrawer({
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
    <dialog
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-sm w-full h-full max-w-none max-h-none border-0 p-0 m-0 bg-transparent open:flex"
      data-ocid="order-detail-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      open
      aria-label="Order details"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-xs text-muted-foreground">Order Details</p>
            <p className="font-mono text-sm font-semibold text-foreground truncate max-w-[220px]">
              #{order.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.badgeClass}`}
            >
              <StatusIcon className="size-3.5" />
              {status.label}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status Timeline */}
          {!isCancelled && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Order Progress
              </p>
              <div className="relative flex items-center justify-between">
                {/* progress bar */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500"
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

          {/* Order Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Order Date</p>
              <p className="text-sm font-medium text-foreground">{dateStr}</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-0.5">
                Order Total
              </p>
              <p className="text-sm font-bold text-foreground">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Items ({order.items.length})
            </p>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: order items stable
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="size-5 text-muted-foreground" />
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
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="size-4 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </dialog>
  );
}
function OrdersTable({
  orders,
  isLoading,
  onViewDetails,
}: {
  orders: Order[] | undefined;
  isLoading: boolean;
  onViewDetails: (order: Order) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="orders-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-16" data-ocid="empty-orders">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Package className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg mb-2">
          No Orders Yet
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          You haven't placed any orders yet. Start shopping!
        </p>
        <Link to="/products">
          <Button className="gap-2" data-ocid="empty-orders-shop-btn">
            <ShoppingBag className="size-4" />
            Shop Now
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-xl border border-border"
      data-ocid="orders-table"
    >
      <table className="w-full text-sm">
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
            const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            return (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                data-ocid={`order-row-${order.id}`}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-foreground truncate block max-w-[100px]">
                    {order.id.slice(0, 10)}…
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {new Date(
                    Number(order.createdAt) / 1_000_000,
                  ).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell">
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
                    className="gap-1 text-primary hover:text-primary"
                    onClick={() => onViewDetails(order)}
                    data-ocid={`view-order-${order.id}`}
                  >
                    Details
                    <ChevronRight className="size-3.5" />
                  </Button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { isAuthenticated, principal, displayName, logout } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders(principal);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "??";
  const totalSpent = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;
  const memberSince = "2024"; // Static since we don't have account creation date

  const handleCopyPrincipal = () => {
    if (principal) {
      navigator.clipboard.writeText(principal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Profile Hero Banner */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              data-ocid="account-profile"
            >
              {/* Avatar */}
              <div className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shrink-0 shadow-md">
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display font-bold text-xl text-foreground">
                    My Account
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 text-xs"
                  >
                    <ShieldCheck className="size-3 mr-1" />
                    Standard Member
                  </Badge>
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {principal}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPrincipal}
                    aria-label="Copy principal ID"
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  {copied && (
                    <span className="text-xs text-primary font-medium">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              {/* Logout */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
                onClick={logout}
                data-ocid="account-logout-btn"
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4 mt-6"
              data-ocid="account-stats"
            >
              {[
                {
                  label: "Total Orders",
                  value: isLoading ? "—" : String(orders?.length ?? 0),
                  icon: Package,
                },
                {
                  label: "Total Spent",
                  value: isLoading ? "—" : `$${totalSpent.toFixed(2)}`,
                  icon: ShoppingBag,
                },
                {
                  label: "Member Since",
                  value: memberSince,
                  icon: User,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <p className="text-lg md:text-2xl font-display font-bold text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                    <Icon className="size-3" />
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="orders">
            <TabsList className="mb-6 bg-card border border-border shadow-sm">
              <TabsTrigger
                value="orders"
                className="gap-2"
                data-ocid="tab-orders"
              >
                <Package className="size-4" />
                My Orders
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-2"
                data-ocid="tab-settings"
              >
                <Settings className="size-4" />
                Account Settings
              </TabsTrigger>
            </TabsList>

            {/* My Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-display font-semibold text-foreground">
                    Order History
                  </h2>
                  <Link to="/account/orders">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-primary"
                      data-ocid="view-all-orders-link"
                    >
                      View All <ExternalLink className="size-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="p-5">
                  <OrdersTable
                    orders={orders}
                    isLoading={isLoading}
                    onViewDetails={setSelectedOrder}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="settings">
              <div
                className="bg-card rounded-xl border border-border shadow-sm"
                data-ocid="account-settings"
              >
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-display font-semibold text-foreground">
                    Account Settings
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Your account details and identity information.
                  </p>
                </div>

                <div className="p-5 space-y-5">
                  {/* Principal ID */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Principal ID
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 p-3 bg-muted/40 rounded-lg border border-border">
                      <p className="font-mono text-xs text-foreground break-all flex-1">
                        {principal}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPrincipal}
                        aria-label="Copy principal ID"
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="size-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-primary mt-1 font-medium">
                        Copied to clipboard!
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Account Type */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Authentication Method
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                      <ShieldCheck className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Internet Identity
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Secure, anonymous blockchain identity
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Account Tier */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Account Tier
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                      <User className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Standard Member
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Full access to all store features
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Logout */}
                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-2 w-full sm:w-auto"
                      onClick={logout}
                      data-ocid="settings-logout-btn"
                    >
                      <LogOut className="size-4" />
                      Sign Out of Account
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      You will be signed out and redirected to the home page.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Layout>
  );
}
