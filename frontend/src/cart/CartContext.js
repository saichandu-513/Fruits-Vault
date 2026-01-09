import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const CartContext = createContext(null);

function getStorageKey(userId) {
  return userId ? `fv_cart_${userId}` : "fv_cart_guest";
}

function readStoredCart(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    // Backward compatible: older versions stored just an array of items.
    if (Array.isArray(parsed)) {
      return { items: parsed, coupon: null };
    }
    if (parsed && typeof parsed === "object") {
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        coupon: parsed.coupon && typeof parsed.coupon === "object" ? parsed.coupon : null
      };
    }
    return { items: [], coupon: null };
  } catch {
    return { items: [], coupon: null };
  }
}

function normalizeQuantity(qty) {
  const n = Number(qty);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.floor(n);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : "";
  const storageKey = getStorageKey(userId);

  const [state, setState] = useState(() => readStoredCart(storageKey));
  const items = state.items;
  const coupon = state.coupon;

  useEffect(() => {
    setState(readStoredCart(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const value = useMemo(() => {
    const cartCount = items.reduce((sum, it) => sum + normalizeQuantity(it.quantity), 0);
    const subtotal = Number(
      items
        .reduce((sum, it) => sum + Number(it.price || 0) * normalizeQuantity(it.quantity), 0)
        .toFixed(2)
    );

    const discountPercent = coupon?.discountPercent ? Number(coupon.discountPercent) : 0;
    const discount = discountPercent > 0 ? Number(((subtotal * discountPercent) / 100).toFixed(2)) : 0;
    const total = Number((subtotal - discount).toFixed(2));

    return {
      items,
      cartCount,
      coupon,
      subtotal,
      discount,
      total,
      addItem: (fruit) => {
        if (!fruit || typeof fruit.name !== "string") return;
        setState((prevState) => {
          const prev = prevState.items;
          const existingIndex = prev.findIndex((p) => p.name === fruit.name);
          if (existingIndex >= 0) {
            const next = [...prev];
            next[existingIndex] = {
              ...next[existingIndex],
              quantity: normalizeQuantity(next[existingIndex].quantity) + 1
            };
            return { ...prevState, items: next };
          }
          return {
            ...prevState,
            items: [
              ...prev,
              {
                name: fruit.name,
                price: Number(fruit.price),
                image: fruit.image || null,
                quantity: 1
              }
            ]
          };
        });
      },
      removeItem: (name) => {
        setState((prevState) => ({
          ...prevState,
          items: prevState.items.filter((p) => p.name !== name)
        }));
      },
      setQuantity: (name, quantity) => {
        setState((prevState) => ({
          ...prevState,
          items: prevState.items
            .map((p) => (p.name === name ? { ...p, quantity: normalizeQuantity(quantity) } : p))
            .filter((p) => normalizeQuantity(p.quantity) > 0)
        }));
      },
      applyCoupon: (nextCoupon) => {
        if (!nextCoupon || typeof nextCoupon.code !== "string") return;
        setState((prevState) => ({
          ...prevState,
          coupon: {
            code: nextCoupon.code,
            discountPercent: Number(nextCoupon.discountPercent || 0),
            description: nextCoupon.description || ""
          }
        }));
      },
      clearCoupon: () => {
        setState((prevState) => ({ ...prevState, coupon: null }));
      },
      clear: () => setState({ items: [], coupon: null })
    };
  }, [items, coupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
