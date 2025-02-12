'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileData, setFileData] = useState<{ description: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Initialize description fields for new files (if you still want descriptions)
      const newFileData = selectedFiles.map(() => ({ description: '' }));

      setFiles(selectedFiles);
      setFileData(newFileData);
    }
  };

  const handleInputChange = (index: number, field: 'description', value: string) => {
    const updatedFileData = [...fileData];
    updatedFileData[index][field] = value;
    setFileData(updatedFileData);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
      formData.append(`description_${index}`, fileData[index].description);
    });

    try {
      const response = await axios.post<{ images: { url: string }[] }>(
        'http://127.0.0.1:8000/api_dank/upload/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setImageUrls(response.data.images.map((image) => image.url));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />

      {files.map((file, index) => (
        <div key={index}>
          <p>{file.name}</p>  {/* Display the file name */}
          <input
            type="text"
            placeholder="Description"
            value={fileData[index]?.description || ''}
            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleUpload}>Upload</button>

      {imageUrls.length > 0 && (
        <div>
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '200px', marginRight: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
}
