"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ShopBreadCrumbImg from "@/components/Shop/ShopBreadCrumbImg";
import Footer from "@/components/Footer/Footer";
import { useProduct } from "@/context/ProductContext";

export default function Default() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const { productState } = useProduct();
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
      </div>
      <ShopBreadCrumbImg
        data={productState.products}
        productPerPage={12}
        dataType={type}
      />
      <Footer />
    </>
  );
}
