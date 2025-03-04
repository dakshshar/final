import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import nc from "next-connect";

// Initialize S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Store in .env.local
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Store in .env.local
  region: process.env.AWS_REGION, // Example: "us-east-1"
});

// Configure Multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // Example: "my-bucket"
    acl: "public-read", // Allows public access to images
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Create API handler using next-connect
const handler = nc({
  onError(error, req, res) {
    res.status(500).json({ success: false, error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  },
});

// Accept only `POST` requests with file uploads
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  return res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    fileUrl: req.file.location, // S3 file URL
  });
});

export default handler;

// Disable default Next.js body parsing (important for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};
