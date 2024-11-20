import React, { createContext, useContext, useState } from 'react';

// Create a Context for User
const UserContext = createContext();
const LoginDetails = createContext();
export { LoginDetails };

// Provider component that will wrap around your app to provide user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Initialize with null, or set user data on login

  // Mock login function (replace this with actual authentication logic)
  const login = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the UserContext data
export const useUser = () => useContext(UserContext);