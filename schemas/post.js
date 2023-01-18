import mongoose from 'mongoose';

const { Schema } = mongoose
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: false,
        unique: false
    },
    postURL: {
        type: String,
        required: true,
        unique: true,
    },
    images: {
        type: Array,
        required: true,
        unique: false,
    },
    thumbnailURL: {
        type: String,
        required: false,
        unique: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    editedAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})
module.exports = mongoose.models?.Post || mongoose.model('Post', postSchema);