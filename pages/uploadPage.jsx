"use client"; // Ensures this runs as a client component in Next.js

import { useState } from "react";

export default function UploadPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Image uploaded successfully: ${result.fileUrl}`);
      } else {
        setMessage(`Upload failed: ${result.msg}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="username" placeholder="Username" required />
        <input type="text" name="fullname" placeholder="Fullname" required />
        <input type="file" name="image" accept="image/jpeg, image/png" required />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
