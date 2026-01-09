import React from "react";
import Layout from "./Layout";
import "./Help.css";

const Help = () => {
  return (
    <Layout size="sm">
      <div className="help-wrap">
        <h2 className="help-title">Help Center</h2>
        <p className="help-subtext">We usually respond within 24 hours. Available Mon - Fri, 9AM - 6PM.</p>

        <div className="help-actions">
          <div className="help-actionRow">
            <div className="help-actionLabel">📧 Email</div>
            <a className="help-link" href="mailto:support@fruitvault.com">
              support@fruitvault.com
            </a>
          </div>

          <div className="help-actionRow">
            <div className="help-actionLabel">📞 Phone</div>
            <a className="help-link" href="tel:+919999999999">
              +91 **********
            </a>
          </div>
        </div>

        <div className="help-meta">Tip: On mobile, the phone link opens your dialer.</div>
      </div>
    </Layout>
  );
};

export default Help;
