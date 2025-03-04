"use client"; // Ensures it's a client component

import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1>Welcome to My Next.js App</h1>
      <p>This is the homepage.</p>
      <Link href="/uploadPage">
        <button style={styles.button}>Go to Upload Page</button>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
  },
  button: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "20px",
  },
};
// Compare this snippet from pages/uploadPage.js:
// "use client"; // Ensures this runs as a client component in Next.js
//
// import { useState } from "react";
//
// export default function UploadPage() {
//   const [message, setMessage] = useState("");
//
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//
//     try {
//       const response = await fetch("/api/auth/upload-image", {                                               