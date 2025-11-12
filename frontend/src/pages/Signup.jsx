import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { signup } from '../services/authService';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = 'First name is required';
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Last name is required';
    }

    if (!form.email) {
      nextErrors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.toLowerCase())
    ) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
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
      await signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });

      navigate('/login', {
        replace: true,
        state: { successMessage: 'Account created successfully. You can now sign in.' }
      });
    } catch (error) {
      setServerError(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Get started with GroupBy"
      subtitle="Enter your details below to create your account. It only takes a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </>
      }
    >
      {serverError && (
        <div className="auth-alert auth-alert--error" role="alert">
          {serverError}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Alex"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <span className="form-error">{errors.firstName}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Johnson"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <span className="form-error">{errors.lastName}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="alex@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="+1 555 123 4567"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Creating your account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
