// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Use FormData or similar to send the file to your Django API

      // Assuming your Django API is running on http://localhost:8000/api/upload/
      const apiUrl = 'http://localhost:8000/api_dank/upload/'; // Adjust as necessary

      const formData = new FormData();
      formData.append('file', req.body.file);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        res.status(200).json(data); // Return the response from Django (file URL)
      } else {
        res.status(response.status).json({ error: 'Failed to upload file' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error while uploading file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
