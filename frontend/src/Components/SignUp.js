import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import logoImage from '../images/logo1.png';
import backgroundImage from '../images/fruits.jpg';
import Footer from './Footer';

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'mobile') {
      const digitsOnly = String(value).replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, mobile: digitsOnly }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      setStatus({ type: 'error', message: 'Mobile number must be 10 digits' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          confirmPassword: form.confirmPassword
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: 'error', message: data?.error || 'Signup failed' });
        return;
      }

      // Do NOT log in automatically.
      navigate('/signin', { replace: true, state: { flash: 'Signup successful' } });
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
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name" className="auth-label">Name</label>
            <input id="name" name="name" type="text" placeholder='Enter name' value={form.name} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email</label>
            <input id="email" name="email" type="email" title='Enter a valid email address' placeholder='Enter email' value={form.email} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="auth-field">
            <label htmlFor="mobile" className="auth-label">Mobile Number</label>
            <div className="auth-prefixRow">
              <span className="auth-prefix">+91</span>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                placeholder='10 digits'
                value={form.mobile}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-hint">Numbers only (10 digits).</div>
          </div>
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-inputRow">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a password'
                value={form.password}
                onChange={handleChange}
                required
                className="auth-input"
                minLength={6}
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
            <div className="auth-hint">Use at least 6 characters.</div>
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">Re-enter Password</label>
            <div className="auth-inputRow">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Re-enter password'
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="auth-input"
                minLength={6}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.confirmPassword ? (
              <div className={`auth-feedback ${form.password === form.confirmPassword ? 'ok' : 'bad'}`}>
                {form.password === form.confirmPassword ? 'Passwords match.' : 'Passwords do not match.'}
              </div>
            ) : null}
          </div>

          {status.message ? (
            <div className="auth-status" style={{ color: status.type === 'error' ? '#ffb3b3' : '#b3ffb3' }}>
              {status.message}
            </div>
          ) : null}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-trust">Your data is secure.</div>

        <div className="auth-alt">
          <span>Already have an account? </span>
          <Link to="/signin" className="auth-link">Sign In</Link>
        </div>
      </div>

      <div className="auth-footer">
        <Footer />
      </div>
    </div>
  );
}

export default SignUp;


