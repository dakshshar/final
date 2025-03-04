const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    username: { type: String, required: true }, // User who uploaded the image
    key: { type: String, required: true, unique: true } // S3 object key
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
