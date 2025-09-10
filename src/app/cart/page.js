"use client";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import { montserrat, roboto } from "../fonts";

import { useCart } from "../context/CartContext";

export default function Cart() {

  const { deleteFromCart } = useCart();

 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [discount, setDiscount] = useState(0)
  const router = useRouter();


  const [rawid, setRawid] = useState(null)

  //fetch
  const fetchCarts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      //redirect login page
      if (!token) {
        toast.info("Please Login First", { toastId: "login-warning" });
        setTimeout(() => {
          router.push("/");
        }, 1500); // 1.5 second delay
        return;
      }
      const res = await axios.get("/api/cart_fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("fetch cart res", res);

      if (res.data.success) {
        const fetchedProducts = res.data.data;

        setProducts(fetchedProducts);


        const total = fetchedProducts.reduce((acc, item) => {
          if (item.cart_status === "unavailable") {
            return acc
          }
          else {
            return acc + item.cart_quantity * item.price;
          }
        }, 0);


        const tax = Math.round(total * 1 / 100);
        const discount = Math.round(total * 2 / 100);
        const Grandtotal = Math.round(total - tax + discount);
        setSubtotal(total);
        setTax(tax);
        setDiscount(discount);
        setTotal(Grandtotal);


        console.log("Total Amount:", total);
      }
      else {
        setProducts([]);
      }
      console.log("product---->", products[0]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchCarts();
  }, []);
  console.log("product====>", products[0])
  //delete ---------------->
  const handleDelete = async (item) => {

    try {
      const token = sessionStorage.getItem("token");
      //redirect login page
      // if (!token) {
      //   alert("Please login first");
      //   return;
      // }
      console.log("token----->", token)
      console.log("item id is-->", item.cart_id)
      // const confirmDelete = window.confirm(" Are you sure you want to delete this item?");
      // if (!confirmDelete) return;

      const res = await axios.delete(`/api/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { cart_id: item.cart_id }
      });

      console.log("res-=-==>", res);

      if (res.data.success) {
        toast.success("Item delete");
        console.log("delete successfully");
        deleteFromCart(item.cart_id)
        // addToCart(res.data.data)
        fetchCarts();
      }
      else {

      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        if (error.response.status === 404) {
          toast.error("Item does not exist");
        } else {
          toast.error("Failed to delete item");
        }
      } else {
        // Other errors (network, etc.)
        toast.error("An error occurred");
      }
    }
  }
const handlebill = ()=>{
      if(rawid != null){
      toast.warn("click on save fisrt");
      return;
    }
    router.push("/bill")
}
  // handle plus --------->
  const handlePlus = (item) => {
    if (item.cart_quantity < item.product_stock) {

      const updatedProducts = products.map((p) =>
        p.cart_id === item.cart_id
      ? { ...p, cart_quantity: p.cart_quantity + 1 }
      : p
    );
    console.log("item cart id",item.cart_id)
      setProducts(updatedProducts);
      //refresh page

    } else {
      toast.warning("Stock limit reached!");
    }
  };

  //handle minus------->
  const handleMinus = (item) => {
    if (item.cart_quantity > 1) {
      const updatedProducts = products.map((p) =>
        p.cart_id === item.cart_id
          ? { ...p, cart_quantity: p.cart_quantity - 1 }
          : p
      );
      setProducts(updatedProducts);
      //refresh page

    } else {
      toast.info("Quantity cannot be less than 1!");
    }
  };


  //update------->
  const handleUpdate = (item) => {
    console.log("item is" + item.cart_id)
    // console.log("index"+index);
    if(rawid != null){
      toast.warn("click on save fisrt");
      return;
    }
    setRawid(item.cart_id)
    
    // setQuantityInput(false)
    console.log(item);
    console.log("raw id" + rawid);
  }
  // console.log("quantity", quantity)
  //handlesave----------------->
  const handleSave = async (item) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {

        router.push("/login");
        return;
      }

      const res = await axios.put(
        "/api/cart_update",
        {
          cart_id: item.cart_id,
          cart_quantity: item.cart_quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Quantity updated successfully!");
        //refresh page
        fetchCarts();
        setRawid(null)
        
      } else {
        toast.error("Failed to update quantity!");
      }
    } catch (err) {
      console.error("Error while saving quantity", err);
      toast.error("Something went wrong!");
    }
  };

  console.log("products is", products);

  //available and unavailable ------------

  const availableProducts = products.filter(p => p.cart_status === "available");
  const unavailableProducts = products.filter(p => p.cart_status === "unavailable");

  console.log("available-->", availableProducts);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <ul className="nav" style={{ background: "#d4ddeaff" }}>

        <li className="nav-item me-auto ps-5">

          <h1 className={`${roboto.className}`}>cart</h1>
        </li>
        <li className="nav-item pe-5 pt-2">
          <Link href="/" className="nav-link">Home</Link>
        </li>

      </ul>
      <div className="container-fluid mt-4">
        <div className="row">




          <div className="col-sm-8">

            {/* Available Items */}
            <div className="card shadow-lg mb-4 ">
              <h5 className="p-3 bg-warning">Available Items</h5>
              <div className="table-responsive">

                <table className="table ">
                  <thead >
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Rs</th>
                     
                      <th colSpan={2} >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">No Available Items</td>
                      </tr>
                    ) : (
                      availableProducts.map((item, index) => (
                        <tr key={item.cart_id}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <img
                              src={item.imgurl}
                              alt={item.name}
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                            />
                          </td>
                          <td>{item.category_name}</td>
                          <td>{item.description}</td>

                          {rawid === item.cart_id ? (
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <i
                                  className="fa fa-minus-circle text-warning"
                                  onClick={() => handleMinus(item)}
                                ></i>
                                <span className="p-3">{item.cart_quantity}</span>
                                <i
                                  className="fa fa-plus-circle text-warning"
                                  onClick={() => handlePlus(item)}
                                ></i>
                              </div>
                            </td>
                          ) : (
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                {item.cart_quantity}
                              </div>
                            </td>
                          )}

                          <td>{item.price}</td>

                          <td>
                            <i
                              className="bi bi-trash3 text-danger fs-6"
                              onClick={() => handleDelete(item)}
                            ></i>
                          </td>

                          {rawid === item.cart_id ? (
                            <td>
                              <i
                                className="bi bi-floppy text-success fs-6"
                                onClick={() => handleSave(item)}
                              ></i>
                            </td>
                          ) : (
                            <td>
                              <i
                                className="bi bi-pencil-square text-warning fs-6"
                                onClick={() => handleUpdate(item)}
                              ></i>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>


            {/* Unavailable Items */}
            <div className="card shadow-lg">
              <h5 className="p-3 bg-danger">Unavailable / Booked Items</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Description</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unavailableProducts.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No Unavailable Items</td></tr>
                  ) : (
                    unavailableProducts.map((item, index) => (
                      <tr key={item.cart_id}>
                        <th>{index + 1}</th>
                        <td>
                          <img src={item.imgurl} style={{ width: "60px", height: "60px", borderRadius: "8px" }} />
                        </td>
                        <td>{item.category_name}</td>
                        <td>{item.description}</td>
                        <td>
                          <span className="badge bg-warning">Booked</span>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>









          <div className="col-sm-4">
            <div className="card p-4 shadow-lg">
              <h4 className="text-primary fw-bold">Order Summary</h4>

              <div className="d-flex justify-content-between mt-4">
                <span className="fs-5">Subtotal</span>
                <span className="fs-5 fw-bold">Rs.{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <span className="fs-5">Tax 1%</span>
                <span className="fs-5 fw-bold">RS.{tax}</span>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <span className="fs-5">Discount 2%</span>
                <span className="fs-5 fw-bold">Rs.{discount}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mt-4">
                <span className="fs-5 text-primary fw-bold">Total</span>
                <span className="fs-5 text-primary fw-bold">Rs.{total}</span>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button className="btn btn-primary" type="button" onClick={handlebill}>
Procced to Checkout                </button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link href="/" className="nav-link">Continue Shoping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
