import { useState } from "react";
import { uploadFile } from "@/lib/upload";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return;
    try {
      const uploadedUrl = await uploadFile(file);
      setUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="image/*"
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {url && (
        <p>
          File uploaded: <a href={url} target="_blank">{url}</a>
        </p>
      )}
    </div>
  );
}
