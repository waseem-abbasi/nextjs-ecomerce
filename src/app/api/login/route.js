import pool from "../../../../lib/config";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    console.log("result--->",result);
    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP in DB
      await pool.query(
        // "INSERT INTO otps (email, otp) VALUES ($1, $2)",
        // [email, otp]
        "INSERT INTO otps(email, otp) VALUES($1, $2) ON CONFLICT(email) DO UPDATE SET  otp = EXCLUDED.otp",
      [email,otp]
      );

      // Transporter create
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "ajmerwaseem555@gmail.com",
          pass: process.env.EMAIL_PASS || "oxwd jifv loah beto",
        },
      });

      // Send mail
      await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Login Successful ",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        html: `<p>Your OTP is: <b>${otp}</b></p><p>Valid for 5 minutes.</p>`,
      });
   
      return NextResponse.json({
        success:true,
        message: "Login successful",
        user,
        // token,
      });
    } else {
      return NextResponse.json({ success:false,message: "Invalid email or password" });
    }
  } catch (error) {
    // console.error("Login API error:", err);
    return NextResponse.json({ error: `Server error${error}` }, { status: 500 });
  }
}
