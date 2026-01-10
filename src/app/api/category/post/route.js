import { NextResponse } from "next/server";
import pool from "../../../../../lib/config";


export async function POST(req) {
  try {
    
    const body = await req.json();

    console.log("body is category",body);

    if (!body) {
      return NextResponse.json(
        { message: "Request body missing or invalid JSON", success: false },
        { status: 400 }
      );
    }

    const { name, status, description } = body;

    if (!name || !status || !description) {
      return NextResponse.json(
        { message: "Name and status description are required", success: false },
        { status: 400 }
      );
    }

      const categoryExist = await pool.query(
      "SELECT * FROM category WHERE name = $1",
      [name]
    );

     if (categoryExist.rows.length > 0) {
            return NextResponse.json(
            { message: "Category already exist", success: false}
          );
        }else{
          const result = await pool.query(
            `INSERT INTO category (name, status, description)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, status, description]
          );
          return NextResponse.json(
            { message: "Category inserted successfully", success: true, data: result.rows[0] },
            { status: 201 }
          );
        }
    

  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}
