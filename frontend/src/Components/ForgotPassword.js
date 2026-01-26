import React, { useState } from 'react';
import { apiUrl } from '../api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'If your email is registered, a reset link has been sent.' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send reset link.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error.' });
    }
  };

  return (
    <div className="auth-card">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Enter your email address:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {status && (
        <div className={status.type === 'success' ? 'auth-success' : 'auth-error'}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
