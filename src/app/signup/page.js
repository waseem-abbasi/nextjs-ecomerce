"use client";
import Link from "next/link";
import axios from "axios";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
//toastify
import { toast } from "react-toastify";

export default function Signup() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const useFirstname = useRef(null);
    const useLastname = useRef(null);
    const useEmail = useRef(null);
    const usePassword = useRef(null);

    const firstNameErrorRef = useRef(null);
    const lastNameErrorRef  = useRef(null);
    const passwordErrorRef  = useRef(null);
    const emailErrorRef     = useRef(null);


    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    const emailPattern    = /^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email is---->", useEmail.current.value)
        try {
            const firstNameValue = useFirstname.current.value.trim();
            const lastNameValue = useLastname.current.value.trim();
            const emailValue = useEmail.current.value.trim();
            const passwordValue = usePassword.current.value.trim();

            // Validations
            if (/\d/.test(firstNameValue)) {
                firstNameErrorRef.current.style.color = 'red';
                firstNameErrorRef.current.innerText = 'Numbers and symbols not allowed in first name';
                return;
            }
            if (/\d/.test(lastNameValue)) {
                lastNameErrorRef.current.style.color = 'red';
                lastNameErrorRef.current.innerText = 'Numbers not allowed in last name';
                return;
            }
            if (!passwordPattern.test(passwordValue)) {
                passwordErrorRef.current.style.color = 'red';
                passwordErrorRef.current.innerText =
                    'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.';
                return;
            }
            if (!emailPattern.test(emailValue)) {
                emailErrorRef.current.style.color = 'red';
                emailErrorRef.current.innerText =
                    'Please enter a valid email address (e.g., user@example.com).';
                return;
            }

            // Clear errors if valid
            firstNameErrorRef.current.innerText = '';
            lastNameErrorRef.current.innerText = '';
            passwordErrorRef.current.innerText = '';
            emailErrorRef.current.innerText = '';

            const formData = {
                firstname: firstNameValue,
                lastname: lastNameValue,
                email: emailValue,
                password: passwordValue,
            };
            console.log("formdata------>", formData);




            try {
                const response = await axios.post("/api/signup", formData, {
                    headers: { "Content-Type": "application/json" },
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                } else {
                    toast.warning(response.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong!");
            }




            router.push("/login");

            // Clear form fields
            useFirstname.current.value = '';
            useLastname.current.value = '';
            useEmail.current.value = '';
            usePassword.current.value = '';
        } catch (err) {
            console.error("Request failed:", err);
        }


    };


    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div
                    className="card shadow p-4"
                    style={{ width: "100%", maxWidth: "600px" }}
                >
                    <h3 className="text-center mb-4">Signup</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <label htmlFor="firstname" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    name="firstname"


                                    placeholder="Enter your first name"
                                    ref={useFirstname}
                                />
                                <div ref={firstNameErrorRef}></div>
                            </div>

                            <div className="col-lg-6 mb-3">
                                <label htmlFor="lastname" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastname"
                                    name="lastname"


                                    placeholder="Enter your last name"
                                    ref={useLastname}
                                />
                                <div ref={lastNameErrorRef}></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"


                                    placeholder="Enter your email"
                                    ref={useEmail}
                                />
                                <div ref={emailErrorRef}></div>

                            </div>

                            <div className="col-lg-6 mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        ref={usePassword}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                    </button>
                                </div>
                                <div ref={passwordErrorRef}></div>
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                        <div className="d-flex justify-content-center mt-3 text-primary">
                            <Link className="nav-link active" href="/login">
                                Go to Login Page
                            </Link>                             
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
