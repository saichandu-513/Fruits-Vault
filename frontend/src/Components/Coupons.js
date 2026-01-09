import React, { useEffect, useState } from "react";
import { apiUrl } from "../api";
import Layout from "./Layout";
import { useCart } from "../cart/CartContext";

const Coupons = () => {
  const { coupon, applyCoupon, clearCoupon } = useCart();
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError("");
      try {
        const res = await fetch(apiUrl("/api/coupons"));
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error("Failed to load coupons");
        }
        if (!cancelled) {
          setCoupons(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load coupons");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <div>
        <h2 style={{ marginTop: 0 }}>Coupons</h2>
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
        {coupons.length === 0 && !error ? (
          <div className="fb-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0 }}>No coupons available.</p>
          </div>
        ) : null}

        {coupon ? (
          <div className="fb-card" style={{ background: "rgba(46, 125, 50, 0.10)", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <strong>Applied:</strong> {coupon.code} ({coupon.discountPercent}% off)
              </div>
              <button type="button" className="fb-btn-secondary" onClick={clearCoupon}>
                Remove
              </button>
            </div>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 12 }}>
          {coupons.map((c) => {
            const isApplied = coupon?.code === c.code;
            return (
              <div
                key={c.code}
                className={isApplied ? "fb-card fb-ticket-applied" : "fb-card"}
                style={{
                  borderRadius: "var(--fb-radius)",
                  boxShadow: "var(--fb-shadow)",
                  overflow: "hidden"
                }}
              >
                <div className="fb-ticket">
                  <div className="fb-ticket-left">
                    <div className="fb-ticket-pct">{c.discountPercent}%</div>
                    <div className="fb-muted" style={{ marginTop: 6 }}>
                      OFF
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0, paddingLeft: 16 }}>
                    <div style={{ fontWeight: 1000, fontSize: 18 }}>{c.code}</div>
                    <div className="fb-muted" style={{ marginTop: 4 }}>
                      {c.description}
                    </div>

                    <div className="fb-actions" style={{ marginTop: 12 }}>
                      {isApplied ? <span className="fb-badge-success">✔ Applied</span> : null}
                      <button type="button" className={isApplied ? "fb-btn-soft" : ""} onClick={() => applyCoupon(c)}>
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Coupons;
