import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },

        image:{
            type: String,
            required: true
        },

        authorname:{
            type: String,
            required: true
        },

        description:{
            type: String,
            required: true
        },

        price:{
            type: Number,
            required: true
        },

        stock:{
            type: Number,
            required: true
            
        },

        rating:{
            type: Number,
        },

        category:{
             type: String,
             enum: ['Fiction', 'Non-fiction', 'Comics', 'Education', 'Biography', 'Fantasy', 'Science', 'Other'],
             default: 'Other'
        },

        is_deleted:{
            type: Boolean,
            default: false
        },

        seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel", 
       }
    },{
        timestamps: true
    }
)

const bookModel = mongoose.model('bookModel',bookSchema)

export default bookModel