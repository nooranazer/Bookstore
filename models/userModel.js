import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },

        image:{
            type: String,
            required: true
        },

              
        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
        },
                
        role: {
            type: String,
            enum: ["buyer", "seller"],
            default: "buyer",
        },
    }, {
       timestamps: true
       }
);


const User = mongoose.model("userModel", userSchema);

export default User;

