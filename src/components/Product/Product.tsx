"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useProduct } from "@/context/ProductContext";

interface ProductProps {
  data: ProductType;
  type: string;
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
  const { addToCart, updateCart, cartState } = useCart();
  const { setProducts, productState } = useProduct();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { openQuickview } = useModalQuickviewContext();
  const router = useRouter();

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  useEffect(() => {
    if (activeColor && activeSize) {
      let prdNew: any = productState.products.map((val: ProductType) => {
        return {
          ...val,
          quantity: val.variation.find(
            (item: any) =>
              item.color === activeColor && item.size === activeSize
          )?.quantity,
        };
      });
      setProducts(prdNew);
    }
  }, [activeColor, activeSize]);

  let price: any =
    data &&
    data.variation.find(
      (item: any) => item.size === activeSize && item.color === activeColor
    );

  const handleAddToCart = () => {
    if (activeColor !== "" && activeSize !== "") {
      let newPrice = parseInt(price.price);
      let oldPrice = parseInt(price.oldPrice);
      let qty = parseInt(price.quantity);
      if (!cartState.cartArray.find((item) => item._id === data._id)) {
        addToCart({
          ...data,
          selectedSize: activeSize,
          selectedColor: activeColor,
          price: newPrice,
          originPrice: oldPrice,
          quantity: qty,
        });
        updateCart(
          data._id,
          data.quantityPurchase,
          activeSize,
          activeColor,
          newPrice,
          oldPrice,
          qty
        );
      } else {
        updateCart(
          data._id,
          data.quantityPurchase,
          activeSize,
          activeColor,
          newPrice,
          oldPrice,
          qty
        );
      }
      openModalCart();
    } else {
      message.error("Please select color and size");
    }
  };

  const handleAddToWishlist = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (wishlistState.wishlistArray.some((item) => item._id === data._id)) {
      removeFromWishlist(data._id);
    } else {
      // else, add to wishlist and set state to true
      addToWishlist(data);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (compareState.compareArray.length < 3) {
      if (compareState.compareArray.some((item) => item._id === data._id)) {
        removeFromCompare(data._id);
      } else {
        // else, add to wishlist and set state to true
        addToCompare(data);
      }
    } else {
      alert("Compare up to 3 products");
    }

    openModalCompare();
  };

  const handleQuickviewOpen = () => {
    openQuickview(data);
  };

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/default?id=${productId}`);
  };

  let percentSale = Math.floor(100 - (data.price / data.originPrice) * 100);
  let percentSold = Math.floor((data.sold / data.quantity) * 100);

  return (
    <>
      {type === "grid" ? (
        <div className="product-item grid-type">
          <div
            onClick={() => handleDetailProduct(data._id)}
            className="product-main cursor-pointer block"
          >
            <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
              {data.new && (
                <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                  New
                </div>
              )}
              {data.quantity < 4 && (
                <div className="product-tag text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 right-3 z-[1]">
                  only left {data.quantity}
                </div>
              )}
              <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                <div
                  className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                    wishlistState.wishlistArray.some(
                      (item) => item._id === data._id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist();
                  }}
                >
                  <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                    Add To Wishlist
                  </div>
                  {wishlistState.wishlistArray.some(
                    (item) => item._id === data._id
                  ) ? (
                    <>
                      <Icon.Heart
                        size={18}
                        weight="fill"
                        className="text-white"
                      />
                    </>
                  ) : (
                    <>
                      <Icon.Heart size={18} />
                    </>
                  )}
                </div>
                <div
                  className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2 ${
                    compareState.compareArray.some(
                      (item) => item._id === data._id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCompare();
                  }}
                >
                  <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                    Compare Product
                  </div>
                  <Icon.ArrowsCounterClockwise
                    size={18}
                    className="compare-icon"
                  />
                  <Icon.CheckCircle size={20} className="checked-icon" />
                </div>
              </div>
              <div className="product-img w-full h-full aspect-[3/4]">
                {activeColor ? (
                  <>
                    {
                      <Image
                        src={
                          data.variation.find(
                            (item: any) => item.color === activeColor
                          )?.image || ""
                        }
                        width={500}
                        height={500}
                        priority={true}
                        alt={""}
                        className="w-full h-full object-cover duration-700"
                      />
                    }
                  </>
                ) : (
                  <>
                    {data.images.slice(0, 2).map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        width={500}
                        height={500}
                        priority={true}
                        alt={data.name}
                        className="w-full h-full object-cover duration-700"
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
                <div
                  className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickviewOpen();
                  }}
                >
                  Quick View
                </div>
                {data.action === "add to cart" ? (
                  <div
                    className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    Add To Cart
                  </div>
                ) : (
                  <>
                    <div
                      className="quick-shop-btn text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenQuickShop(!openQuickShop);
                      }}
                    >
                      Quick Shop
                    </div>
                    <div
                      className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${
                        openQuickShop ? "open" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="list-size flex items-center justify-center flex-wrap gap-2">
                        {data.variation
                          // Remove duplicates based on size
                          .filter(
                            (item: any, index: any, self: any) =>
                              index ===
                              self.findIndex((t: any) => t.size === item.size)
                          )
                          .map((item: any, index: any) => (
                            <div
                              className={`size-item w-10 h-10 rounded-full flex items-center justify-center text-button bg-white border border-line ${
                                activeSize === item.size ? "active" : ""
                              }`}
                              key={index}
                              onClick={() => handleActiveSize(item.size)}
                            >
                              {item.size}
                            </div>
                          ))}
                      </div>
                      <div
                        className="button-main w-full text-center rounded-full py-3 mt-4"
                        onClick={() => {
                          handleAddToCart();
                          setOpenQuickShop(false);
                        }}
                      >
                        Add To cart
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="product-infor mt-4 lg:mb-7">
              <div className="product-sold sm:pb-4 pb-2">
                <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
                  <div
                    className={`progress-sold bg-red absolute left-0 top-0 h-full`}
                    style={{ width: `${percentSold}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                  <div className="text-button-uppercase">
                    <span className="text-secondary2 max-sm:text-xs">
                      Sold:{" "}
                    </span>
                    <span className="max-sm:text-xs">{data.sold}</span>
                  </div>
                  <div className="text-button-uppercase">
                    <span className="text-secondary2 max-sm:text-xs">
                      Available:{" "}
                    </span>
                    <span className="max-sm:text-xs">
                      {data.quantity - data.sold}
                    </span>
                  </div>
                </div>
              </div>
              <div className="product-name text-title duration-300">
                {data.name}
              </div>
              {data.variation.length > 0 && data.action === "quick shop" && (
                <div className="list-color py-2 max-md:hidden flex items-center gap-3 flex-wrap duration-500">
                  {data.variation
                    // Remove duplicates based on color name
                    .filter(
                      (item: any, index: any, self: any) =>
                        index ===
                        self.findIndex((t: any) => t.color === item.color)
                    )
                    .slice(0, 6)
                    .map((item: any, index: any) => (
                      <div
                        key={index}
                        className={`color-item w-8 h-8 rounded-full duration-300 relative ${
                          activeColor === item.color ? "active" : ""
                        }`}
                        style={{
                          backgroundColor: `${item.colorCode}`,
                          border: "1px solid",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActiveColor(item.color);
                        }}
                      >
                        <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                          {item.color}
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {/* {data.variation.length > 0 && data.action === "quick shop" && (
                <div className="list-color-image max-md:hidden flex items-center gap-3 flex-wrap duration-500">
                  {(data.variation)
                    // Remove duplicates based on color
                    .filter(
                      (item: any, index: any, self: any) =>
                        index ===
                        self.findIndex((t: any) => t.color === item.color)
                    )
                    .map((item: any, index: any) => (
                      <div
                        className={`color-item w-12 h-12 rounded-xl duration-300 relative ${
                          activeColor === item.color ? "active" : ""
                        }`}
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActiveColor(item.color);
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: 0,
                            margin: 0,
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          disabled
                          value={item.colorCode}
                          onClick={(e) => {
                            console.log("e: ", e);
                            e.stopPropagation();
                            handleActiveColor(item.color);
                          }}
                        />
                        <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                          {item.color}
                        </div>
                      </div>
                    ))}
                </div>
              )} */}

              <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                <div className="product-price text-title">
                  ₹{price ? price.price : data.price}.00
                </div>
                {percentSale > 0 && (
                  <>
                    <div className="product-origin-price caption1 text-secondary2">
                      <del>₹{price ? price.oldPrice : data.originPrice}.00</del>
                    </div>
                    <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {type === "list" ? (
            <>
              <div className="product-item list-type">
                <div className="product-main cursor-pointer flex lg:items-center sm:justify-between gap-7 max-lg:gap-5">
                  <div
                    onClick={() => handleDetailProduct(data._id)}
                    className="product-thumb bg-white relative overflow-hidden rounded-2xl block max-sm:w-1/2"
                  >
                    {data.new && (
                      <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                        New
                      </div>
                    )}
                    {data.sale && (
                      <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                        Sale
                      </div>
                    )}
                    <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
                      {data.images.slice(0, 2).map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          width={500}
                          height={500}
                          priority={true}
                          alt={img}
                          className="w-full h-full object-cover duration-700"
                        />
                      ))}
                    </div>
                    <div className="list-action px-5 absolute w-full bottom-5 max-lg:hidden">
                      <div
                        className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${
                          openQuickShop ? "open" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="list-size flex items-center justify-center flex-wrap gap-2">
                          {data.variation.map((item: any, index: any) => (
                            <div
                              className={`size-item ${
                                item.size !== "freesize"
                                  ? "w-10 h-10"
                                  : "h-10 px-4"
                              } flex items-center justify-center text-button bg-white rounded-full border border-line ${
                                activeSize === item.size ? "active" : ""
                              }`}
                              key={index}
                              onClick={() => handleActiveSize(item.size)}
                            >
                              {item.size}
                            </div>
                          ))}
                        </div>
                        <div
                          className="button-main w-full text-center rounded-full py-3 mt-4"
                          onClick={() => {
                            handleAddToCart();
                            setOpenQuickShop(false);
                          }}
                        >
                          Add To cart
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2">
                    <div className="product-infor max-sm:w-full">
                      <div
                        onClick={() => handleDetailProduct(data._id)}
                        className="product-name heading6 inline-block duration-300"
                      >
                        {data.name}
                      </div>
                      <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
                        <div className="product-price text-title">
                          ₹{data.price}.00
                        </div>
                        <div className="product-origin-price caption1 text-secondary2">
                          <del>₹{data.originPrice}.00</del>
                        </div>
                        {data.originPrice && (
                          <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                            -{percentSale}%
                          </div>
                        )}
                      </div>
                      {data.variation.length > 0 &&
                      data.action === "quick shop" ? (
                        <div className="list-color max-md:hidden py-2 mt-5 mb-1 flex items-center gap-3 flex-wrap duration-300">
                          {data.variation.map((item: any, index: any) => (
                            <div
                              key={index}
                              className={`color-item w-8 h-8 rounded-full duration-300 relative`}
                              style={{ backgroundColor: `${item.colorCode}` }}
                            >
                              <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                {item.color}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* {data.variation.length > 0 &&
                          data.action === "quick shop" ? (
                            <>
                              <div className="list-color flex items-center gap-2 flex-wrap mt-5">
                                {(data.variation).map(
                                  (item: any, index: any) => (
                                    <div
                                      className={`color-item w-12 h-12 rounded-xl duration-300 relative ${
                                        activeColor === item.color
                                          ? "active"
                                          : ""
                                      }`}
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActiveColor(item.color);
                                      }}
                                    >
                                      <input
                                        disabled
                                        type="color"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          padding: 0,
                                          margin: 0,
                                          border: "none",
                                        }}
                                        value={item.colorCode}
                                      />
                                      <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                        {item.color}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )} */}
                        </>
                      )}
                      <div className="text-secondary desc mt-5 max-sm:hidden">
                        {data.description}
                      </div>
                    </div>
                    <div className="action w-fit flex flex-col items-center justify-center">
                      <div
                        className="quick-shop-btn button-main whitespace-nowrap py-2 px-9 max-lg:px-5 rounded-full bg-white text-black border border-black hover:bg-black hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenQuickShop(!openQuickShop);
                        }}
                      >
                        Quick Shop
                      </div>
                      <div className="list-action-right flex items-center justify-center gap-3 mt-4">
                        <div
                          className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                            wishlistState.wishlistArray.some(
                              (item) => item._id === data._id
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Add To Wishlist
                          </div>
                          {wishlistState.wishlistArray.some(
                            (item) => item._id === data._id
                          ) ? (
                            <>
                              <Icon.Heart
                                size={18}
                                weight="fill"
                                className="text-white"
                              />
                            </>
                          ) : (
                            <>
                              <Icon.Heart size={18} />
                            </>
                          )}
                        </div>
                        <div
                          className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                            compareState.compareArray.some(
                              (item) => item._id === data._id
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCompare();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Compare Product
                          </div>
                          <Icon.ArrowsCounterClockwise
                            size={18}
                            className="compare-icon"
                          />
                          <Icon.CheckCircle
                            size={20}
                            className="checked-icon"
                          />
                        </div>
                        <div
                          className="quick-view-btn-list w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickviewOpen();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Quick View
                          </div>
                          <Icon.Eye size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Product;
