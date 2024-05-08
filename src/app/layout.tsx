"use client";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "@/styles/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import GlobalProvider from "./GlobalProvider";
import ModalCart from "@/components/Modal/ModalCart";
import ModalWishlist from "@/components/Modal/ModalWishlist";
import ModalSearch from "@/components/Modal/ModalSearch";
import ModalQuickview from "@/components/Modal/ModalQuickview";
import ModalCompare from "@/components/Modal/ModalCompare";
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import WifiLoader from "@/components/Loading";

const serverTimeLeft: CountdownTimeType = countdownTime();

const instrument = Instrument_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => {
      setIsLoading(true);
      // Delay showing the loader by 500 milliseconds (adjust as needed)
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    const endLoading = () => setIsLoading(false);

    Router.events.on("routeChangeStart", startLoading);
    Router.events.on("routeChangeComplete", endLoading);
    Router.events.on("routeChangeError", endLoading);

    return () => {
      Router.events.off("routeChangeStart", startLoading);
      Router.events.off("routeChangeComplete", endLoading);
      Router.events.off("routeChangeError", endLoading);
    };
  }, []);
  return (
    <GlobalProvider>
      <html lang="en">
        <body className={instrument.className}>
          {isLoading && <WifiLoader />}
          {children}
          <ModalCart serverTimeLeft={serverTimeLeft} />
          <ModalWishlist />
          <ModalSearch />
          <ModalQuickview />
          <ModalCompare />
        </body>
      </html>
    </GlobalProvider>
  );
}
