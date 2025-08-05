import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const EditUserProfile = () => {
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        mobile: ""
    });

    const userId = localStorage.getItem("userId"); // assuming it's stored after login

    // Fetch current profile info
    useEffect(() => {
        if (!userId) {
            toast.error("User not logged in");
            return;
        }

        fetch(`http://localhost:1234/customerapi/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    fullname: data.fullname ?? "",
                    email: data.email ?? "",
                    mobile: data.mobile ?? ""
                });
            })
            .catch(() => {
                toast.error("Failed to load profile data");
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullname || !form.email || !form.mobile) {
            toast.error("All fields are required");
            return;
        }

        const res = await fetch(`http://localhost:1234/customerapi/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            toast.success("Profile updated successfully", { autoClose: 1500 });
            // ✅ Update localStorage with new name
            localStorage.setItem("userName", form.fullname);
        } else {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="container mt-4 col-lg-4">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <h4 className="text-center">Edit Profile</h4>
                        <div className="mb-2">
                            <label>Name</label>
                            <input
                                type="text"
                                name="fullname"
                                className="form-control"
                                value={form.fullname}
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
                            <button className="btn btn-primary" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditUserProfile;
