"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import Product from "@/components/Product/Product";
import useLoginPopup from "@/store/useLoginPopup";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useModalSearchContext } from "@/context/ModalSearchContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import logo from "../../../../public/logo.jpg";
import { useAuth } from "@/context/AuthContext";
import { useProduct } from "@/context/ProductContext";
interface Props {
  props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
  const router = useRouter();
  const pathname = usePathname();
  let [selectedType, setSelectedType] = useState<string | null>();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { authState, logout } = useAuth();
  const { openModalWishlist } = useModalWishlistContext();
  const { openModalSearch } = useModalSearchContext();
  const { subCategoryState, categoryState } = useProduct();

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };

    // Gắn sự kiện cuộn khi component được mount
    window.addEventListener("scroll", handleScroll);

    // Hủy sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  const handleGenderClick = (gender: string) => {
    router.push(`/shop/breadcrumb1?gender=${gender}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/shop/breadcrumb1?category=${category}`);
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    router.push(`/shop/breadcrumb1?type=${type}`);
  };
  let lastCategoryName: string | null = null;

  return (
    <>
      <div
        className={`header-menu style-one ${
          fixedHeader ? "fixed" : "absolute"
        } top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex justify-between h-full">
            <div
              className="menu-mobile-icon lg:hidden flex items-center"
              onClick={handleMenuMobile}
            >
              <i className="icon-category text-2xl"></i>
            </div>
            <div className="left flex items-center gap-16">
              <Link
                href={"/"}
                className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
              >
                <div className="heading4">
                  <Image alt="logo" width={90} height={90} src={logo} />
                </div>
              </Link>
              <div className="menu-main h-full max-lg:hidden">
                <ul className="flex items-center gap-8 h-full">
                  <li className="h-full relative">
                    <Link
                      href="/"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${
                        pathname === "/" ? "active" : ""
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="#!"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      Products
                    </Link>
                    <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                      <div className="container">
                        <div className="flex justify-between py-8">
                          <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                            {categoryState.categories.slice(0, 5).map((val) => {
                              const subCategory =
                                subCategoryState.subCategories.filter(
                                  (item) => item.category === val._id
                                );

                              return (
                                <div
                                  key={`category-${val._id}`}
                                  className="nav-item"
                                >
                                  <div className="text-button-uppercase pb-2">
                                    {val.name}
                                  </div>
                                  <ul>
                                    {subCategory &&
                                      subCategory.slice(0, 5).map((i, idx) => {
                                        return (
                                          <li key={i._id}>
                                            <div
                                              onClick={() =>
                                                handleGenderClick(i.name)
                                              }
                                              className="link text-secondary duration-300 cursor-pointer"
                                            >
                                              {i.name}
                                            </div>
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                          <div className="banner-ads-block pl-2.5 basis-1/3">
                            <div
                              className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer"
                              onClick={() => handleTypeClick("swimwear")}
                            >
                              <div className="text-content py-14 pl-8 relative z-[1]">
                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                  Save ₹750
                                </div>
                                <div className="heading6 mt-2">
                                  Dive into Savings <br />
                                  on Swimwear
                                </div>
                                <div className="body1 mt-3 text-secondary">
                                  Starting at{" "}
                                  <span className="text-red">₹1099</span>
                                </div>
                              </div>
                              <Image
                                src={"/images/slider/bg2-2.png"}
                                width={200}
                                height={100}
                                alt="bg-img"
                                className="basis-1/3 absolute right-0 top-0 duration-700"
                              />
                            </div>
                            {/* <div
                              className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer mt-8"
                              onClick={() => handleTypeClick("accessories")}
                            >
                              <div className="text-content py-14 pl-8 relative z-[1]">
                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                  Save $10
                                </div>
                                <div className="heading6 mt-2">
                                  20% off <br />
                                  accessories
                                </div>
                                <div className="body1 mt-3 text-secondary">
                                  Starting at{" "}
                                  <span className="text-red">$59.99</span>
                                </div>
                              </div>
                              <Image
                                src={"/images/other/bg-feature.png"}
                                width={200}
                                height={100}
                                alt="bg-img"
                                className="basis-1/3 absolute right-0 top-0 duration-700"
                              />
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/shop/default"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/shop/") ? "active" : ""
                      }`}
                    >
                      Shop
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/for-men"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/for-men") ? "active" : ""
                      }`}
                    >
                      For Men
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/for-women"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/for-women") ? "active" : ""
                      }`}
                    >
                      For Women
                    </Link>
                  </li>
                  <li className="h-full relative">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/blog") ? "active" : ""
                      }`}
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="h-full relative">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/pages") ? "active" : ""
                      }`}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right flex gap-12">
              <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                <Icon.MagnifyingGlass
                  size={24}
                  color="black"
                  onClick={openModalSearch}
                />
                <div className="line absolute bg-line w-px h-6 -right-6"></div>
              </div>
              <div className="list-action flex items-center gap-4">
                <div className="user-icon flex items-center justify-center cursor-pointer">
                  <Icon.User
                    size={24}
                    color="black"
                    onClick={handleLoginPopup}
                  />
                  <div
                    className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-small 
                                            ${openLoginPopup ? "open" : ""}`}
                  >
                    {authState.user !== null ? (
                      <Link
                        onClick={() => logout()}
                        href={"#"}
                        className="button-main w-full text-center"
                      >
                        Logout
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={"/login"}
                          className="button-main w-full text-center"
                        >
                          Login
                        </Link>
                        <div className="text-secondary text-center mt-3 pb-4">
                          Don’t have an account?
                          <Link
                            href={"/register"}
                            className="text-black pl-1 hover:underline"
                          >
                            Register
                          </Link>
                        </div>
                      </>
                    )}
                    <div className="bottom pt-4 border-t border-line"></div>
                    <Link href={"#!"} className="body1 hover:underline">
                      Support
                    </Link>
                  </div>
                </div>
                <div
                  className="max-md:hidden wishlist-icon flex items-center cursor-pointer"
                  onClick={openModalWishlist}
                >
                  <Icon.Heart size={24} color="black" />
                </div>
                <div
                  className="max-md:hidden cart-icon flex items-center relative cursor-pointer"
                  onClick={openModalCart}
                >
                  <Icon.Handbag size={24} color="black" />
                  <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartState.cartArray.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="menu-mobile" className={`${openMenuMobile ? "open" : ""}`}>
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              <div className="heading py-2 relative flex items-center justify-center">
                <div
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                  onClick={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </div>
                <Link
                  href={"/"}
                  className="logo text-3xl font-semibold text-center"
                >
                  Eezer
                </Link>
              </div>
              <div className="form-search relative mt-2">
                <Icon.MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className=" h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4"
                />
              </div>
              <div className="list-nav mt-6">
                <ul>
                  <li
                    className={`${openSubNavMobile === 1 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(1)}
                  >
                    <a
                      href={"#!"}
                      className={`text-xl font-semibold flex items-center justify-between`}
                    >
                      Home
                    </a>
                  </li>
                  <li
                    className={`${openSubNavMobile === 2 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(2)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Products
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(2)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pt-3 pb-12">
                        <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                          {categoryState.categories.slice(0, 5).map((val) => {
                            const subCategory =
                              subCategoryState.subCategories.filter(
                                (item) => item.category === val._id
                              );

                            return (
                              <div
                                key={`category-${val._id}`}
                                className="nav-item"
                              >
                                <div className="text-button-uppercase pb-1">
                                  {val.name}
                                </div>
                                <ul>
                                  {subCategory &&
                                    subCategory.slice(0, 5).map((i, idx) => {
                                      return (
                                        <li key={i._id}>
                                          <div
                                            onClick={() =>
                                              handleGenderClick(i.name)
                                            }
                                            className={`link text-secondary duration-300 cursor-pointer`}
                                          >
                                            {i.name}
                                          </div>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 3 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(3)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Shop
                    </a>
                  </li>
                  <li
                    className={`${openSubNavMobile === 4 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                  >
                    <Link
                      href={"/for-men"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      For Men
                    </Link>
                  </li>
                  <li
                    className={`${openSubNavMobile === 4 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                  >
                    <Link
                      href={"for-women"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      For Women
                    </Link>
                  </li>
                  <li
                    className={`${openSubNavMobile === 6 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(6)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Blog
                    </a>
                  </li>
                  <li
                    className={`${openSubNavMobile === 4 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuOne;
