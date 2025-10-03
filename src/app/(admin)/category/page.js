"use client";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Category() {
  const [showModel, setShowModel] = useState(false)
  const nameError = useRef(null)
  const descriptionError = useRef(null);
  const [category, setCategory] = useState([]);
  const [buttonChange, setbuttonChange] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    status: "unavailable",
    description: "",
  });

  console.log("formdata is", formData)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  //data submit ------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name == "") {
      nameError.current.style.color = 'red';
      nameError.current.innerText = 'please fill this field'
      return
    }
    if (formData.description == "") {
      descriptionError.current.style.color = 'red';
      descriptionError.current.innerText = 'please fill this field'
      return
    }

    if (!buttonChange) {
      try {
        const res = await axios.post("/api/category/post", formData);

        console.log("response is", res);

        if (res.data.success) {
          toast.success("Category inserted successfully! ");
          setShowModel(false);
          setFormData({ name: "", status: "unavailable", description: "" });
          fetchCategory();
        }
      } catch (error) {
        console.error("Error inserting category:", error);
      }
    }

    //update --------------
    else {
      console.log("formdata id", formData.id)
      console.log("formdata is----=>", formData)

      try {

        const res = await axios.put(`/api/category/put/${formData.id}`,
          {
            name: formData.name,
            status: formData.status,
            description: formData.description,
          });

        console.log("response is", res)

        if (res.data.success) {
          setShowModel(false);
          setbuttonChange(false);
          toast.success("Category updated successfully!");
          fetchCategory();
        } else {
          toast.error(res.data.message)
          console.log(res.data.message)
        }

        setFormData(item)
        console.log("formdata is update", formData)
      } catch (error) {
        // toast.warning("something went wrong")
        console.log("erroris", error);
      }
    }

  };

  //data fetch----------
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


      console.log("res===>", res);
      console.log("succes", res.data.success)
      if (res.data.success) {
        setCategory(res.data.data);
        // console.log("response---->",res.data.data);
      } else {
        setCategory([]);
      }
    } catch (error) {
      console.log("error is", error);
    }
  };


  //handle update-----------------
  const handleUpdate = async (item) => {
    setFormData(item)
    setbuttonChange(true)
    setShowModel(true)

  }
  //handle insert --------------
  const handleInsert = () => {
    setShowModel(true)
    console.log(formData);
    setbuttonChange(false)
    setFormData({ name: "", status: "unavailable", description: "" });
  }

  //handle delete---------------
  const handleDelete = async (item) => {

    // setFormData(item)

    console.log("delete items is", item)
    console.log("id is", item.id)
    try {
      const res = await axios.delete(`/api/category/delete/${item.id}`);

      console.log("response", res);

      if (res.data.success) {
        toast.success("Category deleted successfully!");
        fetchCategory();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      console.log("error is", error);
      toast.error("Something went wrong!");
    }
  };




  useEffect(() => {
    console.log("category=-=>", category)
    fetchCategory();
  }, []);

  return (
    <>
      {/* <h1
        className="text-info fst-normal text-center"
        style={{ marginTop: "100px" }}
      >
        This is category page
      </h1> */}
      <div className="d-flex justify-content-end me-5" style={{ marginTop: "100px" }}>

        <button className="btn btn-info m-3" onClick={handleInsert}>Insert</button>
      </div>

      {/* model----------------- */}

      {showModel ? (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Category</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModel(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}

                      />
                      <div ref={nameError}></div>
                    </div>


                    <div className="mb-3">
                      <label className="form-label">Status</label>

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
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                      <div ref={descriptionError}></div>
                    </div>
                    <button type="submit" className="btn btn-success" >
                      {buttonChange ? "update" : "Save"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1></h1>
        </>
      )}
      <table className="table table-hover border shadow rounded container">
        <thead>
          <tr>
            <th scope="col">s.no</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Discription</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {category.length > 0 ? (
            category.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td>{item.description}</td>
                <td>
                  <i className="bi bi-pencil-square text-warning" onClick={() => handleUpdate(item)}></i>
                  <i className="bi bi-trash-fill text-danger pe-2 ps-2" onClick={() => handleDelete(item)}></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
