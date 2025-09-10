"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);


  const fetchCarts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/api/cart_fetch", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("res---->",res);

      if (res.data.success) {
        const availableItems = res.data.data.filter(
          (item) => item.cart_status === "available"
        );
        setCartItems(availableItems);

        console.log("available items",availableItems)

      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setCartItems([]);
    }
  };

  // console.log("cart items is ----><+++",cartItems)

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  //remove cart-----------
  const deleteFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.cart_id !== id));
  };


  return (
    <CartContext.Provider value={{ cartItems, fetchCarts, addToCart, deleteFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
