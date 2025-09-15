import mongoose from "mongoose";

const sellerSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    mobile: {
        type: Number,
        required: true
    },
},
    { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);