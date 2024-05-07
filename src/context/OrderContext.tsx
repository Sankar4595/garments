"use client";
import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { ProductType } from "@/type/ProductType";

interface OrderItem extends ProductType {
  quantity: number;
}

interface OrderState {
  orderArray: OrderItem[];
}

type OrderAction =
  | { type: "ADD_TO_ORDER"; payload: ProductType }
  | { type: "REMOVE_FROM_ORDER"; payload: string }
  | { type: "UPDATE_ORDER"; payload: { itemId: string; quantity: number } }
  | { type: "LOAD_ORDER"; payload: OrderItem[] };

interface OrderContextProps {
  orderState: OrderState;
  addToOrder: (item: ProductType) => void;
  removeFromOrder: (itemId: string) => void;
  updateOrder: (itemId: string, quantity: number) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "ADD_TO_ORDER":
      const newItem: OrderItem = {
        ...action.payload,
        quantity: 1,
      };
      return {
        ...state,
        orderArray: [...state.orderArray, newItem],
      };
    case "REMOVE_FROM_ORDER":
      return {
        ...state,
        orderArray: state.orderArray.filter(
          (item) => item._id !== action.payload
        ),
      };
    case "UPDATE_ORDER":
      return {
        ...state,
        orderArray: state.orderArray.map((item) =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "LOAD_ORDER":
      return {
        ...state,
        orderArray: action.payload,
      };
    default:
      return state;
  }
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orderState, dispatch] = useReducer(orderReducer, { orderArray: [] });

  const addToOrder = (item: ProductType) => {
    dispatch({ type: "ADD_TO_ORDER", payload: item });
  };

  const removeFromOrder = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_ORDER", payload: itemId });
  };

  const updateOrder = (itemId: string, quantity: number) => {
    dispatch({
      type: "UPDATE_ORDER",
      payload: { itemId, quantity },
    });
  };

  return (
    <OrderContext.Provider
      value={{ orderState, addToOrder, removeFromOrder, updateOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
