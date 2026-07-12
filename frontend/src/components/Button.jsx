import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button {...props}>
      {/* 
        TODO:
        - Add styling variants (primary, secondary, danger)
        - Configure loading and disabled states
      */}
      {children}
    </button>
  );
}
