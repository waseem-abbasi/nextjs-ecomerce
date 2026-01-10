// app/api/users/route.js
import pool from "../../../../lib/config";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.category, 
        p.price, 
        p.quantity, 
        p.status AS product_status, 
        p.description AS product_description, 
        p.imgurl, 
        c.name AS category_name, 
        c.description AS category_description, 
        c.status AS category_status
      FROM public.products p
      JOIN public.category c ON c.id = p.category;
    `;

    const result = await pool.query(query);

    // console.log("result.rows ->", result.rows);

    return NextResponse.json(
      {
        success: true,
        message: "Record fetched successfully",
        data: result.rows,
      },
      { status: 200 }
    );

  } catch (e) {
    console.error("Database error ->", e);
   return NextResponse.json(
      {
        success: false,
        message: "Database error",
        data: [],
      },
      { status: 500 }
    );
  }
}
