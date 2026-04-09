import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CATEGORIES } from "../types";

export function Header() {
  const { cartCount } = useCart();
  const { isAuthenticated, displayName, login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/products", search: { q: searchQuery.trim() } });
      setSearchQuery("");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md"
      data-ocid="header"
    >
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-md bg-primary-foreground/20 flex items-center justify-center">
              <Zap className="size-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              ElectroShop
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl"
            data-ocid="search-bar"
          >
            <div className="relative flex">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices, accessories..."
                className="rounded-r-none border-0 bg-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/30 h-10"
                data-ocid="search-input"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-l-none bg-accent hover:bg-accent/90 text-accent-foreground border-0 h-10 px-4"
                data-ocid="search-btn"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/account">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground gap-1.5"
                    data-ocid="account-btn"
                  >
                    <User className="size-4" />
                    <span className="font-mono text-xs max-w-[80px] truncate">
                      {displayName}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  aria-label="Log out"
                  data-ocid="logout-btn"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                className="hidden sm:flex text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground gap-1.5"
                data-ocid="login-btn"
              >
                <LogIn className="size-4" />
                Login
              </Button>
            )}

            {/* Cart */}
            <Link to="/cart" data-ocid="cart-btn">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground gap-1.5"
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                <span className="hidden md:inline">Cart</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              data-ocid="mobile-menu-btn"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="hidden md:block bg-primary/90 border-t border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 h-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to="/products"
                search={{ category: cat }}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground font-medium transition-colors hover:underline underline-offset-4"
                data-ocid={`nav-${cat.toLowerCase()}`}
              >
                {cat}
              </Link>
            ))}
            <Link
              to="/products"
              className="text-sm text-accent-foreground bg-accent/80 hover:bg-accent px-3 py-1 rounded-full font-semibold ml-auto transition-smooth"
            >
              🔥 Today's Deals
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 bg-card p-0">
          <SheetHeader className="bg-primary p-4">
            <SheetTitle className="text-primary-foreground font-display text-left">
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 flex flex-col gap-1">
            {/* Auth in mobile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="size-4 text-primary-foreground" />
                </div>
                <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                  {displayName}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={logout}
                  aria-label="Log out"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                className="mb-2 w-full"
                data-ocid="mobile-login-btn"
              >
                <LogIn className="size-4" />
                Login with Internet Identity
              </Button>
            )}

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-1">
              Categories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to="/products"
                search={{ category: cat }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
                data-ocid={`mobile-nav-${cat.toLowerCase()}`}
              >
                {cat}
              </Link>
            ))}

            <div className="h-px bg-border my-2" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-1">
              Account
            </p>
            {isAuthenticated && (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <User className="size-4 text-muted-foreground" />
                  My Account
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <Package className="size-4 text-muted-foreground" />
                  Order History
                </Link>
              </>
            )}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <ShoppingCart className="size-4 text-muted-foreground" />
              Cart
              {cartCount > 0 && (
                <Badge className="ml-auto bg-destructive text-destructive-foreground">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
