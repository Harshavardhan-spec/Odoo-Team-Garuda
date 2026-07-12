import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div>
      {/* 
        TODO:
        - Design responsive authentication screen centering
        - Configure routes checking if user session has expired
      */}
      <Outlet />
    </div>
  );
}
