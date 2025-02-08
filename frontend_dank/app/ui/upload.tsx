// components/FileUpload.tsx

import { useState } from 'react';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Clear any previous errors
    }
  };

  // Handle file upload to the backend
  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api_dank/upload/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('File uploaded successfully!');
        console.log('Uploaded:', data);
        console.log('File URL:', data.file_url); // This will be the S3 URL returned from the Django API
      } else {
        setError('Failed to upload file');
        console.error('Upload failed');
      }
    } catch (err) {
      setError('Error while uploading the file');
      console.error('Error:', err);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default FileUpload;
