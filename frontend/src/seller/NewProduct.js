
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const NewProduct = () => {
    const navigate = useNavigate();

    const [productInfo, setProductInfo] = useState({});
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickValue = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setProductInfo({ ...productInfo, image: file });
        setPreview(URL.createObjectURL(file)); // create preview URL
    };

    const validateForm = () => {
        let newErrors = {};
        if (!productInfo.name) newErrors.name = "Enter Product Name!";
        if (!productInfo.price || isNaN(productInfo.price)) newErrors.price = "Enter Valid Price!";
        if (!productInfo.stock || isNaN(productInfo.stock)) newErrors.stock = "Enter Valid Stock!";
        if (!productInfo.image) newErrors.image = "Upload Product Image!";
        if (!productInfo.description) newErrors.description = "Enter Product Details!";
        if (!productInfo.category) newErrors.category = "Enter Product Category!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const save = (e) => {
        e.preventDefault();

        const sellerId = localStorage.getItem("sellerId");

        // ✅ Check login before continuing
        if (!sellerId) {
            toast.error("Please login first!", { autoClose: 1500 });

            // redirect after short delay so user sees the toast
            setTimeout(() => {
                navigate("/seller-login");
            }, 1500);

            return;
        }

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("name", productInfo.name);
        formData.append("price", productInfo.price);
        formData.append("stock", productInfo.stock);
        formData.append("description", productInfo.description);
        formData.append("category", productInfo.category);
        formData.append("sellerId", sellerId);

        if (productInfo.image) {
            formData.append("image", productInfo.image); // actual file
        }

        setLoading(true);

        fetch(`${API_BASE}/api/product`, {
            method: "POST",
            body: formData, // no headers for FormData
        })
            .then(res => res.json())
            .then(info => {
                toast.success("Product Saved!", { autoClose: 1500 });
                e.target.reset();
                setPreview(null); // clear preview
            })
            .catch(err => console.error(err));
        setLoading(false);
    };


    return (
        <div className="container mt-4 container-body-seller">
            <form onSubmit={save}>
                <div className="row">
                    <div className="col-lg-12 text-center mb-3">
                        <h3 className="text-info">Enter Product Details</h3>
                        <small className="text-danger">The * Marked fields are mandatory</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Name <span className="text-danger">*</span></p>
                        <input type="text" className="form-control" name="name" onChange={pickValue} />
                        <small className="text-danger">{errors.name}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Price <span className="text-danger">*</span></p>
                        <input type="number" className="form-control" name="price" onChange={pickValue} />
                        <small className="text-danger">{errors.price}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Category <span className="text-danger">*</span></p>
                        <input type="text" className="form-control" name="category" onChange={pickValue} />
                        <small className="text-danger">{errors.category}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Image <span className="text-danger">*</span></p>
                        <input type="file" accept="image/*" className="form-control" onChange={handleImage} />
                        <small className="text-danger">{errors.image}</small>

                        {/* Show preview before saving */}
                        {preview && (
                            <div style={{ marginTop: "10px" }}>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: "100px", borderRadius: "10px" }}
                                />
                            </div>
                        )}
                    </div>


                    <div className="col-lg-4 mb-4">
                        <p>Product Stock <span className="text-danger">*</span></p>
                        <input type="number" className="form-control" name="stock" onChange={pickValue} />
                        <small className="text-danger">{errors.stock}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Description <span className="text-danger">*</span></p>
                        <textarea className="form-control" name="description" onChange={pickValue}></textarea>
                        <small className="text-danger">{errors.description}</small>
                    </div>

                    <div className="col-lg-12 text-center">
                        <button
                            className="btn btn-success m-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            )}
                            {loading ? "Saving..." : "Save Product"}
                        </button>

                        <button
                            className="btn btn-warning m-2"
                            type="reset"
                            disabled={loading}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewProduct;
