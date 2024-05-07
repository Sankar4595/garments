"use client";
import React from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import SliderOne from "@/components/Slider/SliderOne";
import WhatNewOne from "@/components/Home1/WhatNewOne";
import Collection from "@/components/Home1/Collection";
import TabFeatures from "@/components/Home1/TabFeatures";
import Banner from "@/components/Home1/Banner";
import Benefit from "@/components/Home1/Benefit";
import Testimonial from "@/components/Home1/Testimonial";
import Brand from "@/components/Home1/Brand";
import Footer from "@/components/Footer/Footer";
import { useProduct } from "@/context/ProductContext";
import WifiLoader from "@/components/Loading";

export default function Home() {
  const { productState, categoryState } = useProduct();
  if (productState.loading) {
    return <WifiLoader />;
  }
  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <SliderOne />
      </div>
      <WhatNewOne
        categoryState={categoryState.categories}
        data={productState?.products}
        start={0}
        limit={4}
      />
      <Collection />
      <TabFeatures data={[]} start={0} limit={6} />
      <Banner />
      <Benefit props="md:py-20 py-10" />
      {/* <Testimonial data={[]} limit={6} /> */}
      {/* <Instagram /> */}
      <Brand />
      <Footer />
    </>
  );
}
