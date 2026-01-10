import { NextResponse } from "next/server";
import pool from "../../../../../lib/config";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { message: "Request body missing or invalid JSON", success: false },
        { status: 400 }
      );
    }

    const { name, category, price, quantity, status, description,imgurl } = body;

    if (!name || !status || !description || !quantity || !price || !category || !imgurl) {
      return NextResponse.json(
        { message: "Name, status, description, quantity, price, and category are required", success: false }
       
      );
    }

    const productExist = await pool.query(
      "SELECT * FROM products WHERE name = $1",
      [name]
    );

    if (productExist.rows.length > 0) {
      return NextResponse.json(
        { message: "Product already exists", success: false }
      );
    }

    const result = await pool.query(
      `INSERT INTO products (name, status, description, quantity, price, category,imgurl)
       VALUES ($1, $2, $3, $4, $5, $6,$7)
       RETURNING *`,
      [name, status, description, quantity, price, category,imgurl]
    );

    return NextResponse.json(
      { message: "Product inserted successfully", success: true, data: result.rows[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}
