"use client";
import { useState, useEffect } from "react";

import Homebar from "./(component)/home";
import Thirdsection from "./(component)/thirdsection";
import Card from "./(component)/cards";
import Allitems from "./allItems/page";
import axios from "axios";
//decode
import { jwtDecode } from "jwt-decode";
//createcontext----
import { useCart } from "./context/CartContext";
//router------
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState({});
  const [role, setRole] = useState();
  //createcontext-------
  const { addToCart } = useCart();

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("token is", token);

      // const decode = jwtDecode(token);

      // console.log("decode is ----->",decode.role);

      // if(decode.role == 'admin'){
      //   router.push("/admin")
      //   toast.success("this is admin ");
      // }

      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response is", res.data.success);

      if (res.data.success) {
        const grouped = groupByCategory(res.data.data);
        setCategories(grouped);
        console.log("grouped", grouped)
      } else {
        console.error("API error:", res.data.message);
      }

    } catch (error) {
      console.log("error is--->", error)
    }
  }

  // const fetchData = async () => {
  //   try {
  //     const res = await fetch("/api/users");
  //     const json = await res.json();

  //     console.log("res is", res)
  //     console.log("json is", json)

  //     if (json.success) {
  //       const grouped = groupByCategory(json.data);
  //       setCategories(grouped);
  //       console.log("grouped" + grouped)
  //     } else {
  //       console.error("API error:", json.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    setIsLoggedIn(sessionStorage?.getItem('token') ? true : false)

  }, []);

  useEffect(() => {

    // const token = sessionStorage.getItem("token")
    // const decode = jwtDecode(token);
    // console.log("decode is-----=>",decode);
    // if (role === "admin") {
    //   router.push("/admin");
    // }
    fetchData();
  }, [role]);

  function groupByCategory(rows) {
    console.log("rows is", rows);
    const result = {};
    rows.forEach((row) => {
      const catName = row.category_name;
      if (!result[catName]) {
        result[catName] = {
          name: row.category_name,
          description: row.category_description,
          products: [],
        };
      }
      result[catName].products.push({
        id: row.id,
        name: row.name,
        price: row.price,
        quantity: row.quantity,
        status: row.product_status,
        description: row.product_description,
        selectedQty: 1,
        imgurl: row.imgurl,
      });
    });
    console.log("result is", result)
    return result;

  }
  //increment
  const handlequintyinc = (catName, productId) => {
    setCategories((prev) => {
      const newCats = { ...prev };

      newCats[catName] = {
        ...newCats[catName],
        products: newCats[catName].products.map((p) =>
          p.id === productId
            ? {
              ...p,
              selectedQty: p.selectedQty < p.quantity ? p.selectedQty + 1 : p.selectedQty,
            }
            : p
        ),
      };

      return newCats;
    });
  };

  //decrement
  const handlequintydec = (catName, productId) => {
    setCategories((prev) => {
      const newCats = { ...prev };

      newCats[catName] = {
        ...newCats[catName],
        products: newCats[catName].products.map((p) =>
          p.id === productId
            ? {
              ...p,
              selectedQty: p.selectedQty > 1 ? p.selectedQty - 1 : 1,
            }
            : p
        ),
      };

      return newCats;
    });
  };
  //insert array
  const handleCard = async (item) => {
    const token = sessionStorage.getItem("token");
    let userid = null;
    try {
      const decode = jwtDecode(token)
      console.log("decod", decode);

      userid = decode.id;
      setRole(decode.role);
    } catch (error) {
      console.log("Invalid Token", error);
    }
    // console.log("userid=>", userid);

    try {
      const res = await axios.post("/api/card", {
        id: item.id,
        selectedQty: item.selectedQty,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userid: userid
          }
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Item added to cart");
        // console.log("item added")
        //usecontext---->

        addToCart(res.data.data);
      }
    } catch (error) {
      console.log("error----->>>", error);
      if (error.response.status === 409) {
        toast.error(error.response.data.message || "Item already exists in cart");
        // console.log("Item already exists", error.response.data);
      }
    }

  };
  return (
    <>
      {/* Navbar */}
      {/* <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}

      {/* Home Section */}
      <Homebar />

      {/* Middle Section */}
      <Thirdsection />

      {/* Products by Category */}
      {Object.values(categories).map((cat) => (
        <Card
          key={cat.name}
          data={cat.products}
          name={cat.name}
          description={cat.description}
          style={{ backgroundColor: "#f9f9f9" }}
          isLoggedIn={isLoggedIn}
          handlequintyinc={handlequintyinc}
          handlequintydec={handlequintydec}
          handleCard={handleCard}
        />
      ))}

     


      {/* Footer */}

    </>
  );
}
