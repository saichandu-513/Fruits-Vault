import React, { useEffect, useState } from 'react';
import './Auth.css';
import logoImage from '../images/logo1.png';
import backgroundImage from '../images/fruits.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Footer from './Footer';
import { apiUrl } from '../api';

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const flash = location.state?.flash;
    if (flash) {
      setStatus({ type: 'success', message: flash });
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const contentType = res.headers.get('content-type') || '';
      const data = await (contentType.includes('application/json')
        ? res.json().catch(() => ({}))
        : res.text().then((text) => ({ raw: text })).catch(() => ({}))
      );

      if (!res.ok) {
        const raw = typeof data?.raw === 'string' ? data.raw : '';
        const isProxyError = raw.includes('Could not proxy request') || raw.includes('ECONNREFUSED');
        const message =
          data?.error ||
          (isProxyError
            ? 'Backend is not running on http://localhost:5000. Start it and try again.'
            : res.status === 403
              ? `Login blocked (403). This usually means the request is going to the wrong server (frontend host) instead of the backend. Response URL: ${res.url}`
              : `Login failed (${res.status})`);
        setStatus({ type: 'error', message });
        return;
      }

      login(data.token, data.user);

      const from = location.state?.from?.pathname;
      navigate(from || '/dashboard', { replace: true });
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper" style={{ '--auth-bg-image': `url(${backgroundImage})` }}>
      <div className="auth-brand">
        <img src={logoImage} alt="Fruit Basket" className="auth-logo" />
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-inputRow">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                title="Please enter a password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input"
                minLength={1}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="auth-linksRow">
              <span />
              <Link to="/help" className="auth-link">Forgot password?</Link>
            </div>
          </div>

          {status.message ? (
            <div className="auth-status" style={{ color: status.type === 'error' ? '#ffb3b3' : '#b3ffb3' }}>
              {status.message}
            </div>
          ) : null}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="auth-trust">Your data is secure.</div>
        <div className="auth-alt">
          <span>Don't have an account? </span>
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>

      <div className="auth-footer">
        <Footer />
      </div>
    </div>
  );
}

export default SignIn;
