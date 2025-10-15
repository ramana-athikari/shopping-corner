import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

const ChangeSellerPassword = () => {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    let [isLoading, setIsLoading] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    // const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sellerId = localStorage.getItem("sellerId");
        if (!sellerId) {
            toast.error("User not logged in");
            return;
        }

        // Frontend validation
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        // Validation passed — now start loading
        setIsLoading(true);

        try {
            // 1. Fetch seller by ID
            const resUser = await fetch(`${API_BASE}/api/seller/${sellerId}`);
            const seller = await resUser.json();

            if (!resUser.ok) {
                toast.error(seller.error || "Failed to fetch seller data");
                return;
            }

            // 2. Update password
            const updateRes = await fetch(`${API_BASE}/api/seller/${sellerId}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await updateRes.json();

            if (updateRes.ok) {
                toast.success("Password changed successfully!", { autoClose: 1500 });
                setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.error || "Failed to update password");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error, please try again later");
        } finally{
            setIsLoading(false);
        }
    };


    return (
        <div className="container mt-4 col-lg-3 col-md-3">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <h4 className="text-center">Change Password</h4>
                        <div className="mb-2">
                            <label>Current Password</label>
                            <div className="input-group">
                                <input
                                    placeholder="enter current password"
                                    type={showPassword ? "text" : "password"}
                                    name="currentPassword"
                                    className="form-control"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <span
                                    className="input-group-text"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                                {/* <small className="text-danger"> {msg} </small> */}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label>New Password</label>
                            <div className="input-group">
                                <input
                                    placeholder="enter new password"
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    className="form-control"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-group-text" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                                {/* <small className="text-danger"> {msg} </small> */}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label>Confirm New Password</label>
                            <div className="input-group">
                                <input
                                    placeholder="enter new password"
                                    type={showNewPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="form-control"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-group-text" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </span>
                                {/* <small className="text-danger"> {msg} </small> */}
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Change Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChangeSellerPassword;