import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Lock, MapPin, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useOrders";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartCount === 0) {
      navigate({ to: "/cart" });
    }
  }, [cartCount, navigate]);

  const shippingCost = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingCost + tax;

  const updateShipping =
    (key: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setShipping((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handlePaymentChange = (key: keyof PaymentForm, raw: string) => {
    let value = raw;
    if (key === "cardNumber") value = formatCardNumber(raw);
    if (key === "expiry") value = formatExpiry(raw);
    if (key === "cvv") value = raw.replace(/\D/g, "").slice(0, 4);
    setPayment((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartCount === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const rawCard = payment.cardNumber.replace(/\s/g, "");
    if (
      rawCard.length < 16 ||
      !payment.expiry ||
      payment.cvv.length < 3 ||
      !payment.cardName
    ) {
      toast.error("Please fill in all payment details");
      return;
    }
    const shippingAddress = [
      `${shipping.firstName} ${shipping.lastName}`,
      shipping.address1,
      shipping.address2,
      `${shipping.city}, ${shipping.state} ${shipping.zip}`,
      shipping.country,
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const userId = principal ?? "guest-user";
      const order = await placeOrder({ userId, shippingAddress });
      clearCart();
      navigate({ to: "/checkout/confirm", search: { orderId: order.id } });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!isAuthenticated || cartCount === 0) return null;

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6 flex items-center gap-2"
          >
            <Lock className="size-6 text-primary" />
            Secure Checkout
          </motion.h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-5">
                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6 card-elevation"
                >
                  <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      1
                    </div>
                    <MapPin className="size-4 text-primary" />
                    Shipping Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shipping.firstName}
                        onChange={updateShipping("firstName")}
                        required
                        placeholder="John"
                        className="mt-1"
                        data-ocid="checkout-firstname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shipping.lastName}
                        onChange={updateShipping("lastName")}
                        required
                        placeholder="Doe"
                        className="mt-1"
                        data-ocid="checkout-lastname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shipping.email}
                        onChange={updateShipping("email")}
                        required
                        placeholder="john@example.com"
                        className="mt-1"
                        data-ocid="checkout-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shipping.phone}
                        onChange={updateShipping("phone")}
                        required
                        placeholder="+1 (555) 000-0000"
                        className="mt-1"
                        data-ocid="checkout-phone"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={shipping.address1}
                        onChange={updateShipping("address1")}
                        required
                        placeholder="123 Main Street"
                        className="mt-1"
                        data-ocid="checkout-address1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address2">
                        Address Line 2{" "}
                        <span className="text-muted-foreground text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        id="address2"
                        value={shipping.address2}
                        onChange={updateShipping("address2")}
                        placeholder="Apt, Suite, Floor..."
                        className="mt-1"
                        data-ocid="checkout-address2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shipping.city}
                        onChange={updateShipping("city")}
                        required
                        placeholder="New York"
                        className="mt-1"
                        data-ocid="checkout-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Province *</Label>
                      <Input
                        id="state"
                        value={shipping.state}
                        onChange={updateShipping("state")}
                        required
                        placeholder="NY"
                        className="mt-1"
                        data-ocid="checkout-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP / Postal Code *</Label>
                      <Input
                        id="zip"
                        value={shipping.zip}
                        onChange={updateShipping("zip")}
                        required
                        placeholder="10001"
                        className="mt-1"
                        data-ocid="checkout-zip"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shipping.country}
                        onChange={updateShipping("country")}
                        required
                        placeholder="United States"
                        className="mt-1"
                        data-ocid="checkout-country"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 card-elevation"
                >
                  <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      2
                    </div>
                    <CreditCard className="size-4 text-primary" />
                    Payment Details
                  </h2>

                  {/* Card preview */}
                  <div className="rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-5 mb-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
                    <p className="text-xs opacity-70 mb-3 font-medium tracking-wider uppercase">
                      Payment Card
                    </p>
                    <p className="font-mono text-lg tracking-widest mb-3">
                      {payment.cardNumber || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-70 uppercase tracking-wider mb-0.5">
                          Cardholder Name
                        </p>
                        <p className="font-medium text-sm">
                          {payment.cardName || "YOUR NAME"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-70 uppercase tracking-wider mb-0.5">
                          Expires
                        </p>
                        <p className="font-mono font-medium text-sm">
                          {payment.expiry || "MM/YY"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={payment.cardNumber}
                        onChange={(e) =>
                          handlePaymentChange("cardNumber", e.target.value)
                        }
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="mt-1 font-mono tracking-widest"
                        data-ocid="checkout-card-number"
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        value={payment.cardName}
                        onChange={(e) =>
                          handlePaymentChange("cardName", e.target.value)
                        }
                        required
                        placeholder="John Doe"
                        className="mt-1"
                        data-ocid="checkout-card-name"
                        autoComplete="cc-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry (MM/YY) *</Label>
                      <Input
                        id="expiry"
                        value={payment.expiry}
                        onChange={(e) =>
                          handlePaymentChange("expiry", e.target.value)
                        }
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="mt-1 font-mono"
                        data-ocid="checkout-expiry"
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={payment.cvv}
                        onChange={(e) =>
                          handlePaymentChange("cvv", e.target.value)
                        }
                        required
                        placeholder="•••"
                        maxLength={4}
                        className="mt-1 font-mono"
                        data-ocid="checkout-cvv"
                        autoComplete="cc-csc"
                        type="password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
                    <Lock className="size-3.5 text-green-600 shrink-0" />
                    <span>
                      Your payment is encrypted and processed securely. We never
                      store card details.
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column — Order Summary */}
              <div className="lg:w-80 w-full shrink-0">
                <div
                  className="bg-card rounded-xl border border-border p-6 card-elevation sticky top-24"
                  data-ocid="checkout-order-summary"
                >
                  <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
                    <ShoppingBag className="size-5 text-primary" />
                    Order Summary
                  </h2>

                  {/* Items list */}
                  <div className="flex flex-col gap-3 max-h-52 overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-3 text-sm"
                        data-ocid={`summary-item-${item.productId}`}
                      >
                        <div className="w-11 h-11 rounded-lg bg-muted/40 overflow-hidden shrink-0 border border-border">
                          <img
                            src={
                              item.productImage ||
                              "/assets/images/placeholder.svg"
                            }
                            alt={item.productName}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate text-xs leading-tight">
                            {item.productName}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Qty {item.quantity} · ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <span className="font-semibold text-foreground text-sm shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="mb-4" />

                  <div className="flex flex-col gap-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span
                        className={shippingCost === 0 ? "text-green-600" : ""}
                      >
                        {shippingCost === 0
                          ? "FREE"
                          : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary">
                        ${orderTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    size="lg"
                    disabled={isPending}
                    data-ocid="pay-now-btn"
                  >
                    <Lock className="size-4" />
                    {isPending
                      ? "Processing..."
                      : `Pay $${orderTotal.toFixed(2)}`}
                  </Button>

                  <div className="mt-3 text-center">
                    <Link
                      to="/cart"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      ← Back to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
