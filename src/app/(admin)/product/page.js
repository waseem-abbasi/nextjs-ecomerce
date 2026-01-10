"use client"
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Product() {

    const router = useRouter();
    const [products, setProducts] = useState([]);

    const [category, setCategory] = useState([]);

    const [changeButton, setChangeButton] = useState(false)

    const [showModel, setShowModel] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        status: "unavailable",
        quantity: "",
        price: "",
        description: "",
        imgurl:"",

    });

    // handle input change
    const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value })
         
         console.log("formdata isis ",formData)
         console.log("e",e);
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        console.log("form data is----", formData.category);
        if (changeButton) {
            try {
                const res = await axios.put(`/api/product/put/${formData.id}`,
                    {
                        name: formData.name,
                        status: formData.status,
                        description: formData.description,
                        category: formData.category,
                        price: formData.price,
                        quantity: formData.quantity
                    });

                if (res.data.success) {
                    setShowModel(false);
                    toast.success("Category updated successfully!");
                    fetchProduct();
                }
                else {
                    toast.error(res.data.message)
                    console.log(res.data.message)
                    return
                }
                setFormData({ name: "", status: "unavailable", description: "", category: "", price: "", quantity: "",imgurl:"", });
                setChangeButton(false)

            } catch (error) {
                toast.warning("something went wrong")

            }
        } else {


            try {
                const res = await axios.post("/api/product/post", formData);

                if (res.data.success) {
                    toast.success("Category inserted successfully! ");
                    setFormData({ name: "", status: "unavailable", description: "", category: "", price: "", quantity: "", imgurl:"", });
                    fetchProduct();
                    setShowModel(false);
                } else {
                    toast.error(res.data.message)

                }

            } catch (error) {
                console.error("Error inserting category:", error);
            }
        }

    };


    const handleUpdate = async (row) => {
        console.log("row", row);
        setChangeButton(true)
        setShowModel(true)
        setFormData(row);
    }

    const handleInsert = () => {
        setShowModel(true)
        setChangeButton(false)
        setFormData({ name: "", status: "unavailable", description: "", category: "", price: "", quantity: "",imgurl:"" });
    }

    const columns = [
        {
            name: "SR.N",
            cell: (row, index) => index + 1,
            width: "70px",
        },
         {
            name: "imgurl",
            selector: (row) => row.imgurl,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Price",
            selector: (row) => row.price,
            sortable: true,
        },
        {
            name: "quantity",
            selector: (row) => row.quantity,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.description,
        },

        {
            name: "Actions",
            cell: (row) => (
                <>
                    <i className="bi bi-pencil-square text-warning fs-5 pe-3" onClick={() => handleUpdate(row)}></i>
                    <i className="bi bi-trash3 text-danger fs-5" onClick={() => handleDelete(row)}></i>
                </>
            ),
        },
    ];


    //delete ---------------------
    const handleDelete = async (row) => {

        console.log(row.id);

        try {
            const res = await axios.delete(`/api/product/delete/${row.id}`);
            console.log("response", res);
            if (res.data.success) {

                toast.success("product deleted successfully!");
                fetchProduct();

            } else {
                toast.error(res.data.message || "Delete failed");
            }
        } catch (error) {
            console.log("error is", error);
            toast.error("Something went wrong!");
        }
    };

    //fetch products ----------------------------------
    const fetchCategory = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.info("please login first");
                router.push("/login");
                return;
            }
            const res = await axios.get("/api/category/fetch", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("categor res===>", res);
            console.log("data is", res.data.data);
            console.log("succes", res.data.success)
            if (res.data.success) {
                setCategory(res.data.data);
                console.log("response is true ---->", res.data.data);
            } else {
                setCategory([]);
            }
        } catch (error) {
            console.log("error is", error);
        }
    };

    // Fetch product data
    const fetchProduct = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                toast.info("please login first");
                router.push("/login");
                return;
            }

            const res = await axios.get("/api/product/get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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





    useEffect(() => {

        fetchCategory();
        fetchProduct();
        
        console.log("product is",products);

    }, []);

    return (
        <>
            <h1 className="text-center " style={{ marginTop: "100px" }}></h1>

            {/* <!-- Modal --> */}
            {showModel ? (
                <>
                    <div className="modal show d-block " tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                                    <div className="mb-3">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Select Category --</option>
                                            {category.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            className="form-select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="available">available</option>
                                            <option value="unavailable">unavailable</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="form-control"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                     <div className="mb-3">
                                        <label>image</label>
                                        <input
                                           
                                            name="imgurl"
                                            className="form-control"
                                            value={formData.imgurl}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-danger " onClick={() => setShowModel(false)}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary " onClick={handleSubmit}>
                                            {changeButton ? ("update") : ("save Product")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}


            <div className="container mt-4 ">
                <DataTable
                    title="Product List"
                    columns={columns}
                    data={products}
                    pagination
                    highlightOnHover
                    actions={
                        <>
                            <button
                                type="button"
                                className="btn btn-primary me-2"
                                onClick={handleInsert}
                            >
                                +insert
                            </button>
                        </>
                    }
                />
            </div>

        </>
    );
}
