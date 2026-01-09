import React, { useMemo, useState } from "react";
import Layout from "./Layout";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    mobile: user?.mobile || ""
  }));

  const initials = useMemo(() => {
    const base = (user?.name || user?.email || "U").trim();
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  const memberSince = useMemo(() => {
    const d = user?.createdAt ? new Date(user.createdAt) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : "";
  }, [user]);

  async function save() {
    setError("");
    try {
      setSaving(true);
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: form.name, mobile: form.mobile })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }
      updateUser(data.user);
      setEditing(false);
    } catch (e) {
      setError(e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout size="sm">
      <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              margin: "0 auto 12px",
              background: "rgba(46, 125, 50, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 34,
              color: "var(--fb-primary-700)"
            }}
          >
            {initials}
          </div>

          {!editing ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{user?.name || ""}</div>
              <div className="fb-muted" style={{ marginTop: 4 }}>
                {user?.email || ""}
              </div>
              <div style={{ marginTop: 10 }}>
                <strong>Mobile:</strong> {user?.mobile || ""}
              </div>
              <div className="fb-muted" style={{ marginTop: 8 }}>
                <strong>Member since:</strong> {memberSince}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Name</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Mobile</div>
                  <input
                    value={form.mobile}
                    onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>
            </>
          )}

          {error ? <div style={{ color: "crimson", marginTop: 10 }}>{error}</div> : null}

          <div className="fb-actions" style={{ justifyContent: "center" }}>
            {!editing ? (
              <button type="button" className="fb-btn-secondary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button type="button" className="fb-btn-secondary" onClick={() => setEditing(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="button" onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

            <button type="button" className="fb-btn-danger" onClick={() => navigate("/logout")}>
              Logout
            </button>
          </div>
      </div>
    </Layout>
  );
};

export default Profile;
