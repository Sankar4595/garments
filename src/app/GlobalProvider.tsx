import React from "react";
import { CartProvider } from "@/context/CartContext";
import { ModalCartProvider } from "@/context/ModalCartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ModalWishlistProvider } from "@/context/ModalWishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { ModalCompareProvider } from "@/context/ModalCompareContext";
import { ModalSearchProvider } from "@/context/ModalSearchContext";
import { ModalQuickviewProvider } from "@/context/ModalQuickviewContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ModalCartProvider>
            <WishlistProvider>
              <ModalWishlistProvider>
                <CompareProvider>
                  <ModalCompareProvider>
                    <ModalSearchProvider>
                      <ModalQuickviewProvider>
                        {children}
                      </ModalQuickviewProvider>
                    </ModalSearchProvider>
                  </ModalCompareProvider>
                </CompareProvider>
              </ModalWishlistProvider>
            </WishlistProvider>
          </ModalCartProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default GlobalProvider;
