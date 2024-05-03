"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import BreadcrumbProduct from "@/components/Breadcrumb/BreadcrumbProduct";
import Sale from "@/components/Product/Detail/Sale";
import Footer from "@/components/Footer/Footer";

const ProductThumbnailBottom = () => {
  const searchParams = useSearchParams();
  let productId = searchParams.get("id");

  if (productId === null) {
    productId = "1";
  }

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-white" />
        <BreadcrumbProduct data={[]} productPage="sale" productId={productId} />
      </div>
      <Sale data={[]} productId={productId} />
      <Footer />
    </>
  );
};

export default ProductThumbnailBottom;
