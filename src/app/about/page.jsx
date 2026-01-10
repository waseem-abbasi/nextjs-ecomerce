"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();

        if (json.success) {
          const grouped = groupByCategory(json.data);
          setCategories(grouped);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function groupByCategory(rows) {
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
        imgurl: row.imgurl,
      });
    });
    return result;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products by Category</h1>

      {/* category loop */}
      {Object.values(categories).map((cat) => (
        <div key={cat.name} style={{ marginBottom: "20px" }}>
          <h2>{cat.name}</h2>
          <p>{cat.description}</p>

          {/* product loop */}
          <ul>
            {cat.products.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> - ₹{p.price} <br />
                Qty: {p.quantity} | Status: {p.status}
                <br />
                <small>{p.description}</small>
                <br />
                <img src={p.imgurl} alt={p.name} width="100" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
