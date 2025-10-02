import { NextResponse } from "next/server";
import pool from "../../../../../../lib/config";

export async function PUT(req, context) {
  
  console.log("req ",req)
  console.log("context ",context)

  try {

    let { id } = context.params; 

    if (Array.isArray(id)) {
      id = id[0]; 
    }

    console.log("id is ====>", id);

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, status, description,quantity,price,category } = body;

    if (!name || !status || !description || !quantity || !price || !category) {
      return NextResponse.json(
        { message: "Name, status, description, quantity, price, and category are required", success: false }
       
      );
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, status = $2, description = $3, quantity = $4, price = $5, category = $6
       WHERE id = $7 
       RETURNING *`,
      [name, status, description,quantity,price,category,id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Category not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Category updated successfully",
        success: true,
        data: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}
