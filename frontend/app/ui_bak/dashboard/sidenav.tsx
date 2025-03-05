import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function SideNav() {
  
  return (
<div className="flex h-full flex-col px-3 py-4">
  <div className="mb-2 flex h-20 items-center justify-between rounded-md bg-green-700 p-4">
    <div className="flex flex-row items-center leading-none text-white min-w-[150px] md:min-w-[184px]">
      <GlobeAltIcon className="h-6 md:h-8 w-6 md:w-8 rotate-[15deg]" />
      <Link
        className={`${lusitana.className} text-xl md:text-3xl text-white pl-2`}
        href="/dashboard/"
      >
        Tae-Min Kim
      </Link>
    </div>
    <div className="flex">
      <NavLinks />
    </div>
  </div>
</div>

  );
}
