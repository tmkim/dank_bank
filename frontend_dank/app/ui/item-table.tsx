// components/ItemTable.tsx
import React, { useEffect, useState } from 'react';
import { Item } from '@/app/lib/definitions';

type ItemTableProps = {
  query: string;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
};

const ItemTable: React.FC<ItemTableProps> = ({ query, page, limit, onPageChange, onLimitChange }) => {
  const [results, setResults] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchResults = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        // `http://localhost:8000/api_dank/items`
        `http://localhost:8000/api_dank/items/?page=${page}&query=${query}&limit=${limit}`
      );
      const data = await response.json();

      setResults(data.results);
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page, query, limit]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && results.length === 0 && <p>No items found.</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default ItemTable;
