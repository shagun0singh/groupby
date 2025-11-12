import React from 'react';

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        {eyebrow && <div className="auth-eyebrow">{eyebrow}</div>}
        {title && <h1 className="auth-title">{title}</h1>}
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthLayout;

