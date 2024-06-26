"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import { ProductType } from "@/type/ProductType";

const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { cartState, updateCart, removeFromCart } = useCart();
  const handleQuantityChange = (
    productId: string,
    quantityPurchase: number,
    price: any,
    orginPrice: any
  ) => {
    const itemToUpdate: any = cartState.cartArray.find(
      (item) => item._id === productId
    );
    let qty = parseInt(itemToUpdate.quantity);
    if (itemToUpdate) {
      updateCart(
        productId,
        quantityPurchase,
        itemToUpdate.selectedSize,
        itemToUpdate.selectedColor,
        price,
        orginPrice,
        qty
      );
    }
  };

  let moneyForFreeship = 150;
  let [totalCart, setTotalCart] = useState<number>(0);
  let [discountCart, setDiscountCart] = useState<number>(0);
  let [shipCart, setShipCart] = useState<number>(30);
  let [applyCode, setApplyCode] = useState<number>(0);

  const handleApplyCode = (minValue: number, discount: number) => {
    if (totalCart > minValue) {
      setApplyCode(minValue);
      setDiscountCart(discount);
    } else {
      alert(`Minimum order must be ${minValue}$`);
    }
  };

  if (totalCart < applyCode) {
    applyCode = 0;
    discountCart = 0;
  }

  if (totalCart < moneyForFreeship) {
    shipCart = 30;
  }

  if (cartState.cartArray.length === 0) {
    shipCart = 0;
  }

  const redirectToCheckout = () => {
    router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`);
  };

  let totalPrice = 0;
  let subTotalPrice = 0;
  let discountPrice = 0;
  let GST = 0;
  let gstvariation = "";
  let selectedVariation: any = "";
  cartState.cartArray.map((product: ProductType) => {
    let fx = product.price * product.quantityPurchase;
    let discountamount: any = product.originPrice - product.price;
    let gst: any =
      fx * ((parseInt(product.cgst) * product.quantityPurchase) / 100);
    const subtoalPrice = product.quantityPurchase * product.originPrice;
    totalPrice += fx;
    subTotalPrice += subtoalPrice;
    discountPrice += discountamount * product.quantityPurchase;
    GST += gst * product.quantityPurchase;
    gstvariation = product.gstvariation;
    selectedVariation = product.variation.find(
      (val: any) =>
        val.color === product.selectedColor && val.size === product.selectedSize
    );
  });

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
            <div className="xl:w-2/3 xl:pr-3 w-full">
              {/* <div className="time bg-green py-3 px-5 flex items-center rounded-lg">
                <div className="heding5">🔥</div>
                <div className="caption1 pl-2">
                  Your cart will expire in
                  <span className="min text-red text-button fw-700">
                    {" "}
                    {timeLeft.minutes}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </span>
                  <span>
                    {" "}
                    minutes! Please checkout now before your items sell out!
                  </span>
                </div>
              </div>
              <div className="heading banner mt-5">
                <div className="text">
                  Buy
                  <span className="text-button">
                    {" "}
                    $
                    <span className="more-price">
                      {moneyForFreeship - totalCart > 0 ? (
                        <>{moneyForFreeship - totalCart}</>
                      ) : (
                        0
                      )}
                    </span>
                    .00{" "}
                  </span>
                  <span>more to get </span>
                  <span className="text-button">freeship</span>
                </div>
                <div className="tow-bar-block mt-4">
                  <div
                    className="progress-line"
                    style={{
                      width:
                        totalCart <= moneyForFreeship
                          ? `${(totalCart / moneyForFreeship) * 100}%`
                          : `100%`,
                    }}
                  ></div>
                </div>
              </div> */}
              <div className="list-product w-full sm:mt-7 mt-5">
                <div className="w-full">
                  <div className="heading bg-surface bora-4 pt-4 pb-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-center">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-product-main w-full mt-3">
                    {cartState.cartArray.length < 1 ? (
                      <p className="text-button pt-3">No product in cart</p>
                    ) : (
                      cartState.cartArray.map((product) => (
                        <div
                          className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full"
                          key={product._id}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                <Image
                                  src={selectedVariation?.image}
                                  width={1000}
                                  height={1000}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div>
                                <div className="text-title">{product.name}</div>
                                <div className="list-select mt-3"></div>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/12 price flex items-center justify-center">
                            <div className="text-title text-center">
                              ₹{product.price}.00
                            </div>
                          </div>
                          <div className="w-1/6 flex items-center justify-center">
                            <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                              <Icon.Minus
                                onClick={() => {
                                  if (product.quantityPurchase > 1) {
                                    handleQuantityChange(
                                      product._id,
                                      product.quantityPurchase - 1,
                                      product.price,
                                      product.originPrice
                                    );
                                  }
                                }}
                                className={`text-base max-md:text-sm ${
                                  product.quantityPurchase === 1
                                    ? "disabled"
                                    : ""
                                }`}
                              />
                              <div className="text-button quantity">
                                {product.quantityPurchase}
                              </div>
                              <Icon.Plus
                                onClick={() => {
                                  if (
                                    product.quantityPurchase < product.quantity
                                  ) {
                                    handleQuantityChange(
                                      product._id,
                                      product.quantityPurchase + 1,
                                      product.price,
                                      product.originPrice
                                    );
                                  }
                                }}
                                className="text-base max-md:text-sm"
                              />
                            </div>
                          </div>
                          <div className="w-1/6 flex total-price items-center justify-center">
                            <div className="text-title text-center">
                              ₹{product.quantityPurchase * product.price}
                              .00
                            </div>
                          </div>
                          <div className="w-1/12 flex items-center justify-center">
                            <Icon.XCircle
                              className="text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500"
                              onClick={() => {
                                removeFromCart(product._id);
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                <form className="w-full h-full relative">
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    className="w-full h-full bg-surface pl-4 pr-14 rounded-lg border border-line"
                    required
                  />
                  <button className="button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center">
                    Apply Code
                  </button>
                </form>
              </div>
              <div className="list-voucher flex items-center gap-5 flex-wrap sm:mt-7 mt-5">
                <div
                  className={`item ${
                    applyCode === 200 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">10% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹1200
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(200, Math.floor((totalCart / 100) * 10))
                      }
                    >
                      {applyCode === 200 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${
                    applyCode === 300 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">15% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹1500
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(300, Math.floor((totalCart / 100) * 15))
                      }
                    >
                      {applyCode === 300 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${
                    applyCode === 400 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">20% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from ₹2000
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(400, Math.floor((totalCart / 100) * 20))
                      }
                    >
                      {applyCode === 400 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-1/3 xl:pl-12 w-full">
              <div className="checkout-block bg-surface p-6 rounded-2xl">
                <div className="heading5">Order Summary</div>
                <div className="total-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Subtotal</div>
                  <div className="text-title">
                    ₹<span className="total-product">{subTotalPrice}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="discount-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Discounts</div>
                  <div className="text-title">
                    {" "}
                    <span>₹</span>
                    <span className="discount">{discountPrice}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="discount-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">GST - {gstvariation}</div>
                  <div className="text-title">
                    {" "}
                    <span>₹</span>
                    <span className="discount">{GST.toFixed()}</span>
                    <span>.00</span>
                  </div>
                </div>
                {/* <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Shipping</div>
                  <div className="choose-type flex gap-12">
                    <div className="left">
                      <div className="type">
                        {moneyForFreeship - totalCart > 0 ? (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            disabled
                          />
                        ) : (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            checked={shipCart === 0}
                            onChange={() => setShipCart(0)}
                          />
                        )}
                        <label className="pl-1" htmlFor="shipping">
                          Free Shipping:
                        </label>
                      </div>
                      <div className="type mt-1">
                        <input
                          id="local"
                          type="radio"
                          name="ship"
                          value={30}
                          checked={shipCart === 30}
                          onChange={() => setShipCart(30)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="local"
                        >
                          Local:
                        </label>
                      </div>
                      <div className="type mt-1">
                        <input
                          id="flat"
                          type="radio"
                          name="ship"
                          value={40}
                          checked={shipCart === 40}
                          onChange={() => setShipCart(40)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="flat"
                        >
                          Flat Rate:
                        </label>
                      </div>
                    </div>
                    <div className="right">
                      <div className="ship">₹0.00</div>
                      <div className="local text-on-surface-variant1 mt-1">
                        ₹30.00
                      </div>
                      <div className="flat text-on-surface-variant1 mt-1">
                        ₹40.00
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                  <div className="heading5">Total</div>

                  <div className="heading5">
                    ₹
                    <span className="total-cart heading5">
                      {totalPrice.toFixed()}
                    </span>
                    <span className="heading5">.00</span>
                  </div>
                </div>
                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                  <div
                    className="checkout-btn button-main text-center w-full"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </div>
                  <Link
                    className="text-button hover-underline"
                    href={"/shop/breadcrumb1"}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
