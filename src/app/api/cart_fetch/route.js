// app/api/cart/route.js
import pool from "../../../../lib/config";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    } else {
      const query = `
    SELECT 
    cart.id AS cart_id,
    cart.status AS cart_status,
    products.name AS product_name,
    products.id AS product_id,
    cart.quantity AS cart_quantity,       
    products.quantity AS product_stock,   
    products.price,
    category.name AS category_name,
    products.description,
    products.imgurl
    FROM public.cart
    JOIN products ON products.id = cart.product
    JOIN category ON category.id = products.category
    ORDER BY cart.id ASC;
    `;

      const result = await pool.query(query);
      console.log("req----------->", req)
      console.log("get result===>>>", result.rows)

      return NextResponse.json({
        success: true,
        message: "Cart items fetched successfully",
        data: result.rows,
      }, { status: 200 });
    }


  } catch (err) {
    console.error("Error fetching cart:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch cart items",
      data: null,
    }, { status: 500 });
  }
}
