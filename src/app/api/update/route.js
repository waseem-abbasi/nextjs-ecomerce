import { NextResponse } from "next/server";
import pool from "../../../../lib/config";

export async function PUT(req) {
  try {
    const { id, quantity } = await req.json();
    console.log("Update request:", id, quantity);

    const result = await pool.query(
      "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, id]
    );

    console.log("update quantity",result);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Item updated successfully", data: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
