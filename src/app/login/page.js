"use client";

import { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
export default function LoginPage() {
  const router = useRouter();
  const otpErrorRef = useRef(null);

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const otpPattern = /^[0-9]{6}$/;

  // Handle input change (email, password)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login (first step)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", formData);

      console.log("response", res.data.message);
      if (res.data.success) {
        setOtpMode(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.warning("Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed.");
    }
  };

  // Handle OTP verify (second step)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpValue = otp.trim();
      console.log("otp value"+otpValue)
      console.log("otp "+otp)
      
      if (!otpPattern.test(otpValue)) {
        otpErrorRef.current.style.color = "red";
        otpErrorRef.current.innerText =
          "Please enter a 6-digit numeric OTP.";
        return;
      } else {
        otpErrorRef.current.innerText = "";
      }
      const res = await axios.post("/api/otp_verify", {
        email: formData.email,
        otp: otpValue,
      });

      console.log("email and otp", res);

      if (res.data.message === "otp verify successfully") {

        const token = sessionStorage.setItem("token", res.data.token);

        if(!token){

          const token = sessionStorage.getItem("token", res.data.token)
          const decode = jwtDecode(token)
          console.log("decoddee is",decode);
          if(decode.role === 'admin'){
            toast.success("OTP verified! Login successful.");
            router.push("/dashboard")
          }else{
            toast.success("OTP verified! Login successful.");
            router.push("/")
          }

        }else{console.log("token is not valid")}
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      if(err.response.data.error == "Invalid OTP"){
        toast.warning("please check otp is wrong");
      }
      else{
        console.error(err.response.data.error);
        toast.error("OTP verification failed.");
      }
    }
  };
  

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={otpMode ? handleOtpSubmit : handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={otpMode} // lock field if OTP mode
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={otpMode} // lock field if OTP mode
            />
          </div>

          {/* OTP Input (only when otpMode true) */}
          {otpMode && (
            <div className="mb-3">
              <label>Enter OTP</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                
              />
              <div ref={otpErrorRef}></div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            {otpMode ? "Verify OTP" : "Log In"}
          </button>

          {!otpMode && (
            <div>
              <p className="m-3">
                Don't have an account?{" "}
                <Link href="/signup" className="text-decoration-none">
                  Signup
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
