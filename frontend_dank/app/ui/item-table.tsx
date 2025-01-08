// components/ItemTable.tsx
import React, { useEffect, useState } from 'react';
import { Item } from '@/app/lib/definitions';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';

type ItemTableProps = {
  query: string;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onRowClick: (item: Item) => void; 
};

const ItemTable: React.FC<ItemTableProps> = ({ query, page, limit, onPageChange, onLimitChange, onRowClick }) => {
  const [results, setResults] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchResults = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(
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
    <>
      <div className="mt-6 flow-root">
        {isLoading && <p>Loading...</p>}
        {!isLoading && results.length === 0 && <p>No items found.</p>}
        <div className="inline-block min-w-full align-middle">
          <div className="h-[70vh] border-separate overflow-clip rounded-xl border border-solid flex flex-col">
            <table className="min-w-full table-auto border-collapse text-gray-900">
              <thead className="sticky bg-green-300 rounded-lg text-left text-md font-bold h-[5vh]">
                <tr className='flex items-center justify-between py-4'>
                  <th scope="col" className="px-4 py-2 text-left pl-4 w-4/5">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-2 text-right pr-7 w-4/5">
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
                      {
                        'border-t': i !== 0,
                      },
                    )}
                    onClick={() => onRowClick(item)}
                  >
                    <td>
                        <p className="truncate text-sm font-semibold md:text-base">
                          {item.name}
                        </p>
                        <p className="hidden text-sm text-gray-500 sm:block">
                          {item.category}
                        </p>
                    </td>
                    <td
                      className={`${lusitana.className} truncate text-xl font-medium`}
                    >
                      {item.rating} / 100
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
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
    </>
  );
};

export default ItemTable;
