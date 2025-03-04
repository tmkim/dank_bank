// components/ItemTable.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
  categories: {[key: string]: boolean};
  onRowClick: (item: Item) => void;
  setTotalItems: (count: number) => void;
};

const ItemTable: React.FC<ItemTableProps> = ({ query, page, limit, categories, onRowClick, setTotalItems }) => {

  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);

  // ------------ populate list with results -------------

  const [results, setResults] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // ----------------------
  const selectedCategories = Object.keys(categories).filter(category => categories[category]);

  useEffect(() => {
    const fetchItems = async () => {
      // setLoading(true)
      try {
        const categoryParams = selectedCategories.length > 0 ? '&category=' + selectedCategories.join('&category=') : '';
        const response = await fetch(
          `http://localhost:8000/api_dank/items/?page=${page}&query=${query}&limit=${limit}${categoryParams}`
        );
        // console.log(`http://localhost:8000/api_dank/items/?page=${page}&query=${query}&limit=${limit}${categoryParams}`)
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.results)
        console.log(page)
        setResults(data.results); // Populate items with fetched data
        setTotalPages(Math.ceil(data.count / limit));
        setTotalItems(data.count)
      } catch (err) {
        // console.error('Failed to fetch items:', err);
        setError('Failed to load items.');
      } finally {
        // setLoading(false)
      }
    };

    fetchItems(); // Fetch data on component mount
  }, [page, query, limit, categories]); // Dependencies call useEffect() when changed

  // ------------- Delete Item + Modal ---------------

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  const confirmDelete = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true); // Show the delete confirmation modal
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api_dank/items/${itemToDelete.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        setResults((prevResults) => prevResults.filter((item) => item.id !== itemToDelete.id));
        setIsDeleteModalOpen(false); // Close the modal after deleting
  
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };
  

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleUpdate = (updatedItem: Item) => {
    setResults((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };
  type SortOrder = "asc" | "desc" | "def";
  const [sortConfig, setSortConfig] = useState<{ key: keyof Item; sortOrder: SortOrder }>({key: "id", sortOrder: "def"});
  const handleSort = (key: keyof Item) => {
    let newOrder: SortOrder = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.sortOrder === "asc") {
        newOrder = "desc";
      } else if (sortConfig.sortOrder === "desc") {
          newOrder = "def"; // Reset to default sort
      }
    }

    let sortedData = [...results]; // Start fresh each time when resetting to default

    if (newOrder !== "def") {
      sortedData.sort((a, b) => {
        if (a[key] < b[key]) return newOrder === "asc" ? -1 : 1;
        if (a[key] > b[key]) return newOrder === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      sortedData.sort((a, b) => {
        if (a["id"] < b["id"]) return newOrder === "def" ? -1 : 1;
        if (a["id"] > b["id"]) return newOrder === "def" ? 1 : -1;
        return 0;
      }); // Reset to default (ID order)
    }

    setSortConfig({ key, sortOrder: newOrder });
    setResults(sortedData);
  }

  const getSortArrow = (key: keyof Item) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.sortOrder === "asc" ? "↑" : sortConfig.sortOrder === "desc" ? "↓" : "";
  };

  // if (loading) {
  //   return (<ItemTableSkeleton />)
  // }

  return (
    <>
      <div className="mt-2 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="h-[70vh] border-2 border-gray-400 border-solid rounded-xl flex flex-col overflow-hidden">
            <table className="min-w-full table-fixed border-collapse text-gray-900">
              <thead className="bg-green-300 text-left text-md font-bold h-[5vh] z-10 border-b-2 border-gray-400">
                <tr className="flex items-center justify-between py-4">
                  <th className="px-4 py-2 text-left pl-5 w-3/5">
                    <span className="hover:bg-green-500 cursor-pointer px-4 py-2 rounded-xl" onClick={() => handleSort("name")}>Name {getSortArrow("name")}</span>
                  </th>
                  <th className="px-4 py-2 text-left pl-5 w-1/5">
                  <span className="hover:bg-green-500 cursor-pointer px-4 py-2 rounded-xl" onClick={() => handleSort("name")}>Rating {getSortArrow("rating")}</span>
                  </th>
                  <th className="px-4 py-2 text-right pr-7 w-1/8"
                   style={{ visibility: token ? 'visible' : 'hidden' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white overflow-y-auto max-h-[65vh] block border-b-0 border-gray-400">
                {results.map((item, i) => (
                  <tr
                    key={item.id}
                    className={clsx(
                      'flex items-center justify-between py-4 pl-4 pr-4 hover:bg-gray-100 cursor-pointer',
                      { 'border-t border-gray-500': i !== 0, 'mb-4': i === results.length - 1}
                    )}
                    onClick={() => onRowClick(item)}
                  >
                    <td className="w-3/5 pl-5">
                      <p className="truncate text-sm font-semibold md:text-base">{item.name}</p>
                      <p className="hidden text-sm text-gray-500 sm:block">{item.category}</p>
                    </td>
                    <td className="w-1/5 text-left pl-7">
                      <p className={`${lusitana.className} truncate text-xl font-medium`}>
                        {item.rating} / 100
                      </p>
                    </td>
                    <td className="w-1/8 text-right" style={{ visibility: token ? 'visible' : 'hidden' }}>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="border border-gray-300 p-1 mr-1 rounded-md hover:border-gray-500 focus:outline focus:outline-3 focus:outline-blue-500"
                      >
                        <PencilIcon className="w-6" />
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="border border-gray-300 p-1 ml-1 rounded-md hover:border-gray-500 focus:outline focus:outline-3 focus:outline-blue-500"
                      >
                        <TrashIcon className="w-6" />
                      </button>
                    </td>
                  </tr>
                  
                ))}
                <tr aria-hidden="true">
                  <td colSpan={3} className="h-4"></td>
                </tr>
              </tbody>
            </table>

            {selectedItem && (
              <UpdateModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onUpdate={handleUpdate}
              />
            )}
            <ConfirmDeleteModal
              isOpen={isDeleteModalOpen}
              itemName={itemToDelete?.name || ''}
              onConfirm={handleDelete}
              onCancel={handleCancelDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemTable;
