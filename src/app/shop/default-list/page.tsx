"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import ShopSidebarList from "@/components/Shop/ShopSidebarList";
import Footer from "@/components/Footer/Footer";

export default function DefaultList() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
      </div>
      <ShopSidebarList data={[]} productPerPage={4} dataType={type} />
      <Footer />
    </>
  );
}
