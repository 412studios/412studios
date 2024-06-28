"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface UserContextType {
  isAuthenticated: boolean;
  user: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({
  children,
  isAuthenticated,
  user,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
  user: any;
}) => {
  return (
    <UserContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </UserContext.Provider>
  );
};
