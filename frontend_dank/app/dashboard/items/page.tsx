'use client';  // Explicitly mark the file as client-side

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemTable from '@/app/ui/item-table';
import ItemDetails from '@/app/ui/items/details';
import { Item } from '@/app/lib/definitions';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateModal from '@/app/ui/items/create-modal';
import Pagination from '@/app/ui/pagination';
import DeleteItemsButton from '@/app/ui/items/multi-delete';
// import ItemTable from '../components/ItemTable';

type FilterChecks = {
  Dining: boolean;
  Food: boolean;
  Music: boolean;
  Travel: boolean;
}

const ItemsPage: React.FC = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const searchParams = useSearchParams();

  const queryParam = searchParams.get('query') || '';
  const pageParam = searchParams.get('page') || '1';
  const limitParam = searchParams.get('limit') || '10';

  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageParam, 10));
  const [pageLimit, setPageLimit] = useState<number>(parseInt(limitParam, 10));
  const [totalItems, setTotalItems] = useState<number>(0);

  const [createModal, setCreateModal] = useState<boolean>(false);

  const [filterCheck, setFilterCheck] = useState<FilterChecks>({
    Dining: false,
    Food: false,
    Music: false,
    Travel: false,
  });

  const handleFilterCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilterCheck((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPageLimit(newLimit);
    setCurrentPage(1); // Optional: reset to first page when limit changes
  };

  const updateQueryParams = (newQuery: string, newPage: number, newLimit: number) => {
    const uniqueCategories = Array.from(new Set(selectedCategories));

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('query', newQuery);
    newUrl.searchParams.set('page', newPage.toString());
    newUrl.searchParams.set('limit', newLimit.toString());

    // Add selected categories with the first letter capitalized
    uniqueCategories.forEach((category) => {
      newUrl.searchParams.append('category', category);
    });

    window.history.pushState({}, '', newUrl.toString());
  };

  useEffect(() => {
    setCurrentPage(parseInt(pageParam, 10));
    setSearchQuery(queryParam);
    setPageLimit(parseInt(limitParam, 10));
  }, [pageParam, queryParam, limitParam]);

  const selectedCategories = Object.keys(filterCheck).filter((key) => filterCheck[key as keyof FilterChecks]);

  // useRef to track the previous query parameters
  const prevQueryParams = useRef<{
    query: string;
    page: number;
    limit: number;
    categories: string[]; // Change category to categories
  } | null>({
    query: searchQuery,
    page: currentPage, // store as number
    limit: pageLimit,   // store as number
    categories: [], // Set the categories array initially as empty
  });

  useEffect(() => {
    const currentQueryParams = new URLSearchParams(window.location.search);
    const currentCategoryParams = currentQueryParams.getAll('category');

    const newQueryParams = {
      query: searchQuery,
      page: currentPage.toString(),
      limit: pageLimit.toString(),
      categories: selectedCategories.map((category) => category.charAt(0).toUpperCase() + category.slice(1)), // Ensure categories key is used here
    };

    // Check if the parameters have changed compared to the previous state
    const hasCategoryChanged = JSON.stringify(currentCategoryParams.sort()) !== JSON.stringify(newQueryParams.categories.sort());
    const hasQueryChanged = currentQueryParams.get('query') !== newQueryParams.query;
    const hasPageChanged = currentQueryParams.get('page') !== newQueryParams.page;
    const hasLimitChanged = currentQueryParams.get('limit') !== newQueryParams.limit;

    // Only update if there is a change in any query parameter
    if (hasCategoryChanged || hasQueryChanged || hasPageChanged || hasLimitChanged) {
      updateQueryParams(newQueryParams.query, parseInt(newQueryParams.page, 10), parseInt(newQueryParams.limit, 10));
      prevQueryParams.current = { // Update previous params correctly
        query: newQueryParams.query,
        page: parseInt(newQueryParams.page, 10), // Convert to number
        limit: parseInt(newQueryParams.limit, 10), // Convert to number
        categories: newQueryParams.categories,
      };
    }
  }, [searchQuery, currentPage, pageLimit]);

  const [item, setItemDetail] = useState<Item | null>(null);
  const handleRowClick = (rowData: Item) => {
    setItemDetail(rowData);
    console.log(rowData);
  };

  return (
    <main className="w-full mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        {/* <!-- Item Table --> */}
        <div className="flex-grow flex-shrink-0 lg:basis-1/2">
          <div className="flex space-x-2 w-full">
            <input
              className="flex-grow w-3/4 p-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Search items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => updateQueryParams(searchQuery, 1, pageLimit)}
            />
            <button
              className="flex items-center justify-center min-w-[160px] p-2 text-lg font-semibold bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() => setCreateModal(true)}
            >
              <PlusIcon className="w-5 mr-3 [stroke-width:3]" /> New Entry
            </button>
            {!token && <DeleteItemsButton/>}
          </div>
          <div className="flex justify-between space-x-2 mt-2">
            <div className="flex gap-2">
              {['Dining', 'Food', 'Music', 'Travel'].map((option, index) => {
                const key = option;
                return (
                  <label
                    key={index}
                    tabIndex={0}
                    className={`cursor-pointer select-none p-2 border rounded-md transition-colors peer-checked:bg-blue-500 peer-checked:text-white ${filterCheck[key as keyof FilterChecks]
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={key}
                      className="hidden peer"
                      checked={filterCheck[key as keyof FilterChecks]}
                      onChange={handleFilterCheckboxChange}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select
                className="ml-2 pr-8 py-2 rounded-lg border border-gray-300 appearance-none bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                value={pageLimit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <ItemTable
            query={searchQuery}
            page={currentPage}
            limit={pageLimit}
            categories={selectedCategories}
            // onPageChange={(newPage) => updateQueryParams(searchQuery, newPage, pageLimit)}
            // onLimitChange={(newLimit) => updateQueryParams(searchQuery, 1, newLimit)}
            onRowClick={handleRowClick}
            setTotalItems={setTotalItems}
          />
          
          {/* Page navigation buttons */}
          <Pagination
            page={currentPage}
            limit={pageLimit}
            totalItems={totalItems} // Fetch or pass this from your API
            onPageChange={(newPage) => updateQueryParams(searchQuery, newPage, pageLimit)}
            onLimitChange={(newLimit) => updateQueryParams(searchQuery, 1, newLimit)}
          />
        </div>

        {/* <!-- Item Details --> */}
        <div className="flex-grow flex-shrink-0 mt-4 pr-4 lg:basis-1/2 lg:mt-0">
          <ItemDetails item={item} />
        </div>
      </div>



      {createModal && (
        <CreateModal onClose={() => setCreateModal(false)} />
      )}
    </main>


  );
};

export default ItemsPage;
