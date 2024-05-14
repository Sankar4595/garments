import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/type/authTypes";

interface AuthState {
  user: IUser | null;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: IUser }
  | { type: "LOGOUT" }
  | { type: "REGISTER_SUCCESS"; payload: IUser };

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const initialAuthState: AuthState = {
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "REGISTER_SUCCESS":
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

  useEffect(() => {
    // Check if user data exists in sessionStorage
    const storedUser: any = sessionStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(storedUser) });
    }
  }, []);

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
        const user = response.data.user;
        // Store user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
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
        // Remove user data from sessionStorage
        sessionStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        return response.data;
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      return error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/auth/signup`,
        userData
      );

      if (response.status === 200) {
        const user = response.data.user;
        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        return response.data;
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register }}>
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
