import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ChangePassword = () => {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId"); // assuming saved at login
        if (!userId) {
            toast.error("User not logged in");
            return;
        }

        // 1. Fetch user by ID
        const response = await fetch(`http://localhost:1234/customerapi/${userId}`);
        const user = await response.json();

        // 2. Check current password
        if (user.password !== form.currentPassword) {
            toast.error("Current password is incorrect");
            setMsg("Current password is incorrect");
            return;
        }

        // 3. Check new password match
        if (form.newPassword !== form.confirmPassword) {
            toast.error("New passwords do not match");
            setMsg("New passwords do not match");
            return;
        }

        // 4. Update password
        const updateRes = await fetch(`http://localhost:1234/customerapi/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: form.newPassword })
        });

        if (updateRes.ok) {
            toast.success("Password changed successfully!", {autoClose:1500});
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            toast.error("Failed to update password");
        }
    };

    return (
        <div className="container mt-4 col-lg-3">
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
                            <button className="btn btn-primary" type="submit">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;