import pool from "../../../../lib/config";
import { NextResponse } from "next/server";
import { responce } from "../../../../lib/responce";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, password } = body;

    console.log("body" + body)

    const userExist = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExist.rows.length > 0) {
      return responce(false, "User already signed up with this email", 400, []);
    } else {
      const result = await pool.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstname, lastname, email, password]
      );

      return NextResponse.json(
        {
          message: "User created successfully",
          user: result.rows[0],
        },
        { status: 201 }
      );
    }



    // return responce(true, "User Creat sucessufully", 200, result.rows);

  } catch (error) {
    console.error("Error inserting user:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
    // return responce(false, "Database error", 500, []);

  }
}
