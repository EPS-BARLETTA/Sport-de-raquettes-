import React from 'react';

/**
 * Bouton tactile optimisé pour iPad
 */
const TouchButton = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`touch-button ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export default TouchButton;