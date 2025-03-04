const express = require("express");
const { s3, DeleteObjectCommand } = require("../config/s3Client");
const Image = require("../modules/Image");  // Import Image model

const router = express.Router();

// Delete Image from S3
router.delete("/delete-image", async (req, res) => {
    try {
        const { imageKey, username } = req.body;

        if (!imageKey || !username) {
            return res.status(400).json({ success: false, message: "Image key and Username are required" });
        }

        // Check if the image belongs to the user
        const image = await Image.findOne({ key: imageKey, username });
        if (!image) {
            return res.status(403).json({ success: false, message: "Unauthorized. You can only delete your own images." });
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: imageKey,
        };

        await s3.send(new DeleteObjectCommand(params));

        // Remove from MongoDB after successful deletion
        await Image.deleteOne({ key: imageKey });

        res.status(200).json({ success: true, message: "Image deleted successfully" });

    } catch (error) {
        console.error("[ERROR] S3 Deletion Failed:", error);
        res.status(500).json({ success: false, message: "Error deleting image" });
    }
});

module.exports = router;
