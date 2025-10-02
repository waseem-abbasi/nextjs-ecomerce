"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
// import Navbar from "../component/navbar";
// import Footer from "../component/footer";

export default function Payment() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const router = useRouter();

    const { cartItems, fetchCarts } = useCart();

    console.log("cartItems   ---= >", cartItems);

    console.log("fetchcard ", fetchCarts);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.info("Please Login First");
            router.push("/login");
            return;
        }
    }, [])

    const paymentSubmit = async (type) => {

       
        const token = sessionStorage.getItem("token");
        let userid = null;
       

        try {
            const decode = jwtDecode(token);
            userid = decode.id;
        } catch (error) {
            console.log("error decoding token:", error);
        }

        try {

            const response = await axios.post(
                "/api/bill",
                { userid: userid, payment_mode: type, cartItems: cartItems },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.success) {
                console.log("response is ", response.data);
                toast.success("Payment saved!");
                router.push("/");
            }
            else {
                toast.error("user not found");
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <>
           

            <div className="justify-content-center align-items-center d-flex mt-5 shadow-lg bg-white">
                <div className="d-grid gap-2 m-5 border border-info">
                    <h1 className="text-center text-info  m-5" >Payment Gateway</h1> 
                    <button
                        type="button"
                        className="btn btn-primary me-3 ms-3"
                        onClick={() => paymentSubmit("cash")}
                    >
                        Cash
                    </button>
                    <button
                        className="btn btn-primary me-3 ms-3 mb-5"
                        type="button"
                        onClick={() => paymentSubmit("online")}
                    >
                        Online
                    </button>
                </div>
            </div>
            
        </>
    );
}
