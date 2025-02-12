// upload.tsx
'use client';
import { useState } from 'react';

interface UploadProps {
  onFilesSelected: (files: File[]) => void;
}

export default function ImageUploader({ onFilesSelected }: UploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      onFilesSelected(filesArray); // Pass files up to the parent component
    }
  };

  return (
    <div>
      <label htmlFor="images" className="block text-base font-medium text-gray-700 mb-2">
          Image Upload Here:
      </label>
      <div>
        <input type="file" multiple onChange={handleFileChange} 
          className="block w-full rounded-md border border-gray-400 px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
      </div>
    </div>
  );
}
