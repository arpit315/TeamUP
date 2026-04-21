import mongoose, { Schema } from "mongoose";
const postSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "Post content is required"],
            trim: true,
            maxlength: [2000, "Post cannot exceed 2000 characters"],
        },
        images: {
            type: [String],
            default: [],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
    },
    {
        timestamps: true, 
    }
);
export const Post = mongoose.model("Post", postSchema);
