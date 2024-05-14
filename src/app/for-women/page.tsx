"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ShopBreadCrumbImg from "@/components/forWoman/ShopBreadCrumbImg";
import Footer from "@/components/Footer/Footer";
import { useProduct } from "@/context/ProductContext";
import { ProductType } from "@/type/ProductType";

export default function Default() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const { productState } = useProduct();
  let result: ProductType[] = productState.products.filter(
    (val) => val.gender === "female" || val.gender === "both"
  );
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
      </div>
      <ShopBreadCrumbImg data={result} productPerPage={12} dataType={type} />
      <Footer />
    </>
  );
}
