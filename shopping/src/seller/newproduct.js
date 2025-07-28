import { useState } from "react";
import { toast } from "react-toastify";

const NewProduct = () => {
    const [productInfo, setProductInfo] = useState({});
    const [nameError, setNameError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [photoError, setPhotoError] = useState("");
    const [detailsError, setDetailsError] = useState("");

    const pickValue = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductInfo({ ...productInfo, photo: reader.result });
            };
            reader.readAsDataURL(file); // convert to base64
        }
    };

    const save = (e) => {
        e.preventDefault();

        let formStatus = true;

        if (!productInfo.pname || productInfo.pname === "") {
            setNameError("Enter Product Name !");
            formStatus = false;
        } else {
            setNameError("");
        }

        if (!productInfo.pprice || isNaN(productInfo.pprice)) {
            setPriceError("Enter Valid Price !");
            formStatus = false;
        } else {
            setPriceError("");
        }

        if (!productInfo.photo) {
            setPhotoError("Upload Product Image !");
            formStatus = false;
        } else {
            setPhotoError("");
        }

        if (!productInfo.pdetails || productInfo.pdetails === "") {
            setDetailsError("Enter Product Details !");
            formStatus = false;
        } else {
            setDetailsError("");
        }

        if (formStatus) {
            const sellerId = localStorage.getItem("sellerId");
            const dataToSend = { ...productInfo, sellerId };

            fetch("http://localhost:1234/productapi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            })
                .then((res) => res.json())
                .then((info) => {
                    setProductInfo({});
                    toast.success(productInfo.pname + " Saved Successfully !",{autoClose:2000});
                    e.target.reset();
                })
                .catch((err) => {
                    console.error("Error:", err);
                    alert("Server error while saving product.");
                });
        }
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
                        <p>Product Name <small className="text-danger fs-5"> *</small></p>
                        <input type="text" className="form-control" name="pname" onChange={pickValue} />
                        <small className="text-danger">{nameError}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Price <small className="text-danger fs-5"> *</small></p>
                        <input type="number" className="form-control" name="pprice" onChange={pickValue} />
                        <small className="text-danger">{priceError}</small>
                    </div>

                    <div className="col-lg-4 mb-4">
                        <p>Product Image <small className="text-danger fs-5"> *</small></p>
                        <input type="file" accept="image/*" className="form-control" onChange={handleImage} />
                        <small className="text-danger">{photoError}</small>
                    </div>

                    <div className="col-lg-12 mb-4">
                        <p>Product Description <small className="text-danger fs-5"> *</small></p>
                        <textarea className="form-control" name="pdetails" onChange={pickValue}></textarea>
                        <small className="text-danger">{detailsError}</small>
                    </div>

                    <div className="col-lg-12 text-center">
                        <button className="btn btn-success m-2" type="submit">Save Product</button>
                        <button className="btn btn-warning m-2" type="reset">Clear All</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewProduct;
