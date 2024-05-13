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
  selectedSize?: string | any;
  selectedColor?: string | any;
  originPrice: any;
  price: any;
  quantity: number | any;
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
        quantityPurchase: number;
        selectedSize?: string;
        selectedColor?: string;
        originPrice?: number;
        price?: number;
        quantity?: number;
      };
    }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextProps {
  cartState: CartState;
  addToCart: (item: ProductType) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (
    itemId: string,
    quantityPurchase: number,
    selectedSize: string,
    selectedColor: string,
    originPrice?: any,
    price?: any,
    quantity?: number
  ) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem: CartItem = {
        ...action.payload,
        quantityPurchase: 1,
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
                quantityPurchase: action.payload.quantityPurchase,
                selectedSize: action.payload.selectedSize,
                selectedColor: action.payload.selectedColor,
                originPrice: action.payload.originPrice,
                price: action.payload.price,
                quantity: action.payload.quantity,
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

  const addToCart = async (item: CartItem) => {
    try {
      if (authState.user !== null) {
        const existingItem = cartState.cartArray.find(
          (cartItem) => cartItem._id === item._id
        );
        if (existingItem !== undefined) {
          const updatedQuantity: any = existingItem.quantityPurchase + 1; // Increase quantity
          const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart`,
            {
              userId: authState.user._id,
              productId: item._id,
              quantityPurchase: updatedQuantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              originPrice: item.originPrice,
              price: item.price,
              quantity: item.quantity,
            }
          );
          dispatch({
            type: "UPDATE_CART",
            payload: { itemId: item._id, quantityPurchase: updatedQuantity },
          });
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart`,
            {
              userId: authState.user._id,
              productId: item._id,
              quantityPurchase: item.quantityPurchase,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              originPrice: item.originPrice,
              price: item.price,
              quantity: item.quantity,
            }
          );
          dispatch({ type: "ADD_TO_CART", payload: item });
        }
      } else {
        dispatch({ type: "ADD_TO_CART", payload: item });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (authState.user !== null) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart/${authState.user._id}/${itemId}`
        );
      }

      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const updateCart = async (
    itemId: string,
    quantityPurchase: number,
    selectedSize: string,
    selectedColor: string,
    price?: any,
    originPrice?: any,
    quantity?: number
  ) => {
    try {
      if (authState.user !== null) {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/cart`,
          {
            userId: authState.user._id,
            productId: itemId,
            quantityPurchase: quantityPurchase,
            selectedSize: selectedSize,
            selectedColor: selectedColor,
            originPrice: originPrice,
            price: price,
            quantity: quantity,
          }
        );
      }
      dispatch({
        type: "UPDATE_CART",
        payload: {
          itemId,
          quantityPurchase,
          selectedSize,
          selectedColor,
          price: price,
          originPrice: originPrice,
          quantity: quantity,
        },
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
        return {
          ...val.product,
          quantityPurchase: val.quantityPurchase,
          selectedSize: val.selectedSize,
          selectedColor: val.selectedColor,
          originPrice: val.originPrice,
          price: val.price,
          quantity: val.quantity,
        };
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
