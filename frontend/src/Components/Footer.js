import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="fb-footer">
      <span>© 2026 Fruit Vault. All rights reserved.</span>
      <span className="fb-footer-sep">|</span>
      <Link className="fb-footer-link" to="/help">
        Help Center
      </Link>
    </footer>
  );
}
