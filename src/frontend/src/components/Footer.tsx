import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { CATEGORIES } from "../types";

const footerLinks = {
  "Customer Service": [
    "Help Center",
    "Track Order",
    "Returns & Refunds",
    "Contact Us",
  ],
  Company: ["About Us", "Careers", "Press", "Blog"],
  Shop: ["Deals of the Day", "New Arrivals", "Best Sellers", "Gift Cards"],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "electroshop";
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-muted/40 border-t border-border">
      {/* Category Strip */}
      <div className="bg-primary/5 border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Shop:
            </span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to="/products"
                search={{ category: cat }}
                className="text-sm text-primary hover:underline font-medium transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">
                  E
                </span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                ElectroShop
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your trusted destination for premium electronics. Best prices,
              fast delivery, and genuine products.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="https://electroshop.ai"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-smooth"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display font-semibold text-foreground mb-4">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="https://electroshop.ai"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-primary" />
              <span>1800-000-1234</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 text-primary" />
              <span>support@electroshop.ai</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <a
              href="https://electroshop.ai/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://electroshop.ai/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="https://electroshop.ai/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ElectroShop. Built with love using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
