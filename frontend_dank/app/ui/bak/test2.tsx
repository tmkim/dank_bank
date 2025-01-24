// pages/items.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ItemTable from './item-table';

const ItemsPage: React.FC = () => {
  const router = useRouter();
  const { query, page = '1', limit = '10' } = router.query;  // Get URL params (query, page, limit)
  const [searchQuery, setSearchQuery] = useState<string>(query ? query as string : '');
  const [currentPage, setCurrentPage] = useState<number>(parseInt(page as string, 10));
  const [pageLimit, setPageLimit] = useState<number>(parseInt(limit as string, 10));

  useEffect(() => {
    // Whenever the page or query changes in the URL, we update the state
    setCurrentPage(parseInt(page as string, 10));
    setSearchQuery(query ? query as string : '');
    setPageLimit(parseInt(limit as string, 10));
  }, [page, query, limit]);

  // Function to update URL query parameters
  const updateQueryParams = (newQuery: string, newPage: number, newLimit: number) => {
    router.push({
      pathname: '/items',
      query: { query: newQuery, page: newPage, limit: newLimit },
    });
  };

  return (
    <div>
      <h1>Items</h1>
      <input
        type="text"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={() => updateQueryParams(searchQuery, 1, pageLimit)}  // Reset to page 1 on query change
      />
      <ItemTable
        query={searchQuery}
        page={currentPage}
        limit={pageLimit}
        onPageChange={(newPage) => updateQueryParams(searchQuery, newPage, pageLimit)}  // Handle page change
        onLimitChange={(newLimit) => updateQueryParams(searchQuery, 1, newLimit)}  // Handle limit change (reset to page 1)
      />
    </div>
  );
};

export default ItemsPage;
