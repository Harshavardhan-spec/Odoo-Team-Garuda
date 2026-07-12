import React from 'react';

export default function Card({ children, ...props }) {
  return (
    <div {...props}>
      {/* 
        TODO:
        - Design custom styles and headers for general card panels
      */}
      {children}
    </div>
  );
}
