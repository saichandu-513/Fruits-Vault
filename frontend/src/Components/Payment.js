import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

const METHODS = [
  { id: "cod", title: "Cash on Delivery", subtitle: "Pay when you receive" },
  { id: "upi", title: "UPI (Mock)", subtitle: "Fast & simple" },
  { id: "card", title: "Card (Mock)", subtitle: "Visa / Mastercard" }
];

export default function Payment() {
  const { token } = useAuth();
  const { items, coupon, subtotal, discount, total, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) {
      navigate("/cart", { replace: true });
    }
  }, [hasItems, navigate]);

  const payloadItems = useMemo(
    () =>
      items.map((it) => ({
        name: it.name,
        price: Number(it.price),
        image: it.image || null,
        quantity: Number(it.quantity) || 1
      })),
    [items]
  );

  async function payAndPlaceOrder() {
    setError("");
    if (!hasItems) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: payloadItems,
          paymentMethod,
          coupon: coupon ? { code: coupon.code } : null
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to place order");
      }

      setSuccess(true);
      clear();
      setTimeout(() => {
        navigate("/orders", { state: { flash: "Order placed successfully 🍎" } });
      }, 420);
    } catch (e) {
      setError(e?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout size="sm">
      <div>
        <h2 style={{ marginTop: 0 }}>Payment</h2>
        <p className="fb-muted" style={{ marginTop: 6 }}>
          Choose a payment method (mock checkout).
        </p>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {METHODS.map((m) => {
            const selected = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={selected ? "fb-select-card fb-select-card--selected" : "fb-select-card"}
                disabled={submitting}
              >
                <div style={{ fontSize: 18, width: 28, textAlign: "center" }} aria-hidden="true">
                  {m.id === "cod" ? "💵" : m.id === "upi" ? "📱" : "💳"}
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 1000 }}>{m.title}</div>
                  <div style={{ opacity: 0.85 }}>{m.subtitle}</div>
                </div>
                <span aria-hidden="true" style={{ marginLeft: 10 }}>
                  {selected ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="fb-card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="fb-muted">Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="fb-muted">Coupon</span>
            {coupon ? (
              <span>
                <strong>{coupon.code}</strong> ({coupon.discountPercent}% off)
              </span>
            ) : (
              <span className="fb-muted">None</span>
            )}
          </div>

          {coupon && discount > 0 ? (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className="fb-muted">Discount</span>
              <strong>- ${discount.toFixed(2)}</strong>
            </div>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontWeight: 900 }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: 18 }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {error ? <p style={{ color: "crimson", marginTop: 10 }}>{error}</p> : null}

        {success ? (
          <div className="fb-toast" style={{ marginTop: 12 }}>
            Processing…
          </div>
        ) : null}

        <div className="fb-actions" style={{ justifyContent: "space-between" }}>
          <button type="button" className="fb-btn-secondary" onClick={() => navigate("/cart")} disabled={submitting}>
            Back to Cart
          </button>
          <button type="button" onClick={payAndPlaceOrder} disabled={submitting}>
            {submitting ? "Placing Order..." : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
