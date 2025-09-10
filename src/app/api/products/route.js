import pool from "../../../../lib/config";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
   
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    console.log(authHeader)

    const token = authHeader.split(" ")[1];
    console.log(token)
    let decoded;
    console.log("token is"+token)
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); 
      console.log("decode"+decoded)
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    
    const body = await req.json();
    const { rs, description, type } = body;

    if (!rs || !description || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    
    const result = await pool.query(
      "INSERT INTO products (rs, description, type, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [rs, description, type, decoded.id] 
    );

    console.log("Inserted row:", result.rows[0]);
    return NextResponse.json({ message: "Data entered successfully", data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error", detail: error.message }, { status: 500 });
  }
}
