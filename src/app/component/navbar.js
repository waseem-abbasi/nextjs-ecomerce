"use client";
import Link from "next/link";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
//cartcontext---------
import { useCart } from "../context/CartContext";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const router = useRouter();
  const [userName, setUsername] = useState(null);

  const [products, setProducts] = useState([]);

  //createcontext------------
  const { cartItems, fetchCarts } = useCart();


  console.log("cartitems is ",cartItems)


  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decode = jwtDecode(token)
        console.log("decodd---->", decode);
        setUsername(`${decode.firstname} ${decode.lastname}`);
        //count

        setIsLoggedIn(true);
        console.log("hello check----> ", cartItems.length)
        //createcontext--------
        fetchCarts()

      } catch (error) {
        console.log("Invalid Token", error);
      }
    } else {
      setIsLoggedIn(false);

    }

  }, []);
  //logout------
  const handleLogout = () => {
    if (isLoggedIn == true) {

      sessionStorage.removeItem("token");
      setUsername(null);
      toast.success("logout successfully");

      setIsLoggedIn(false);
      router.push("/")

    } else {
      router.push("/login")
    }
  }
  console.log("username is", userName);
  //handle click-------------
  const handleClick = () => {
    const token = sessionStorage.getItem("token");


    if (!token) {
      toast.warning("please login first");

    }
    else {
      router.push("/cart")
    }
  }

  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <h4 className="text-white ">E-Commerce</h4>
          <h5 className="m-2  text-white">{userName ? `Welcome, ${userName}` : ""}</h5>
          <div className="ms-auto pe-5">


            <div className="position-relative" onClick={handleClick} style={{ cursor: "pointer" }}>
              <i className="bi bi-cart text-light" style={{ fontSize: "25px" }}></i>
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.length}
                </span>
              )}
            </div>

          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">

                  <Link className="nav-link active" href="/">

                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/">
                    Cards
                  </Link>
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-primary" onClick={handleLogout}>{isLoggedIn ? "Logout" : "Login"}</button>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
