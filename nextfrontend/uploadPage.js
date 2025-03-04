import { useState } from 'react';

export default function UploadPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const response = await fetch('/api/auth/upload-image', {
        method: 'POST',
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
    <div style={styles.body}>
      <div style={styles.container}>
        <h2>Upload Image</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Fullname"
            required
            style={styles.input}
          />
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg, image/png"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Upload
          </button>
        </form>
        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  container: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  input: {
    display: 'block',
    marginBottom: '10px',
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  message: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#333',
  },
};