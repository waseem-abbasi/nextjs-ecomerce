import { NextResponse } from "next/server";
import pool from "../../../../../../lib/config";

export async function GET(req, context) {
  
  let {id} = await context.params;

  try {
    if (!id) {
      const result = await pool.query("SELECT * FROM category ORDER BY id ASC");
      return NextResponse.json(
        { message: "All categories fetched", success: true, data: result.rows },
        { status: 200 }
      );
    } else {
      if (Array.isArray(id)) {
        id = id[0];
      }
      const result = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "Category not found", success: false },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Category fetched", success: true, data: result.rows[0] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
