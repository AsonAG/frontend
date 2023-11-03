import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes";
import { AuthProvider } from "react-oidc-context";
import { authConfig, useOidc } from "./auth/authConfig";
import SignIn from "./auth/SignIn";
import "./translations";


function Authentication({children}) {
  if (!useOidc) {
    return children;
  }
  return (
    <AuthProvider {...authConfig}>
      <SignIn>
        {children}
      </SignIn>
    </AuthProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Authentication>
      <RouterProvider router={browserRouter} future={{ v7_startTransition: true }} />
    </Authentication>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
