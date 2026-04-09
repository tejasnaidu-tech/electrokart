import {
  Route,
  Router,
  RouterProvider,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AccountPage from "./pages/AccountPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrderConfirmPage from "./pages/OrderConfirmPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListingPage from "./pages/ProductListingPage";

// Root route
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    category?: string;
    brand?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  } => ({
    category: search.category as string | undefined,
    brand: search.brand as string | undefined,
    q: search.q as string | undefined,
    minPrice: search.minPrice != null ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice != null ? Number(search.maxPrice) : undefined,
    minRating: search.minRating != null ? Number(search.minRating) : undefined,
  }),
  component: ProductListingPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout/confirm",
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    orderId?: string;
  } => ({
    orderId: search.orderId as string | undefined,
  }),
  component: OrderConfirmPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    redirect?: string;
  } => ({
    redirect: search.redirect as string | undefined,
  }),
  component: LoginPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

const accountOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/orders",
  component: OrderHistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmRoute,
  loginRoute,
  accountRoute,
  accountOrdersRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CartProvider>
  );
}
