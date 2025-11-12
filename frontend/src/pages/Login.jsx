import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = useMemo(
    () => location.state?.successMessage,
    [location.state]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email) {
      nextErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.toLowerCase())
    ) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await login({
        email: form.email.trim(),
        password: form.password
      });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Use the email and password you registered with to access your dashboard."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup">Create one</Link>
        </>
      }
    >
      {successMessage && (
        <div className="auth-alert auth-alert--success" role="status">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="auth-alert auth-alert--error" role="alert">
          {serverError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Signing you in…' : 'Continue'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
