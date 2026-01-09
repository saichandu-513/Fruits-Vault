import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useCart } from "../cart/CartContext";

const Cart = () => {
  const { items, subtotal, discount, total, coupon, setQuantity, removeItem, clearCoupon } = useCart();
  const navigate = useNavigate();

  const hasItems = items.length > 0;
  const lineItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 1,
        lineTotal: Number((Number(it.price || 0) * (Number(it.quantity) || 1)).toFixed(2))
      })),
    [items]
  );

  return (
    <Layout size="xl">
      <div>
        <h2 style={{ marginTop: 0 }}>Cart</h2>

        {!hasItems ? (
          <div className="fb-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0 }}>Your cart is empty.</p>
            <div className="fb-actions" style={{ justifyContent: "center" }}>
              <button type="button" onClick={() => navigate("/dashboard")}>Continue Shopping</button>
            </div>
          </div>
        ) : (
          <div className="fb-row" style={{ alignItems: "stretch" }}>
            <div className="fb-col" style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Cart items</div>
              <div className="fb-divider" />

              {lineItems.map((it, idx) => (
                <div key={it.name}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flex: "0 0 auto" }}>
                      {it.image ? (
                        <img src={it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : null}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {it.name}
                      </div>
                      <div className="fb-muted">${Number(it.price).toFixed(2)}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        className="fb-btn-soft"
                        onClick={() => setQuantity(it.name, Math.max(1, it.quantity - 1))}
                        aria-label={`Decrease ${it.name}`}
                      >
                        −
                      </button>
                      <div style={{ width: 26, textAlign: "center", fontWeight: 900 }}>{it.quantity}</div>
                      <button
                        type="button"
                        className="fb-btn-soft"
                        onClick={() => setQuantity(it.name, it.quantity + 1)}
                        aria-label={`Increase ${it.name}`}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ width: 92, textAlign: "right", fontWeight: 900, flex: "0 0 auto" }}>
                      ${it.lineTotal.toFixed(2)}
                    </div>

                    <button
                      type="button"
                      className="fb-btn-soft"
                      onClick={() => removeItem(it.name)}
                      aria-label={`Remove ${it.name}`}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>

                  {idx < lineItems.length - 1 ? <div className="fb-divider" /> : null}
                </div>
              ))}
            </div>

            <div className="fb-divider-vertical" />

            <div className="fb-col" style={{ maxWidth: 420 }}>
              <div className="fb-card" style={{ position: "sticky", top: 92 }}>
                <div style={{ fontWeight: 900, marginBottom: 10 }}>Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="fb-muted">Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="fb-muted">Discount</span>
                  <strong>{discount > 0 ? `- $${discount.toFixed(2)}` : "$0.00"}</strong>
                </div>
                <div className="fb-divider" />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontWeight: 1000 }}>Total</span>
                  <span style={{ fontWeight: 1000, fontSize: 18 }}>${total.toFixed(2)}</span>
                </div>

                {coupon ? (
                  <div style={{ marginTop: 12 }}>
                    <span className="fb-badge-success">{coupon.code}</span>
                    <span className="fb-muted" style={{ marginLeft: 8 }}>
                      {coupon.discountPercent}% off
                    </span>
                    <div style={{ marginTop: 10 }}>
                      <button type="button" className="fb-btn-soft" onClick={clearCoupon}>
                        Remove coupon
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="fb-actions" style={{ justifyContent: "space-between" }}>
                  <button type="button" onClick={() => navigate("/payment")}>
                    Proceed to Payment
                  </button>
                  <button type="button" className="fb-btn-soft" onClick={() => navigate("/dashboard")}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
