"use client";

import React, { useState } from "react";
import Product from "../Product/Product";
import { ProductType } from "@/type/ProductType";
import { motion } from "framer-motion";

interface Props {
  data: Array<ProductType>;
  start: number;
  limit: number;
  categoryState?: any;
}

const WhatNewOne: React.FC<Props> = ({ data, start, limit, categoryState }) => {
  console.log("data: ", data);
  console.log("categoryState: ", categoryState);
  const [activeTab, setActiveTab] = useState<string>(categoryState[0]?.name);

  const handleTabClick = (type: string) => {
    setActiveTab(type);
  };

  const filteredProducts = data?.filter((product: any) =>
    JSON.parse(product.categoryArr).map(
      (val: { label: string }) => val.label === activeTab
    )
  );
  console.log("filteredProducts: ", filteredProducts);

  return (
    <>
      <div className="whate-new-block md:pt-20 pt-10">
        <div className="container">
          <div className="heading flex flex-col items-center text-center">
            <div className="heading3">What{String.raw`'s`} new</div>
            <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl mt-6">
              {categoryState?.categories?.map((type: any) => (
                <div
                  key={type._id}
                  className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black ${
                    activeTab === type.name ? "active" : ""
                  }`}
                  onClick={() => handleTabClick(type.name)}
                >
                  {activeTab === type && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl bg-white"
                    ></motion.div>
                  )}
                  <span className="relative text-button-uppercase z-[1]">
                    {type.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
            {filteredProducts.slice(start, limit).map((prd: any, index) => (
              <Product data={prd} type="grid" key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatNewOne;
