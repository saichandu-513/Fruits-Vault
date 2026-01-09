import React from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../wishlist/WishlistContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { items, remove } = useWishlist();

  const hasItems = items.length > 0;
  return (
    <Layout>
      <div>
        <h2 style={{ marginTop: 0 }}>Wishlist</h2>

        {!hasItems ? (
          <div className="fb-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 38, lineHeight: 1 }} aria-hidden="true">
              ❤
            </div>
            <div style={{ fontSize: 20, fontWeight: 1000, marginTop: 10 }}>No favorites yet 💚</div>
            <div className="fb-muted" style={{ marginTop: 6 }}>Add fruits you love</div>
            <div className="fb-actions" style={{ justifyContent: "center" }}>
              <button type="button" onClick={() => navigate("/dashboard")}>
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="fb-card">
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flex: "0 0 auto" }}>
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : null}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {it.name}
                      </div>
                      <div className="fb-muted">${Number(it.price || 0).toFixed(2)}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="fb-btn-soft"
                    onClick={() => remove(it.id)}
                    aria-label={`Remove ${it.name} from wishlist`}
                    title="Remove"
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>

            <div className="fb-divider" />
            <div className="fb-actions" style={{ justifyContent: "center" }}>
              <button type="button" onClick={() => navigate("/dashboard")}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
