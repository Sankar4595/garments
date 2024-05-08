"use client";

// CartContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { ProductType } from "@/type/ProductType";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useProduct } from "./ProductContext";

interface CartItem extends ProductType {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartState {
  cartArray: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: ProductType }
  | { type: "SUCCESS_CART"; payload: any }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_CART";
      payload: {
        itemId: string;
        quantity: number;
        selectedSize: string;
        selectedColor: string;
      };
    }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextProps {
  cartState: CartState;
  addToCart: (item: ProductType) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem: CartItem = {
        ...action.payload,
        quantity: 1,
        selectedSize: "",
        selectedColor: "",
      };
      return {
        ...state,
        cartArray: [...state.cartArray, newItem],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartArray: state.cartArray.filter(
          (item) => item._id !== action.payload
        ),
      };
    case "UPDATE_CART":
      return {
        ...state,
        cartArray: state.cartArray.map((item) =>
          item._id === action.payload.itemId
            ? {
                ...item,
                quantity: action.payload.quantity,
                selectedSize: action.payload.selectedSize,
                selectedColor: action.payload.selectedColor,
              }
            : item
        ),
      };
    case "LOAD_CART":
      return {
        ...state,
        cartArray: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartState, dispatch] = useReducer(cartReducer, { cartArray: [] });
  const { authState } = useAuth();
  const { productState } = useProduct();

  const addToCart = async (item: ProductType) => {
    try {
      if (authState.user !== null) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart`,
          {
            userId: authState.user._id,
            productId: item._id,
            quantity: item.quantityPurchase,
          }
        );
      }
      dispatch({ type: "ADD_TO_CART", payload: item });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (authState.user !== null) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart/${authState.user._id}`
        );
      }

      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const updateCart = async (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ) => {
    try {
      if (authState.user !== null) {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart`,
          {
            userId: authState.user._id,
            productId: itemId,
            quantity: quantity,
          }
        );
      }
      dispatch({
        type: "UPDATE_CART",
        payload: { itemId, quantity, selectedSize, selectedColor },
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const getCart = async (id: any) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart/${id}`
      );
      let json = response.data.data.items.map((val: any) => {
        return val.product;
      });

      json.map((val: any) => {
        dispatch({ type: "ADD_TO_CART", payload: val });
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (authState.user !== null) {
      getCart(authState.user._id);
    }
  }, [authState]);

  return (
    <CartContext.Provider
      value={{ cartState, addToCart, removeFromCart, updateCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
