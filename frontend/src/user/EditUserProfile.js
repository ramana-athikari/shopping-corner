import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;

const EditUserProfile = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const userId = localStorage.getItem("userId"); // assuming it's stored after login

    // Fetch current profile info
    useEffect(() => {
        if (!userId) {
            toast.error("User not logged in");
            return;
        }

        fetch(`${API_BASE}/api/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    fullName: data.fullName ?? "",
                    email: data.email ?? "",
                    mobile: data.mobile ?? ""
                });
            })
            .catch(() => {
                toast.error("Failed to load profile data");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.fullName || !form.email || !form.mobile) {
            toast.error("All fields are required");
            return;
        }
        // Validation passed — now start loading
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/user/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success("Profile updated successfully", { autoClose: 1500 });
                // ✅ Update localStorage with new name
                localStorage.setItem("userName", form.fullName);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-4 col-lg-3 col-md-3">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <h4 className="text-center">Edit Profile</h4>
                        <div className="mb-2">
                            <label>Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label>Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                className="form-control"
                                value={form.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditUserProfile;
