"use client"; // ProductContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

interface ProductState {
  products: any[];
  loading: boolean;
  error: string | null;
}

interface CategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
}

type ProductAction =
  | { type: "SET_PRODUCTS"; payload: any }
  | { type: "FETCH_PRODUCTS_REQUEST" }
  | { type: "FETCH_PRODUCTS_SUCCESS"; payload: any }
  | { type: "FETCH_PRODUCTS_FAILURE"; payload: string };

type CategoryAction =
  | { type: "SET_CATEGORIES"; payload: any }
  | { type: "FETCH_CATEGORIES_REQUEST" }
  | { type: "FETCH_CATEGORIES_SUCCESS"; payload: any }
  | { type: "FETCH_CATEGORIES_FAILURE"; payload: string };

interface ProductContextProps {
  productState: ProductState;
  categoryState: CategoryState;
  setProducts: (products: any[]) => void;
  setCategories: (categories: any[]) => void;
}

const initialProductState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "FETCH_PRODUCTS_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.data,
        error: null,
      };
    case "FETCH_PRODUCTS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const categoryReducer = (
  state: CategoryState,
  action: CategoryAction
): CategoryState => {
  switch (action.type) {
    case "FETCH_CATEGORIES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CATEGORIES_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: action.payload.data,
        error: null,
      };
    case "FETCH_CATEGORIES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [productState, productDispatch] = useReducer(
    productReducer,
    initialProductState
  );

  const [categoryState, categoryDispatch] = useReducer(
    categoryReducer,
    initialCategoryState
  );

  const fetchProducts = async () => {
    productDispatch({ type: "FETCH_PRODUCTS_REQUEST" });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/product`
      );
      productDispatch({
        type: "FETCH_PRODUCTS_SUCCESS",
        payload: response.data,
      });
    } catch (error: any) {
      productDispatch({
        type: "FETCH_PRODUCTS_FAILURE",
        payload: error.response?.data?.message || "Failed to fetch products",
      });
    }
  };

  const fetchCategories = async () => {
    categoryDispatch({ type: "FETCH_CATEGORIES_REQUEST" });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/apps/category`
      );
      categoryDispatch({
        type: "FETCH_CATEGORIES_SUCCESS",
        payload: response.data,
      });
    } catch (error: any) {
      categoryDispatch({
        type: "FETCH_CATEGORIES_FAILURE",
        payload: error.response?.data?.message || "Failed to fetch categories",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const setProducts = (products: any[]) => {
    productDispatch({ type: "SET_PRODUCTS", payload: products });
  };

  const setCategories = (categories: any[]) => {
    categoryDispatch({ type: "SET_CATEGORIES", payload: categories });
  };

  return (
    <ProductContext.Provider
      value={{ productState, categoryState, setProducts, setCategories }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
