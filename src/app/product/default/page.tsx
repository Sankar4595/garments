"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import BreadcrumbProduct from "@/components/Breadcrumb/BreadcrumbProduct";
import Default from "@/components/Product/Detail/Default";
import Footer from "@/components/Footer/Footer";
import { useProduct } from "@/context/ProductContext";

const ProductDefault = () => {
  const searchParams = useSearchParams();
  let productId = searchParams.get("id");
  const { productState, categoryState } = useProduct();

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-white" />
        <BreadcrumbProduct
          data={productState.products}
          productPage="default"
          productId={productId}
        />
      </div>
      <Default data={productState.products} productId={productId} />
      <Footer />
    </>
  );
};

export default ProductDefault;
