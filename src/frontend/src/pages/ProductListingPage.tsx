import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Filter,
  Grid3X3,
  LayoutList,
  PackageSearch,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { BRANDS, CATEGORIES, SORT_OPTIONS } from "../types";
import type { ProductFilters } from "../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const PRICE_MIN = 0;
const PRICE_MAX = 2000;
const PRICE_STEP = 50;

const RATING_OPTIONS = [
  { value: "4", label: "4★ & above" },
  { value: "3", label: "3★ & above" },
  { value: "5", label: "5★ only" },
];

type ViewMode = "grid" | "list";

function buildFiltersFromSearch(search: {
  category?: string;
  brand?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): ProductFilters {
  return {
    category: search.category ?? null,
    brand: search.brand ?? null,
    sortBy: null,
    minPrice: search.minPrice ?? null,
    maxPrice: search.maxPrice ?? null,
    minRating: search.minRating ?? null,
  };
}

// ─── Filter Panel ────────────────────────────────────────────────────────────

function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
}: {
  filters: ProductFilters;
  onFiltersChange: (f: ProductFilters) => void;
  onClose?: () => void;
}) {
  const priceRange: [number, number] = [
    filters.minPrice ?? PRICE_MIN,
    filters.maxPrice ?? PRICE_MAX,
  ];

  const toggleBrand = (brand: string) => {
    onFiltersChange({
      ...filters,
      brand: filters.brand === brand ? null : brand,
    });
  };

  const handleRatingChange = (val: string) => {
    const num = Number.parseInt(val, 10);
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === num ? null : num,
    });
  };

  return (
    <div className="flex flex-col gap-5" data-ocid="filter-panel">
      {/* Category */}
      <section aria-label="Category filter">
        <p className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
          Category
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onFiltersChange({ ...filters, category: null })}
            className={`text-sm px-3 py-1.5 rounded-md text-left transition-colors w-full ${
              !filters.category
                ? "bg-primary text-primary-foreground font-medium"
                : "text-foreground hover:bg-muted"
            }`}
            data-ocid="filter-cat-all"
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => onFiltersChange({ ...filters, category: cat })}
              className={`text-sm px-3 py-1.5 rounded-md text-left transition-colors w-full ${
                filters.category === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
              data-ocid={`filter-cat-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Price Range */}
      <section aria-label="Price range filter">
        <p className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
          Price Range
        </p>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={priceRange}
          onValueChange={(v) => {
            const range = v as [number, number];
            onFiltersChange({
              ...filters,
              minPrice: range[0] === PRICE_MIN ? null : range[0],
              maxPrice: range[1] === PRICE_MAX ? null : range[1],
            });
          }}
          className="mb-3"
          data-ocid="filter-price-slider"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
            ${priceRange[0].toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">—</span>
          <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
            ${priceRange[1].toLocaleString()}
          </span>
        </div>
      </section>

      <Separator />

      {/* Brand */}
      <section aria-label="Brand filter">
        <p className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
          Brand
        </p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          {BRANDS.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brand === brand}
                onCheckedChange={() => toggleBrand(brand)}
                data-ocid={`filter-brand-${brand.toLowerCase()}`}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Rating */}
      <section aria-label="Rating filter">
        <p className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
          Customer Rating
        </p>
        <RadioGroup
          value={filters.minRating?.toString() ?? ""}
          onValueChange={handleRatingChange}
          className="flex flex-col gap-2"
        >
          {RATING_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={opt.value}
                id={`rating-${opt.value}`}
                data-ocid={`filter-rating-${opt.value}`}
              />
              <Label
                htmlFor={`rating-${opt.value}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                <span className="text-primary">
                  {"★".repeat(Number.parseInt(opt.value, 10))}
                </span>
                <span className="text-muted-foreground/50">
                  {"★".repeat(Math.max(0, 5 - Number.parseInt(opt.value, 10)))}
                </span>
                <span className="ml-1">{opt.label.split("★")[1]}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() =>
            onFiltersChange({
              category: null,
              brand: null,
              minPrice: null,
              maxPrice: null,
              minRating: null,
              sortBy: filters.sortBy,
            })
          }
          data-ocid="filter-reset"
          className="w-full"
        >
          <X className="size-4 mr-1.5" />
          Clear All Filters
        </Button>
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            data-ocid="filter-apply"
            className="w-full"
          >
            Show Results
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Active Filter Badges ─────────────────────────────────────────────────────

function ActiveFilterBadges({
  filters,
  onRemove,
}: {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters) => void;
}) {
  const items: { key: keyof ProductFilters; label: string }[] = [];

  if (filters.category)
    items.push({ key: "category", label: filters.category });
  if (filters.brand) items.push({ key: "brand", label: filters.brand });
  if (filters.minPrice != null || filters.maxPrice != null) {
    const lo = filters.minPrice ?? PRICE_MIN;
    const hi = filters.maxPrice ?? PRICE_MAX;
    items.push({
      key: "minPrice",
      label: `$${lo.toLocaleString()} – $${hi.toLocaleString()}`,
    });
  }
  if (filters.minRating != null) {
    const ratingOpt = RATING_OPTIONS.find(
      (o) => Number.parseInt(o.value, 10) === filters.minRating,
    );
    items.push({
      key: "minRating",
      label: ratingOpt ? ratingOpt.label : `${filters.minRating}★+`,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3" data-ocid="active-filters">
      <span className="text-xs text-muted-foreground self-center">
        Active filters:
      </span>
      {items.map((item) => (
        <Badge
          key={item.key}
          variant="secondary"
          className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          onClick={() => onRemove(item.key)}
          data-ocid={`active-filter-${item.key}`}
        >
          {item.label}
          <X className="size-3" />
        </Badge>
      ))}
    </div>
  );
}

// ─── Skeleton Grid ────────────────────────────────────────────────────────────

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      data-ocid="skeleton-grid"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton uses index
          key={i}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-24 mt-1" />
            <Skeleton className="h-8 w-full mt-2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="empty-products"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <PackageSearch className="size-10 text-primary" />
      </div>
      <h3 className="font-display font-bold text-xl mb-2 text-foreground">
        No Products Found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-xs">
        No products match your current filters. Try adjusting or clearing them
        to see more results.
      </p>
      <Button type="button" onClick={onClear} data-ocid="empty-clear-btn">
        Clear All Filters
      </Button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductListingPage() {
  const search = useSearch({ from: "/products" });
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialise filters from URL search params
  const [filters, setFiltersState] = useState<ProductFilters>(() =>
    buildFiltersFromSearch(search),
  );

  // Sync URL → filters when navigating via browser back/forward
  useEffect(() => {
    setFiltersState((prev) => ({
      ...prev,
      category: search.category ?? null,
      brand: search.brand ?? null,
      minPrice: search.minPrice ?? null,
      maxPrice: search.maxPrice ?? null,
      minRating: search.minRating ?? null,
    }));
  }, [
    search.category,
    search.brand,
    search.minPrice,
    search.maxPrice,
    search.minRating,
  ]);

  // Keep URL in sync with filters
  const setFilters = useCallback(
    (next: ProductFilters) => {
      setFiltersState(next);
      navigate({
        to: "/products",
        search: {
          category: next.category ?? undefined,
          brand: next.brand ?? undefined,
          q: search.q,
          minPrice: next.minPrice ?? undefined,
          maxPrice: next.maxPrice ?? undefined,
          minRating: next.minRating ?? undefined,
        },
        replace: true,
      });
    },
    [navigate, search.q],
  );

  const removeFilter = (key: keyof ProductFilters) => {
    const next: ProductFilters = { ...filters };
    if (key === "minPrice") {
      next.minPrice = null;
      next.maxPrice = null;
    } else {
      (next[key] as null) = null;
    }
    setFilters(next);
  };

  const clearFilters = () => {
    setFilters({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      sortBy: null,
    });
  };

  const { data: products, isLoading } = useProducts(filters);

  const count = products?.length ?? 0;

  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.minPrice != null || filters.maxPrice != null ? "price" : null,
    filters.minRating,
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-2 text-sm text-muted-foreground mb-5"
          >
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="hover:text-primary transition-colors"
              data-ocid="breadcrumb-home"
            >
              Home
            </button>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">
              {filters.category ?? "All Products"}
            </span>
          </nav>

          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                {filters.category ?? "All Products"}
              </h1>
              {!isLoading && (
                <p
                  className="text-sm text-muted-foreground mt-0.5"
                  data-ocid="results-count"
                >
                  Showing{" "}
                  <span className="font-semibold text-foreground">{count}</span>{" "}
                  {count === 1 ? "product" : "products"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="lg:hidden gap-2"
                    data-ocid="mobile-filter-btn"
                  >
                    <Filter className="size-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto pb-8">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="size-4" />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClose={() => setMobileFilterOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Sort Select */}
              <Select
                value={filters.sortBy ?? ""}
                onValueChange={(v) =>
                  setFiltersState((prev) => ({
                    ...prev,
                    sortBy: v || null,
                  }))
                }
              >
                <SelectTrigger
                  className="w-[190px] h-9 bg-card"
                  data-ocid="sort-select"
                >
                  <SlidersHorizontal className="size-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort: Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden md:flex border border-border rounded-md overflow-hidden bg-card">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                  aria-label="Grid view"
                  data-ocid="view-grid"
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                  aria-label="List view"
                  data-ocid="view-list"
                >
                  <LayoutList className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          <ActiveFilterBadges filters={filters} onRemove={removeFilter} />

          <div className="flex gap-6 mt-5">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-4 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-primary" />
                    Filters
                  </p>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                      {activeFilterCount} active
                    </Badge>
                  )}
                </div>
                <FilterPanel filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>

            {/* Product Grid / List */}
            <main className="flex-1 min-w-0">
              {isLoading ? (
                <SkeletonGrid count={6} />
              ) : !products?.length ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                  data-ocid="product-grid"
                >
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={
                        viewMode === "list"
                          ? "bg-card rounded-xl border border-border overflow-hidden"
                          : ""
                      }
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
