import React, { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [openId, setOpenId] = useState(null);

  const normalized = useMemo(() => {
    return orders.map((o) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : []
    }));
  }, [orders]);

  useEffect(() => {
    const next = location.state?.flash;
    if (next) {
      setFlash(String(next));
      // Clear flash so refresh doesn't repeat
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setLoading(true);

      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load orders");
        }

        if (!cancelled) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Layout>
      <div>
        <h2 style={{ marginTop: 0 }}>Orders</h2>
        {flash ? <div className="fb-toast" style={{ marginBottom: 14 }}><strong>{flash}</strong></div> : null}

        {loading ? <p className="fb-muted">Loading...</p> : null}
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

        {!loading && !error && orders.length === 0 ? (
          <div className="fb-card" style={{ textAlign: "center" }}>
            <p style={{ margin: 0 }}>No orders yet.</p>
            <div className="fb-actions" style={{ justifyContent: "center" }}>
              <button type="button" onClick={() => navigate("/dashboard")}>Continue Shopping</button>
            </div>
          </div>
        ) : null}

        {normalized.map((o) => {
          const isOpen = openId === o.id;
          const dateLabel = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
          const itemCount = o.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);

          return (
            <div key={o.id} className="fb-card" style={{ marginBottom: 14 }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenId((prev) => (prev === o.id ? null : o.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId((prev) => (prev === o.id ? null : o.id));
                  }
                }}
                style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", cursor: "pointer" }}
              >
                <div>
                  <div style={{ fontWeight: 1000 }}>Order #{o.id}</div>
                  <div className="fb-muted">{dateLabel}</div>
                  <div className="fb-muted" style={{ marginTop: 6 }}>
                    {itemCount} items
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="fb-badge-success">Placed</span>
                  <div style={{ fontWeight: 1000, fontSize: 16 }}>${Number(o.total || 0).toFixed(2)}</div>
                </div>
              </div>

              <div className={isOpen ? "fb-expand fb-expand--open" : "fb-expand"}>
                <div className="fb-divider" />
                <div style={{ display: "grid", gap: 8 }}>
                  {o.items.map((it, idx) => (
                    <div
                      key={`${o.id}-${idx}`}
                      style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}
                    >
                      <span style={{ fontWeight: 800 }}>
                        {it.name} × {it.quantity}
                      </span>
                      <span className="fb-muted">${Number(it.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Orders;
