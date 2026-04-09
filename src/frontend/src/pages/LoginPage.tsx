import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  Loader2,
  Lock,
  Package,
  RefreshCw,
  Shield,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const benefits = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "Free delivery on orders above $50",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "10-day hassle-free return policy",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "100% secure checkout guaranteed",
  },
  {
    icon: Package,
    title: "1 Million+ Products",
    desc: "Widest selection of electronics",
  },
];

const tabs = ["Sign In", "Create Account"] as const;
type Tab = (typeof tabs)[number];

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const redirect = search.redirect ?? "/";

  const [activeTab, setActiveTab] = useState<Tab>("Sign In");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirect });
    }
  }, [isAuthenticated, navigate, redirect]);

  async function handleLogin() {
    setIsLoading(true);
    setLoginError(null);
    try {
      await login();
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Decorative left panel — desktop only */}
      <motion.aside
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-5/12 xl:w-[42%] flex-col justify-between relative overflow-hidden bg-primary"
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-10 bg-primary-foreground" />
        <div className="absolute bottom-12 -right-16 w-64 h-64 rounded-full opacity-10 bg-primary-foreground" />

        <div className="relative z-10 p-10 flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <ShoppingBag className="size-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              ElectroShop
            </span>
          </div>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
              Your Favourite
              <br />
              Electronics Store
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-10 max-w-xs">
              Sign in to access exclusive deals, track your orders, and manage
              your wishlist seamlessly.
            </p>

            <div className="space-y-5">
              {benefits.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{title}</p>
                    <p className="text-white/60 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <CheckCircle2 className="size-4 text-white/40 ml-auto mt-0.5 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer tagline */}
          <p className="text-white/40 text-xs mt-10">
            Trusted by millions of shoppers worldwide
          </p>
        </div>
      </motion.aside>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBag className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              ElectroShop
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-subtle p-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="size-7 text-primary" />
              </div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Welcome to ElectroShop
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Secure, passwordless login powered by Internet Identity
              </p>
            </div>

            {/* Tab Toggle */}
            <div
              className="flex bg-muted rounded-xl p-1 mb-6 gap-1"
              role="tablist"
              aria-label="Login options"
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setLoginError(null);
                  }}
                  data-ocid={tab === "Sign In" ? "tab-signin" : "tab-create"}
                  className={[
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-smooth",
                    activeTab === tab
                      ? "bg-card text-foreground shadow-subtle"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Sign In" ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-muted/60 rounded-xl p-4 mb-5 flex gap-3">
                  <Shield className="size-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Internet Identity
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sign in securely without a password. Internet Identity
                      uses cryptographic keys stored on your device — no email
                      or personal data shared.
                    </p>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3 mb-4">
                    {loginError}
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full gap-2 font-semibold"
                  onClick={handleLogin}
                  disabled={isLoading}
                  data-ocid="signin-ii-btn"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Shield className="size-5" />
                  )}
                  {isLoading ? "Connecting…" : "Sign In with Internet Identity"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By continuing, you agree to our{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-5 flex gap-3">
                  <Zap className="size-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No sign-up required!
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your account is created automatically on first sign-in.
                      Simply authenticate with Internet Identity — we handle the
                      rest instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    "No email address needed",
                    "No password to remember",
                    "Account ready in seconds",
                    "Fully decentralized & secure",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{point}</span>
                    </div>
                  ))}
                </div>

                {loginError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3 mb-4">
                    {loginError}
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full gap-2 font-semibold"
                  onClick={handleLogin}
                  disabled={isLoading}
                  data-ocid="create-ii-btn"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Shield className="size-5" />
                  )}
                  {isLoading
                    ? "Connecting…"
                    : "Get Started with Internet Identity"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  First time? Your ElectroShop account will be created
                  automatically.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5" />
              SSL Secured
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5" />
              Privacy Protected
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Verified Platform
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
