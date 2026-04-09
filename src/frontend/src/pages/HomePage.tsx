import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Laptop,
  Package,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Truck,
  Tv,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

// ────────────────────────────────────────────────────
// Static data
// ────────────────────────────────────────────────────
const banners = [
  {
    id: 1,
    badge: "🔥 Biggest Electronics Sale",
    headline: "Upgrade Your World.",
    sub: "50% Off Top Brands",
    desc: "Shop the latest mobiles, laptops, and accessories at unbeatable prices.",
    cta: "Shop Now",
    category: "Mobiles",
  },
  {
    id: 2,
    badge: "💻 Laptop Season",
    headline: "Power Meets Portability.",
    sub: "Up to 40% Off Ultrabooks",
    desc: "Professional-grade performance built for creators, students & professionals.",
    cta: "Browse Laptops",
    category: "Laptops",
  },
  {
    id: 3,
    badge: "🎧 Premium Audio",
    headline: "Hear Every Detail.",
    sub: "Noise-Cancelling Deals",
    desc: "True wireless earbuds and studio-grade headphones at incredible prices.",
    cta: "Shop Accessories",
    category: "Accessories",
  },
] as const;

const categoryCards = [
  {
    name: "Mobiles",
    icon: Smartphone,
    desc: "Flagship phones & more",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    name: "Laptops",
    icon: Laptop,
    desc: "Ultrabooks & workstations",
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    name: "Accessories",
    icon: Headphones,
    desc: "Audio, cables & peripherals",
    gradient: "from-cyan-600 to-teal-700",
  },
  {
    name: "Appliances",
    icon: Tv,
    desc: "Smart TVs & home tech",
    gradient: "from-blue-700 to-indigo-900",
  },
] as const;

const trustBadges = [
  { icon: Truck, label: "Free Delivery", sub: "Orders over $50" },
  { icon: Shield, label: "2-Year Warranty", sub: "All genuine products" },
  { icon: Zap, label: "24/7 Support", sub: "Expert assistance" },
  { icon: Package, label: "Easy Returns", sub: "30-day hassle free" },
];

// ────────────────────────────────────────────────────
// Skeleton helpers
// ────────────────────────────────────────────────────
function ProductSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder list
          key={i}
          className="flex flex-col gap-3"
        >
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </>
  );
}

// ────────────────────────────────────────────────────
// Section header helper
// ────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  linkLabel,
  search,
}: {
  icon: React.ElementType;
  title: string;
  linkLabel?: string;
  search?: { sortBy?: string; category?: string };
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      {linkLabel && (
        <Link
          to="/products"
          search={search}
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group"
        >
          {linkLabel}
          <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────
export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const navigate = useNavigate();

  const { data: trendingProducts, isLoading: loadingTrending } = useProducts({
    sortBy: "rating",
  });

  const { data: featuredProducts, isLoading: loadingFeatured } = useProducts({
    sortBy: "newest",
  });

  // Auto-advance banner
  useEffect(() => {
    const t = setInterval(
      () => setBannerIdx((p) => (p + 1) % banners.length),
      5500,
    );
    return () => clearInterval(t);
  }, []);

  const banner = banners[bannerIdx];

  const trendingList = (trendingProducts ?? [])
    .filter((p) => p.isTrending)
    .slice(0, 6);

  const newArrivalList = (featuredProducts ?? [])
    .filter((p) => p.isFeatured)
    .slice(0, 4);

  return (
    <Layout>
      {/* ─── Hero Banner ─────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "380px" }}
        data-ocid="hero-section"
      >
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-electronics.dim_1600x600.jpg"
            alt="Electronics Sale"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.2_0.12_240/0.92)] via-[oklch(0.25_0.1_240/0.75)] to-[oklch(0.3_0.12_200/0.4)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 min-h-[380px]">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 max-w-xl"
          >
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/20">
              {banner.badge}
            </span>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-2">
              {banner.headline}
            </h1>
            <p className="text-2xl md:text-3xl font-display font-semibold text-cyan-300 mb-3">
              {banner.sub}
            </p>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">
              {banner.desc}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-lg px-8"
                onClick={() =>
                  navigate({
                    to: "/products",
                    search: { category: banner.category },
                  })
                }
                data-ocid="hero-cta"
              >
                {banner.cta} <ArrowRight className="size-4" />
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold"
                onClick={() => navigate({ to: "/products" })}
                data-ocid="hero-browse-all"
              >
                Browse All
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Banner indicators + nav */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((b, i) => (
            <button
              type="button"
              key={b.id}
              onClick={() => setBannerIdx(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === bannerIdx ? "bg-white w-8" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setBannerIdx((p) => (p - 1 + banners.length) % banners.length)
          }
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-smooth"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setBannerIdx((p) => (p + 1) % banners.length)}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-smooth"
        >
          <ChevronRight className="size-5" />
        </button>
      </section>

      {/* ─── Trust badges ────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-4 border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 shrink-0">
                  <Icon className="size-4 opacity-90" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{label}</p>
                  <p className="text-xs opacity-70 leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category Cards ───────────────────────────── */}
      <section className="py-10 bg-background" data-ocid="categories-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground">
              Shop by Category
            </h2>
            <Badge
              variant="secondary"
              className="text-xs font-medium hidden md:flex"
            >
              4 Categories
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryCards.map(({ name, icon: Icon, desc, gradient }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  to="/products"
                  search={{ category: name }}
                  className="group block h-full"
                  data-ocid={`category-${name.toLowerCase()}`}
                >
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${gradient} overflow-hidden p-5 md:p-7 flex flex-col items-start gap-3 shadow-md hover:shadow-xl transition-smooth cursor-pointer`}
                  >
                    {/* Background accent circle */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full bg-white/10" />

                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Icon className="size-6 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="font-display font-bold text-lg text-white leading-tight">
                        {name}
                      </p>
                      <p className="text-xs text-white/75 mt-0.5">{desc}</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-1 text-white/80 text-xs font-medium mt-1 group-hover:text-white transition-colors">
                      Explore{" "}
                      <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trending Now ─────────────────────────────── */}
      <section className="py-10 bg-muted/30" data-ocid="trending-section">
        <div className="container mx-auto px-4">
          <SectionHeader
            icon={TrendingUp}
            title="Trending Now"
            linkLabel="View All"
            search={{ sortBy: "rating" }}
          />
          {loadingTrending ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <ProductSkeleton count={6} />
            </div>
          ) : trendingList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {trendingList.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            // Fallback: show first 6 products if none flagged as trending
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {(trendingProducts ?? []).slice(0, 6).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Promo Strip ──────────────────────────────── */}
      <section className="bg-primary py-5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display font-semibold text-lg md:text-xl tracking-wide flex items-center justify-center gap-2">
            <Truck className="size-5 opacity-80" />
            Free shipping on orders over $50
            <span className="hidden md:inline text-primary-foreground/70 font-normal text-sm ml-1">
              — Use code{" "}
              <span className="font-bold text-primary-foreground">
                FREESHIP
              </span>{" "}
              at checkout
            </span>
          </p>
        </div>
      </section>

      {/* ─── New Arrivals ─────────────────────────────── */}
      <section className="py-10 bg-background" data-ocid="new-arrivals-section">
        <div className="container mx-auto px-4">
          <SectionHeader icon={Sparkles} title="New Arrivals" />
          {loadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <ProductSkeleton count={4} />
            </div>
          ) : newArrivalList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {newArrivalList.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            // Fallback: show 4 featured or top-rated products
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(featuredProducts ?? []).slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Sign-up Promo ────────────────────────────── */}
      <section className="py-10 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
          >
            <div>
              <Badge className="bg-white/20 text-white border-none mb-3 text-xs font-semibold tracking-wide uppercase">
                New User Offer
              </Badge>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                Get 10% Off Your First Order
              </h2>
              <p className="text-white/75 text-base max-w-md">
                Create an account using Internet Identity and enjoy exclusive
                member pricing on top electronics brands.
              </p>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-md"
                  data-ocid="signup-promo-cta"
                >
                  Get Started <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
