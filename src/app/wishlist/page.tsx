"use client";
import React, { useEffect, useState } from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { ProductType } from "@/type/ProductType";
import Product from "@/components/Product/Product";
import { useWishlist } from "@/context/WishlistContext";
import HandlePagination from "@/components/Other/HandlePagination";
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Wishlist = () => {
  const { wishlistState } = useWishlist();
  const [sortOption, setSortOption] = useState("");
  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [type, setType] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;

  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? undefined : type));
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Filter product data by type
  let filteredData: any;

  useEffect(() => {
    filteredData = wishlistState.wishlistArray.filter((product) => {
      let isTypeMatched = true;
      if (type) {
        isTypeMatched = JSON.parse(product.type).some(
          (val: any) => val.label === type
        );
      }

      return isTypeMatched;
    });
  }, [type]);

  const totalProducts = filteredData?.length;
  const selectedType = type;

  if (filteredData?.length === 0) {
    filteredData = [];
  }
  let sortedData: any;
  useEffect(() => {
    if (filteredData?.length > 0) {
      sortedData = [...filteredData];
    }
  }, [filteredData]);

  if (sortOption === "soldQuantityHighToLow") {
    filteredData = sortedData?.sort((a: any, b: any) => b.sold - a.sold);
  }

  if (sortOption === "discountHighToLow") {
    filteredData = sortedData?.sort(
      (a: any, b: any) =>
        Math.floor(100 - (b.price / b.originPrice) * 100) -
        Math.floor(100 - (a.price / a.originPrice) * 100)
    );
  }

  if (sortOption === "priceHighToLow") {
    filteredData = sortedData?.sort((a: any, b: any) => b.price - a.price);
  }

  if (sortOption === "priceLowToHigh") {
    filteredData = sortedData?.sort((a: any, b: any) => a.price - b.price);
  }

  // Find page number base on filteredData
  const pageCount = Math.ceil(filteredData?.length / productsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  // Get product data for current page
  let currentProducts: ProductType[];

  if (filteredData?.length > 0) {
    currentProducts = filteredData?.slice(offset, offset + productsPerPage);
  } else {
    currentProducts = [];
  }

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Wish list" subHeading="Wish list" />
      </div>
      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="list-product-block relative">
            <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
              <div className="left flex has-line items-center flex-wrap gap-5">
                <div className="choose-layout flex items-center gap-2">
                  <div
                    className={`item three-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 3 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(3)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>
                  <div
                    className={`item four-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 4 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(4)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>
                  <div
                    className={`item five-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                      layoutCol === 5 ? "active" : ""
                    }`}
                    onClick={() => handleLayoutCol(5)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right flex items-center gap-3">
                <div className="select-block filter-type relative">
                  <select
                    className="caption1 py-2 pl-3 md:pr-12 pr-8 rounded-lg border border-line capitalize"
                    name="select-type"
                    id="select-type"
                    onChange={(e) => handleType(e.target.value)}
                    value={type === undefined ? "Type" : type}
                  >
                    <option value="Type" disabled>
                      Type
                    </option>
                    {[
                      "t-shirt",
                      "dress",
                      "top",
                      "swimwear",
                      "shirt",
                      "underwear",
                      "sets",
                      "accessories",
                    ].map((item, index) => (
                      <option
                        key={index}
                        className={`item cursor-pointer ${
                          type === item ? "active" : ""
                        }`}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>
                <div className="select-block relative">
                  <select
                    id="select-filter"
                    name="select-filter"
                    className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line"
                    onChange={(e) => {
                      handleSortChange(e.target.value);
                    }}
                    defaultValue={"Sorting"}
                  >
                    <option value="Sorting" disabled>
                      Sorting
                    </option>
                    <option value="soldQuantityHighToLow">Best Selling</option>
                    <option value="discountHighToLow">Best Discount</option>
                    <option value="priceHighToLow">Price High To Low</option>
                    <option value="priceLowToHigh">Price Low To High</option>
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>
              </div>
            </div>

            <div className="list-filtered flex items-center gap-3 mt-4">
              <div className="total-product">
                {totalProducts}
                <span className="text-secondary pl-1">Products Found</span>
              </div>
              {selectedType && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className="w-px h-4 bg-line"></div>
                    {selectedType && (
                      <div
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                        onClick={() => {
                          setType(undefined);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedType}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                    onClick={() => {
                      setType(undefined);
                    }}
                  >
                    <Icon.X
                      color="rgb(219, 68, 68)"
                      className="cursor-pointer"
                    />
                    <span className="text-button-uppercase text-red">
                      Clear All
                    </span>
                  </div>
                </>
              )}
            </div>

            <div
              className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}
            >
              {currentProducts?.map((item) =>
                item._id === "no-data" ? (
                  <div key={item._id} className="no-data-product">
                    No products match the selected criteria.
                  </div>
                ) : (
                  <Product key={item._id} data={item} type="grid" />
                )
              )}
            </div>

            {pageCount > 1 && (
              <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                <HandlePagination
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
