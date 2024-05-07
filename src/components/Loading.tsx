import React from "react";
import "./Loading.css";
// CircleOuter component
const CircleOuter = () => {
  return (
    <svg className="circle-outer" viewBox="0 0 86 86">
      <circle className="back" cx="43" cy="43" r="40"></circle>
      <circle className="front" cx="43" cy="43" r="40"></circle>
      <circle className="new" cx="43" cy="43" r="40"></circle>
    </svg>
  );
};

// CircleMiddle component
const CircleMiddle = () => {
  return (
    <svg className="circle-middle" viewBox="0 0 60 60">
      <circle className="back" cx="30" cy="30" r="27"></circle>
      <circle className="front" cx="30" cy="30" r="27"></circle>
    </svg>
  );
};

// CircleInner component
const CircleInner = () => {
  return (
    <svg className="circle-inner" viewBox="0 0 34 34">
      <circle className="back" cx="17" cy="17" r="14"></circle>
      <circle className="front" cx="17" cy="17" r="14"></circle>
    </svg>
  );
};

// WifiLoader component
const WifiLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="wifi-loader">
        <CircleOuter />
        <CircleMiddle />
        <CircleInner />
        <div className="text" data-text="Searching"></div>
      </div>
    </div>
  );
};

export default WifiLoader;
