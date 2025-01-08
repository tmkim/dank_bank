// import ListItems from '@/app/ui/dashboard/list-items';
// import { lusitana } from '@/app/ui/fonts';
// import ItemDetails from '@/app/ui/items/details';
// import Search from '@/app/ui/search';

// export default async function Page() {
// const items_res = await fetch("http://localhost:8000/api_dank/items");
// const data = await items_res.json()
//   // console.log(data.results) //json array where each object is an item returned from the api

//   return (
// <main>
//   <div className="flex flex-col md:flex-row space-x-4">
//     <div className="md:w-1/2 grid-cols-1 md:grid-cols-4 lg:grid-cols-8">
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Items
//       </h1>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search Dank Bank..." />
//         {/* <CreateItem /> -------- need to make button */}
//       </div>
//             {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
//     <Table query={query} currentPage={currentPage} />
//   </Suspense> */}
//       <ListItems items={data.results} />
//     </div>
//     <div className="md:w-1/2 grid-cols-1 gap-6">
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
//         Details
//       </h1>
//       <ItemDetails item = {data.results[0]}/>
//     </div>
//   </div>
// </main>
//   );
// }




'use client';  // Explicitly mark the file as client-side

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ItemTable from '@/app/ui/item-table';
import { lusitana } from '@/app/ui/fonts';
import ItemDetails from '@/app/ui/items/details';
import { Item } from '@/app/lib/definitions';
// import ItemTable from '../components/ItemTable';

const ItemsPage: React.FC = () => {
  const searchParams = useSearchParams();

  const queryParam = searchParams.get('query') || '';
  const pageParam = searchParams.get('page') || '1';
  const limitParam = searchParams.get('limit') || '10';

  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageParam, 10));
  const [pageLimit, setPageLimit] = useState<number>(parseInt(limitParam, 10));

  const updateQueryParams = (newQuery: string, newPage: number, newLimit: number) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('query', newQuery);
    newUrl.searchParams.set('page', newPage.toString());
    newUrl.searchParams.set('limit', newLimit.toString());
    window.history.pushState({}, '', newUrl.toString());
  };

  useEffect(() => {
    setCurrentPage(parseInt(pageParam, 10));
    setSearchQuery(queryParam);
    setPageLimit(parseInt(limitParam, 10));
  }, [pageParam, queryParam, limitParam]);

  const [item, setItemDetail] = useState<Item | null>(null);
  const handleRowClick = (rowData: Item) => {
    setItemDetail(rowData)
    console.log(rowData)
  }

  return (
    <main>
      <h1 className="text-xl py-4">
        The Dank Bank
      </h1>
      <div className="flex flex-col md:flex-row space-x-4">
        <div className="md:w-1/2 grid-cols-1 md:grid-cols-4 lg:grid-cols-8">
          <div className="flex flex-col w-10/12">
            <input
              type="text"
              placeholder="Search items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => updateQueryParams(searchQuery, 1, pageLimit)}  // Reset to page 1 on query change
            />
          </div>
          <ItemTable
            query={searchQuery}
            page={currentPage}
            limit={pageLimit}
            onPageChange={(newPage) => updateQueryParams(searchQuery, newPage, pageLimit)}
            onLimitChange={(newLimit) => updateQueryParams(searchQuery, 1, newLimit)}
            onRowClick={handleRowClick}
          />
        </div>
        <div className="md:w-1/2 grid-cols-1 gap-6">
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Details
          </h1>
          <ItemDetails item={item} />
        </div>
      </div>
    </main>
  );
};

export default ItemsPage;
