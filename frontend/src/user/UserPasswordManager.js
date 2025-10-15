import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_URL;

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
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
      const res = await fetch(`${API_BASE}/api/user/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { autoClose: 1500 });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4 col-lg-3">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <h4 className="text-center">Change Password</h4>

            {/* Current Password */}
            <div className="mb-2">
              <label>Current Password</label>
              <div className="input-group">
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  className="form-control"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  <i className={`bi ${showCurrent ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-2">
              <label>New Password</label>
              <div className="input-group">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNew(!showNew)}
                >
                  <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-2">
              <label>Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
            </div>

            <div className="text-center mt-3">
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

export default ChangePassword;
