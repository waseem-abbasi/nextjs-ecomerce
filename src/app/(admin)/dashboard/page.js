"use client";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [product, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [users, setUsers] = useState([]);
    const[bill,setBill]= useState(0)

    const chartRef = useRef(null);
    const chartRef2 = useRef(null);
    const chartRef3 = useRef(null);

    const chartInstance = useRef(null);
    const chartInstance2 = useRef(null);
    const chartInstance3 = useRef(null);

    const router = useRouter();

    //fetch products--------
    const fetchProduct = async (token) => {
        try {
            const res = await axios.get("/api/product/get", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setProducts(res.data.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.log("error is", error);
        }
    };

    //fetch category-------------
    const fetchCategory = async (token) => {
        try {
            const res = await axios.get("/api/category/fetch", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setCategory(res.data.data);
            } else {
                setCategory([]);
            }
        } catch (error) {
            console.log("error is", error);
        }
    };

    //fetch users----------------------
    const fetchUser = async (token) => {
        try {
            const res = await axios.get("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setUsers(res.data.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.log("error is", error);
        }
    };
    //bill_items-----------------------
     const fetchBill = async (token) => {
        try {
            const res = await axios.get("/api/bill_items", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("bill is-=-=>",res.data.bills[0]);

            if (res.data.success) {
                setBill(res.data.bills[0].grand_total);
                
            } else {
                setBill(0);
                console.log("bill is above ")
            }
        } catch (error) {
            console.log("error is", error);
        }
    };
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.info("please login first");
            router.push("/login");
            return;
        }
        fetchProduct(token);
        fetchCategory(token);
        fetchUser(token);
        fetchBill(token);

        console.log("bill is",bill);
    }, []);

    // Chart setup
    useEffect(() => {
        // ---------------- Doughnut Chart ----------------
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext("2d");

            chartInstance.current = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Products", "Categories", "Users"],
                    datasets: [
                        {
                            label: "Counts",
                            data: [product.length, category.length, users.length],
                            backgroundColor: ["#e993967d", "#0da2fd66", "#86eb88e3"],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(75, 192, 192, 1)",
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                    },
                    onClick: (e, elements) => {
                        if (elements.length > 0) {
                            const datasetIndex = elements[0].datasetIndex;
                            const index = elements[0].index;
                            const label = chartInstance.current.data.labels[index];
                            const value =
                                chartInstance.current.data.datasets[datasetIndex].data[index];
                            console.log(`Clicked on: ${label} (${value})`);
                             toast.info(`Clicked on: ${label} (${value})`);
                        }
                    },
                },
            });
        }

        // ---------------- Bar Chart (Name vs Quantity) ----------------
        if (chartRef2.current) {
            if (chartInstance2.current) {
                chartInstance2.current.destroy();
            }

            const ctx2 = chartRef2.current.getContext("2d");

            const productNames = product.map((p) => p.name);
            const productQuantities = product.map((p) => p.quantity);

            chartInstance2.current = new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: productNames,
                    datasets: [
                        {
                            label: "Quantity",
                            data: productQuantities,
                            backgroundColor: "#0da2fd66",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                    },
                    scales: {
                        y: { beginAtZero: true },
                    },
                    onClick: (e, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const name = productNames[index];
                            const qty = productQuantities[index];
                            console.log(`Clicked: ${name} (Qty: ${qty})`);
                            toast.info(`Clicked: ${name} (Qty: ${qty})`);
                        }
                    },
                },
            });
        }
         // ---------------- Bar Chart (Name vs Quantity) ----------------
        if (chartRef3.current) {
            if (chartInstance3.current) {
                chartInstance3.current.destroy();
            }

            const ctx3 = chartRef3.current.getContext("2d");

            const productNames = product.map((p) => p.name);
            const productQuantities = product.map((p) => p.quantity);

            chartInstance3.current = new Chart(ctx3, {
                type: "pie",
                data: {
                    labels: productNames,
                    datasets: [
                        {
                            label: "Quantity",
                            data: productQuantities,
                            backgroundColor: "#0da2fd66",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                    },
                    scales: {
                        y: { beginAtZero: true },
                    },
                    onClick: (e, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const name = productNames[index];
                            const qty = productQuantities[index];
                            console.log(`Clicked: ${name} (Qty: ${qty})`);
                            toast.info(`Clicked: ${name} (Qty: ${qty})`);
                        }
                    },
                },
            });
        }
    }, [product, category, users]);
    

    return (
        <>
            <div className="container">
                <h1
                    className="text-body-secondary fw-bold"
                    style={{ marginTop: "80px" }}
                >
                    Dashboard
                </h1>
                <div className="row  ">
                    <div className="col-sm-3 ">
                        <div className="card p-3 shadow-lg" style={{ backgroundColor: "#e993967d" }}>
                            <span className="border-info ">
                                <i className="bi bi-handbag fs-2 "></i>
                            </span>
                            <h4 className="py-2">Total product</h4>
                            <h2>{product.length}</h2>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card p-3 shadow-lg" style={{ backgroundColor: "#0da2fd66" }}>
                            <span className="border-info ">
                                <i className="bi bi-luggage fs-2"></i>
                            </span>
                            <h4 className="py-2">Total Category</h4>
                            <h2>{category.length}</h2>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card p-3 shadow-lg" style={{ backgroundColor: "#86eb88e3" }}>
                            <span className="border-info ">
                                <i className="bi bi-people-fill fs-2"></i>
                            </span>
                            <h4 className="py-2">Total users</h4>
                            <h2>{users.length}</h2>
                        </div>
                    </div>
                     <div className="col-sm-3">
                        <div className="card p-3 shadow-lg" style={{ backgroundColor: "#c3e1f1de" }}>
                            <span className="border-info ">
                                <i className="bi bi-layout-text-sidebar-reverse fs-2"></i>
                            </span>
                            <h4 className="py-2">Total Revenue</h4>
                            <h2>{bill}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Chart Canvas */}
            <div className="container mt-5">
                <div className="row p-4 ">
                    <div className="col-sm-4 card w-25 shadow-lg me-4 p-2">
                        <canvas ref={chartRef}></canvas>
                    </div>
                    <div className="col-sm-5 card shadow-lg me-2">
                        <canvas ref={chartRef2}></canvas>
                    </div>
                    <div className="col-sm-3 card shadow-lg ms-4">
                        <canvas ref={chartRef3}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}
