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
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        All Items
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
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
                <div className="flex items-center">
                  {/* <Image
                    src={item.image_url}
                    alt={`${item.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  /> */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {item.category}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {item.name}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {item.rating}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}