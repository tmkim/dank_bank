'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold">Oops! Something went wrong</h2>
        <p className="mt-2">{error.message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Close
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
