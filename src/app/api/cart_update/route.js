import pool from "../../../../lib/config";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    
    const body = await req.json();
    const { cart_id, cart_quantity } = body;

    console.log("body is---->",body)
    console.log("cart id---->",cart_id)
    console.log("cart quantity---->",cart_quantity)

    if (!cart_id || cart_quantity == null) {
      return NextResponse.json(
        { success: false, message: "Cart ID and Quantity are required" },
        { status: 400 }
      );
    }
    const query = `
      UPDATE cart 
      SET quantity = $1
      WHERE id = $2
      RETURNING *;
    `;

    const values = [cart_quantity, cart_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cart updated successfully",
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating cart:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update cart", error: err.message },
      { status: 500 }
    );
  }
}
