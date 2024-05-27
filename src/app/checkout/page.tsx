"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IUser } from "@/type/authTypes";
import { toast } from "react-toastify";
import { IOrder } from "@/type/OrderType";
import { useOrder } from "@/context/OrderContext";
import { ProductType } from "@/type/ProductType";
import Razorpay from "razorpay";
import { message } from "antd";

const Checkout = () => {
  const searchParams = useSearchParams();
  let discount = searchParams.get("discount");
  let ship = searchParams.get("ship");
  const { authState, login } = useAuth();
  const { cartState } = useCart();
  const { addToOrder, orderState } = useOrder();
  let [totalCart, setTotalCart] = useState<number>(0);
  const [activePayment, setActivePayment] = useState<string>("credit-card");
  const [loginData, setLoginData] = useState<IUser>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [orderData, setOrderData] = useState<IOrder>({
    userId: "",
    items: [],
    name: "",
    lastName: "",
    total: 0,
    totalItem: 0,
    voucher: "",
    taxFee: 0,
    shippingAddress: "",
    shippingCost: 0,
    phoneNumber: "",
    email: "",
    paymentMethod: "cod",
    country: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  useEffect(() => {
    if (cartState.cartArray.length > 0) {
      const totalPrice = cartState.cartArray.reduce((acc, val) => {
        return acc + val.price * val.quantityPurchase;
      }, 0);

      setOrderData((prev: IOrder) => {
        return {
          ...prev,
          userId: authState.user?._id,
          items: cartState.cartArray.map((val: any) => {
            return {
              product: val._id,
              price: val.price * val.quantityPurchase,
              quantity: val.quantityPurchase,
              selectedSize: val.selectedSize,
              selectedColor: val.selectedColor,
            };
          }),
          total: totalPrice,
        };
      });
    }
  }, [cartState]);

  const handlePayment = async (e: any) => {
    e.preventDefault;
    try {
      const options: any = {
        key: "rzp_test_heaiUIHYeBVaCd", // Enter the Key ID generated from the Dashboard
        amount: orderData.items.map((val) => val.price * val.quantity),
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: orderData._id,
        handler: function (response: any) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          // Handle the response here (you can save the payment details in your database)
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1: any = new Razorpay(options);
      rzp1.open();
      let res = addToOrder(orderData);
      console.log("res: ", res);
      // router.push("/");
    } catch (error) {
      router.push("/");
      console.log("error: ", error);
    }
  };

  let country = "India";

  function loadScript(src: any) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    let ConvertAmt;
    let currency;
    let amt: any = orderData?.total;

    if (country === "India") {
      ConvertAmt = amt;
      currency = "INR";
    } else {
      ConvertAmt = orderData.total;
      currency = "USD";
    }
    const createBillingInfo: any = {
      companyid: orderData._id,
      subscriptionid: "21",
      subscriptionpk: 2,
      paymentId: "123",
      currency: currency,
      billingdate: "63",
      amountdue: "60",
      paymentstatus: "ok",
      orderjson: {},
      successjson: {},
      amountreceived: ConvertAmt,
      createdat: "any",
      createdby: "string",
    };
    try {
      let result: any = addToOrder(orderData);
      if (result.data) {
        message.success("Billing Information Created Successfully");
      } else if (result.error.data === "Duplicate record found") {
        message.error(result.error.data);
      }
    } catch (error) {
      console.log("error", error);
    }

    const res: any = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const options = await {
      key: "rzp_test_heaiUIHYeBVaCd",
      amount: amt * 100,
      currency: currency,
      name: "Eezer",
      description: "Test Transaction",
      image:
        "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.504dcd7c.jpg&w=96&q=75",
      order_id: orderData._id,
      method: "card",
      config: {
        display: {
          hide: [
            {
              method: "paylater",
            },
          ],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      notes: {
        address: "Eezer Private Limited",
      },
      theme: {
        color: "#5f63f2",
      },
    };
    //@ts-ignore
    const paymentObject = await new window.Razorpay(options);
    paymentObject.open();
  }

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      let res = await login(loginData?.email, loginData?.password);
      toast.success("Login Successful");
    } catch (error) {
      toast.error("Login Failed!");
    }
  };

  let totalPrice = 0;
  let subTotalPrice = 0;
  let discountPrice = 0;
  let GST = 0;
  let gstvariation = "";
  let discountVariation = "";
  let gstType = "";
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
    discountVariation = product.discountType;
    gstType = product.cgst;
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
          <div className="content-main flex justify-between">
            <div className="left w-1/2">
              {authState.user === null && (
                <>
                  <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                    <div className="left flex items-center">
                      <span className="text-on-surface-variant1 pr-4">
                        New to Eezer?{" "}
                      </span>
                      <Link
                        href={"/register"}
                        className="text-button text-on-surface hover-underline cursor-pointer"
                      >
                        Signup
                      </Link>
                    </div>
                    <div className="right">
                      <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                    </div>
                  </div>
                  <div className="form-login-block mt-3">
                    <form className="p-5 border border-line rounded-lg">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="email ">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="username"
                            type="email"
                            placeholder="Username or email"
                            required
                            onChange={(e) => {
                              setLoginData((prev: any) => {
                                return {
                                  ...prev,
                                  email: e.target.value,
                                };
                              });
                            }}
                          />
                        </div>
                        <div className="pass ">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => {
                              setLoginData((prev: any) => {
                                return {
                                  ...prev,
                                  password: e.target.value,
                                };
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="block-button mt-3">
                        <button
                          onClick={(e) => handleSubmitLogin(e)}
                          className="button-main button-blue-hover"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
              <div className="information mt-5">
                <div className="heading5">Information</div>
                <div className="form-checkout mt-5">
                  <form>
                    <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="firstName"
                          type="text"
                          placeholder="First Name *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                name: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="lastName"
                          type="text"
                          placeholder="Last Name *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                lastName: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="email"
                          type="email"
                          placeholder="Email Address *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                email: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="phoneNumber"
                          type="number"
                          placeholder="Phone Numbers *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                phoneNumber: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="col-span-full select-block">
                        <select
                          className="border border-line px-4 py-3 w-full rounded-lg"
                          id="region"
                          name="region"
                          defaultValue={"default"}
                          onChange={(e) => {
                            console.log("se1: ", e);
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                country: e.target.value,
                              };
                            });
                          }}
                        >
                          <option value="default" disabled>
                            Choose Country/Region
                          </option>
                          <option value="India">India</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <Icon.CaretDown className="arrow-down" />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="city"
                          type="text"
                          placeholder="Town/City *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                city: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="apartment"
                          type="text"
                          placeholder="Street,..."
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                shippingAddress: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="select-block">
                        <select
                          className="border border-line px-4 py-3 w-full rounded-lg"
                          id="country"
                          name="country"
                          defaultValue={"default"}
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                state: e.target.value,
                              };
                            });
                          }}
                        >
                          <option value="default" disabled>
                            Choose State
                          </option>
                          <option value="India">India</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <Icon.CaretDown className="arrow-down" />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="postal"
                          type="text"
                          placeholder="Postal Code *"
                          required
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                pincode: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="col-span-full">
                        <textarea
                          className="border border-line px-4 py-3 w-full rounded-lg"
                          id="note"
                          name="note"
                          placeholder="Write note..."
                          onChange={(e) => {
                            setOrderData((prev: any) => {
                              return {
                                ...prev,
                                notes: e.target.value,
                              };
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <div className="block-button md:mt-10 mt-6">
                      <button
                        onClick={displayRazorpay}
                        className="button-main w-full"
                      >
                        Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="right w-5/12">
              <div className="checkout-block">
                <div className="heading5 pb-3">Your Order</div>
                <div className="list-product-checkout">
                  {cartState.cartArray.length < 1 ? (
                    <p className="text-button pt-3">No product in cart</p>
                  ) : (
                    cartState.cartArray.map((product) => (
                      <>
                        <div className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5">
                          <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[0]}
                              width={500}
                              height={500}
                              alt="img"
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="name text-title">
                                {product.name}
                              </div>
                              <div className="caption1 text-secondary mt-2">
                                <span className="size capitalize">
                                  {product.selectedSize}
                                </span>
                                <span>/</span>
                                <span className="color capitalize">
                                  {product.selectedColor ||
                                    product.variation[0].color}
                                </span>
                              </div>
                            </div>
                            <div className="text-title">
                              <span className="quantity">
                                {product.quantityPurchase}
                              </span>
                              <span className="px-1">x</span>
                              <span>₹{product.price}.00</span>
                              <del
                                style={{
                                  paddingLeft: "10px",
                                  fontSize: "12px",
                                }}
                              >
                                ₹{product.originPrice}.00
                              </del>
                            </div>
                          </div>
                        </div>
                      </>
                    ))
                  )}
                </div>
                <>
                  <div className="ship-block py-5 flex justify-between border-b border-line">
                    <p>
                      GST - {gstType}% - {gstvariation}
                    </p>
                    <del>₹{GST}</del>
                  </div>
                  <div className="ship-block py-5 flex justify-between border-b border-line">
                    <p>Discount - {discountVariation}</p>
                    <del>₹{discountPrice}</del>
                  </div>
                  <div className="total-cart-block pt-5 flex justify-between">
                    <div className="heading5">Total</div>
                    <div className="heading5">₹{totalPrice}</div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
