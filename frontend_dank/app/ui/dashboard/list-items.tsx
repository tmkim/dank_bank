import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { Item } from '@/app/lib/definitions';
export default async function ListItems({
  items,
}: {
  items: any[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="h-[80vh] border-separate overflow-clip rounded-xl border border-solid flex flex-col">
          <table className="min-w-full table-auto border-collapse text-gray-900">
            <thead className="sticky bg-green-300 rounded-lg text-left text-md font-bold h-[5vh]">
              <tr>
                <th scope="col" className="px-4 py-2 text-left pl-16 w-4/5">
                  Name
                </th>
                <th scope="col" className="px-4 py-2 text-right pr-16 w-4/5">
                  Rating
                </th>
              </tr>
            </thead>
          </table>
          <div className="overflow-auto flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
            <div className="bg-white px-6">
              {items.map((item, i) => {
                return (
                  <div
                    key={item.id}
                    className={clsx(
                      'flex flex-row items-center justify-between py-4',
                      {
                        'border-t': i !== 0,
                      },
                    )}
                  >
                    <div className="px-4 py-2 text-left w-4/5">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {item.name}
                        </p>
                        <p className="hidden text-gray-500 sm:block">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`${lusitana.className} truncate text-xl font-medium`}
                    >
                      {item.rating} / 100
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div >
  );
}

  // return (
  //   <div className="flex w-full flex-col md:col-span-4">
  //     <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
  //       Dank Items
  //     </h2>
      // <div className="overflow-auto flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      //   <div className="bg-white px-6">
      //     {items.map((item, i) => {
      //       return (
      //         <div
      //           key={item.id}
      //           className={clsx(
      //             'flex flex-row items-center justify-between py-4',
      //             {
      //               'border-t': i !== 0,
      //             },
      //           )}
      //         >
      //           <div className="flex items-center">
      //             {/* <Image
      //               src={item.image_url}
      //               alt={`${item.name}'s profile picture`}
      //               className="mr-4 rounded-full"
      //               width={32}
      //               height={32}
      //             /> */}
      //             <div className="min-w-0">
      //               <p className="truncate text-sm font-semibold md:text-base">
      //                 {item.name}
      //               </p>
      //               <p className="hidden text-sm text-gray-500 sm:block">
      //                 {item.category}
      //               </p>
      //             </div>
      //           </div>
      //           <p
      //             className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
      //           >
      //             {item.rating}
      //           </p>
      //         </div>
      //       );
      //     })}
      //   </div>
      //   <div className="flex items-center pb-2 pt-6">
      //     <ArrowPathIcon className="h-5 w-5 text-gray-500" />
      //     <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      //   </div>
      // </div>
  //   </div>

