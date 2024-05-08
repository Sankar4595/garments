"use client";
// AuthProvider.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/type/authTypes";

interface AuthState {
  user: IUser | null;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: IUser }
  | { type: "LOGOUT" };

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  // Initialize other authentication-related state fields
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/auth/signin`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
        return response.data;
      }
    } catch (error) {
      return error;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/auth/logout`
      );

      if (response.status === 200) {
        dispatch({ type: "LOGOUT" });
        return response.data;
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
