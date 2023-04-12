import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { FronteggProvider } from "@frontegg/react";

// const contextOptions = {
//   baseUrl: "https://app-ww7e8wl3x8sd.frontegg.com",
//   clientId: "fe63fb2b-db8f-46a7-a689-05b5e3d998cb",
// };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    {/* </FronteggProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
