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
import Footer from "./(component)/footer";

import { useEffect } from "react";
import { geist } from "./fonts";

// cartcontext
import { CartProvider } from "./context/CartContext";
import Navbar from "./(component)/navbar";
import { useState } from "react";
// import Navbar from "./component/navbar";
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notshow, setNotShow] = useState(true);
  
  const pathname = usePathname()
  console.log(pathname, " ppsd");

  useEffect(() => {
    console.log("pathname=>", pathname);
    if (pathname == "/login" || pathname == "/signup") setNotShow(false)
    else setNotShow(true)
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, [isLoggedIn, pathname]);

  return (
    <html lang="en">
      <body className={`${geist.className}`} >
        <CartProvider>
          {notshow ?
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            : null}
          {children}
          <Footer/>
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
