"use client";

// fafa icons 
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ensure this import

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
// bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

import { useEffect } from "react";
import { geist } from "./fonts";

// cartcontext
import { CartProvider } from "./context/CartContext";

export default function RootLayout({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body className={`${geist.className}`}>
        <CartProvider>
          {children}
        </CartProvider>

        {/* Toastify */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </body>
    </html>
  );
}
