import pool from "../../../../lib/config";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const user_id = req.headers.get("userid");

    console.log("body-->", body);
    console.log("user_id-->", user_id);

    const checkQuery = `
      SELECT * FROM cart 
      WHERE product = $1 AND userid = $2 and status='available'
    `;
    const checkValues = [body.id, user_id];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Item already exists in cart",
        data: checkResult.rows[0],
      }, { status: 409 }); 
    }

    const insertQuery = `
      INSERT INTO cart (product, quantity, userid, createddate, updateddate)
      VALUES ($1, $2, $3, now(), now())
      RETURNING *;
    `;
    const insertValues = [body.id, body.selectedQty, user_id];
    const insertResult = await pool.query(insertQuery, insertValues);

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      data: insertResult.rows[0],
    }, { status: 200 });

  } catch (err) {
    console.error("Cart API Error =>", err);
    return NextResponse.json({
      success: false,
      message: "Failed to add item",
      data: null,
    }, { status: 500 });
  }
}
