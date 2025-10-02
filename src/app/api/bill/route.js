import pool from "../../../../lib/config";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body is", body);

    const { userid, payment_mode, cartItems } = body;

    console.log("cartItems====>", cartItems);

    if (!userid || !payment_mode) {
      return NextResponse.json(
        { success: false, message: "Missing userid or payment_mode" },
        { status: 400 }
      );
    }

    // Insert bill
    const billQuery = `
      INSERT INTO bill ( userid, bill_date, payment_mode )
      VALUES ( $1, NOW(), $2 )
      RETURNING *;
    `;
    const billValues = [userid, payment_mode];
    const billResult = await pool.query(billQuery, billValues);

    const billId = billResult.rows[0].id;

    // Insert bill items + (later stock update)
    for (const item of cartItems) {
      await pool.query(
        `INSERT INTO bill_items 
          ( product, bill_id, quantity, userid ) 
         VALUES ( $1,$2,$3,$4 )`,
        [item.product_id, billId, item.cart_quantity, userid]
      );

      const beforequantity = item.product_stock - item.cart_quantity;

      console.log("before quantity-->",beforequantity)
      
      await pool.query(
        `UPDATE products 
         SET quantity = $1
         WHERE id = $2`,
        [beforequantity, item.product_id]
      );

      // cart_status update
      await pool.query(
        `UPDATE cart 
        SET status = 'unavailable'
        WHERE id = $1`,
        [item.cart_id]
      );

    }

    // console.log("cart_quantity---->",item.cart_quantity)
    // console.log("product_stock=====>",item.product_id)

    return NextResponse.json(
      { success: true, message: "Bill and items inserted", billId },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /api/payment:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
