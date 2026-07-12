import React, { createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // TODO: Implement authentications credentials posting and session status tracking
  const value = {
    user: { full_name: "Hackathon Dev" },
    token: "boilerplate-mock-token",
    isAuthenticated: true, // Defaulting to true for out-of-the-box boilerplate run
    loading: false,
    login: async () => {},
    logout: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
