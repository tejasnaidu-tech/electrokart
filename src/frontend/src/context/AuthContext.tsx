import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { createContext, useContext } from "react";
import type { AuthContextValue } from "../types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isInitializing } = useInternetIdentity();

  const principal = identity ? identity.getPrincipal().toText() : null;
  const isAuthenticated = !!identity && !isInitializing;

  // Create a truncated display name from principal
  const displayName = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, principal, displayName, login, logout: clear }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
