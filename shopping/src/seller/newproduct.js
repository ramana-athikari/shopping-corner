import { useState } from "react";

const NewProduct = () => {
    let [productInfo, updateInfo] = useState({});
    let [nameError, setNameError] = useState("");
    let [priceError, setPriceError] = useState("");
    let [photoError, setPhotoError] = useState("");
    let [detailsError, setDetailsError] = useState("");

    const pickValue = (obj) => {
        productInfo[obj.target.name] = obj.target.value;
        updateInfo(productInfo);
    }

    const save = (obj) => {
        obj.preventDefault(); // it protect from page refresh
        let formStatus = true;
        if (!productInfo.pname || productInfo.pname == "") {
            setNameError("Enter Product Name !");
            formStatus = false;
        } else {
            setNameError("");
        }

        // price validation

        if (!productInfo.pprice || productInfo.pprice == "" || isNaN(productInfo.pprice)) {
            setPriceError("Enter Valid Price !");
            formStatus = false;
        } else {
            setPriceError("");
        }

        // url validation

        if (!productInfo.photo || productInfo.photo == "") {
            setPhotoError("Enter Photo URL !");
            formStatus = false;
        } else {
            setPhotoError("");
        }

        // product details validation

        if (!productInfo.pdetails || productInfo.pdetails == "") {
            setDetailsError("Enter Product Details !");
            formStatus = false;
        } else {
            setDetailsError("");
        }

        if (formStatus == true) {
            let url = "http://localhost:1234/productapi";
            let postdata = {
                headers: { "content-type": "application/json" },
                method: "post",
                body: JSON.stringify(productInfo)
            }

            fetch(url, postdata)
                .then(res => res.json())
                .then(info => {
                    updateInfo({});
                    alert(productInfo.pname + " Saved Successfully !");
                    obj.target.reset(); // it will clear the form
                })
        }
    }

    return (
        <div className="container mt-4">
            <form onSubmit={save}>
                <div className="row">
                    <div className="col-lg-12 text-center mb-3">
                        <h3 className="text-info"> Enter Product Details </h3>
                        <small className="text-danger"> The * Marked fields are mandatory </small>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <p> Product Name <small className="text-danger fs-5"> * </small> </p>
                        <input type="text" className="form-control" name="pname" onChange={pickValue} />
                        <small className="text-danger"> {nameError} </small>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <p> Product Price <small className="text-danger fs-5"> * </small> </p>
                        <input type="number" className="form-control" name="pprice" onChange={pickValue} />
                        <small className="text-danger"> {priceError} </small>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <p> Product Photo URL <small className="text-danger fs-5"> * </small> </p>
                        <input type="text" className="form-control" name="photo" onChange={pickValue} />
                        <small className="text-danger"> {photoError} </small>
                    </div>
                    <div className="col-lg-12 mb-4">
                        <p> Product Discription <small className="text-danger fs-5"> * </small> </p>
                        <textarea className="form-control" name="pdetails" onChange={pickValue}>  </textarea>
                        <small className="text-danger"> {detailsError} </small>
                    </div>
                    <div className="col-lg-12 text-center">
                        <button className="btn btn-success m-2" type="submit"> Save Product </button>
                        <button className="btn btn-warning m-2" type="reset"> Clear All </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NewProduct;