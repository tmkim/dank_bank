// components/ItemTable.tsx
import React, { useEffect, useState } from 'react';
import { Item } from '@/app/lib/definitions';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import { PencilIcon } from '@heroicons/react/20/solid';
import UpdateModal from '@/app/ui/items/update-modal';
import { TrashIcon } from '@heroicons/react/24/outline';
import ConfirmDeleteModal from '@/app/ui/items/delete-modal';

type ItemTableProps = {
  query: string;
  page: number;
  limit: number;
  categories: string[];
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onRowClick: (item: Item) => void;
};

const ItemTable: React.FC<ItemTableProps> = ({ query, page, limit, categories, onPageChange, onLimitChange, onRowClick }) => {

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // ------------ populate list with results -------------

  const [results, setResults] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const categoryParams = categories.length > 0 ? '&category=' + categories.join('&category=') : '';
        const response = await fetch(
          `http://localhost:8000/api_dank/items/?page=${page}&query=${query}&limit=${limit}${categoryParams}`
        );
        // console.log(`http://localhost:8000/api_dank/items/?page=${page}&query=${query}&limit=${limit}${categoryParams}`)
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data)
        setResults(data.results); // Populate items with fetched data
        setTotalPages(Math.ceil(data.count / limit));
        setLoading(false); // Stop loading
      } catch (err) {
        // console.error('Failed to fetch items:', err);
        setError('Failed to load items.');
        setLoading(false);
      }
    };

    fetchItems(); // Fetch data on component mount
  }, [page, query, limit, categories]); // Dependencies call useEffect() when changed

  return (
    <>
      <div className="mt-2 flow-root">
        {isLoading && <p>Loading...</p>}
        {!isLoading && results.length === 0 && <p>No items found.</p>}
        <div className="inline-block min-w-full align-middle">
          <div className="h-[70vh] overflow-auto rounded-xl border border-solid">
            <table className="min-w-full table-fixed border-collapse text-gray-900">
              <thead className="sticky top-0 bg-green-300 rounded-lg text-left text-md font-bold h-[5vh]">
                <tr className="flex items-center justify-between py-4">
                  <th scope="col" className="px-4 py-2 text-left pl-4 w-1/3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-2 text-right pr-7 w-1/3">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {results.map((item, i) => (
                  <tr
                    key={item.id}
                    className={clsx(
                      'flex items-center justify-between py-4 pl-4 pr-4 cursor-pointer',
                      { 'border-t': i !== 0 }
                    )}
                    onClick={() => onRowClick(item)}
                  >
                    <td className="w-1/3">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {item.name}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        {item.category}
                      </p>
                    </td>
                    <td className="w-1/3 text-right">
                      <p className={`${lusitana.className} truncate text-xl font-medium`}>
                        {item.rating} / 100
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div className="mt-4 flex justify-end">
        <button className="px-4"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-2"> Page {page} of {totalPages} </span>
        <button className="px-4"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
        <select className=""
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </>
  );
};

export default ItemTable;
