import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const WishlistContext = createContext(null);

function getStorageKey(userId) {
  return userId ? `fv_wishlist_${userId}` : "fv_wishlist_guest";
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeFruit(fruit) {
  if (!fruit || typeof fruit.name !== "string") return null;
  const id = typeof fruit.id === "string" && fruit.id.trim() ? fruit.id.trim() : slugify(fruit.name);
  return {
    id,
    name: fruit.name,
    price: Number(fruit.price || 0),
    image: typeof fruit.image === "string" ? fruit.image : null
  };
}

function readStoredWishlist(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => (x && typeof x === "object" ? x : null))
      .filter(Boolean)
      .map((x) => normalizeFruit(x))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : "";
  const storageKey = getStorageKey(userId);

  const [items, setItems] = useState(() => readStoredWishlist(storageKey));

  useEffect(() => {
    setItems(readStoredWishlist(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const value = useMemo(() => {
    const byId = new Map(items.map((it) => [it.id, it]));

    return {
      items,
      count: items.length,
      isWishlisted: (fruitOrId) => {
        const id = typeof fruitOrId === "string" ? fruitOrId : fruitOrId?.id;
        return Boolean(id && byId.has(String(id)));
      },
      add: (fruit) => {
        const normalized = normalizeFruit(fruit);
        if (!normalized) return;
        setItems((prev) => {
          if (prev.some((p) => p.id === normalized.id)) return prev;
          return [normalized, ...prev];
        });
      },
      remove: (fruitOrId) => {
        const id = typeof fruitOrId === "string" ? fruitOrId : fruitOrId?.id;
        if (!id) return;
        setItems((prev) => prev.filter((p) => p.id !== String(id)));
      },
      toggle: (fruit) => {
        const normalized = normalizeFruit(fruit);
        if (!normalized) return;
        setItems((prev) => {
          const exists = prev.some((p) => p.id === normalized.id);
          if (exists) return prev.filter((p) => p.id !== normalized.id);
          return [normalized, ...prev];
        });
      },
      clear: () => setItems([])
    };
  }, [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
