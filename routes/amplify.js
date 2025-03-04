const express = require("express");
const multer = require("multer");
const { s3, PutObjectCommand } = require("../config/s3Client");
const Image = require("../modules/Image");  // Import Image model

const router = express.Router();

// Use Memory Storage Instead of Disk
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
        }
    }
});

// Upload Image to S3
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        console.log("[DEBUG] Upload route hit.");

        if (!req.file) {
            return res.status(400).json({ success: false, msg: "No file uploaded" });
        }

        const username = req.body.username;  // Get username from request body
        if (!username) {
            return res.status(400).json({ success: false, msg: "Username is required" });
        }

        const fullname = req.body.fullname;  // Get fullname from request body
        if (!fullname) {
            return res.status(400).json({ success: false, msg: "Fullname is required" });
        }

        const filename = req.file.originalname.replace(/\s+/g, "_"); // Replace spaces

        const key = `uploads/${username}_${fullname.replace(/\s+/g, "_")}_${filename}`;
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            Metadata: { fullname: fullname },
        };

        await s3.send(new PutObjectCommand(params));

        // Save the image key in MongoDB
        const newImage = new Image({ username, key });
        await newImage.save();

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        res.status(200).json({ success: true, fileUrl, key });

    } catch (err) {
        console.error("[ERROR] Upload Failed:", err);
        res.status(500).json({ success: false, msg: "Server Error", error: err.stack });
    }
});

module.exports = router;
