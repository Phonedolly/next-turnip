import mongoose from 'mongoose';

const { Schema } = mongoose
const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    categoryURL: {
        type: String,
        required: true,
        unique: true,
    },
    index: {
        type: Number,
        required: true,
        unique: true,
    },
    thumbnailURL: {
        type: String,
        required: true,
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
})
module.exports = mongoose.models?.Category || mongoose.model('Category', categorySchema);