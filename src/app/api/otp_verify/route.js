import { NextResponse } from "next/server";
import pool from "../../../../lib/config";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    console.log("email------->"+email)
    console.log("otp------<"+typeof(otp))

    // if (!email || !otp) {
    //   return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
    // }

    // Fetch latest OTP
    const result = await pool.query(
      "SELECT * FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );
    console.log("result->",result);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }

    const record = result.rows[0];
    console.log("record---->",record);
    // Check OTP match
    if (record.otp !== otp) {
      
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Get user info
    const userResult = await pool.query(
      "SELECT id, firstname, lastname, email FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return correct response
    return NextResponse.json(
      { message: "otp verify successfully", token, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });
  }
}
