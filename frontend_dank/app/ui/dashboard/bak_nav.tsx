'use client'

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CakeIcon,
  BuildingOfficeIcon,
  MusicalNoteIcon,
  PaperAirplaneIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Dank Bank', href: '/dashboard/items', icon: DocumentDuplicateIcon },
  { name: 'T-Planet', href: '/dashboard/items/dining', icon: BuildingOfficeIcon },
  // { name: 'Food', href: '/dashboard/items/food', icon: CakeIcon },
  // { name: 'Music', href: '/dashboard/items/music', icon: MusicalNoteIcon },
  // { name: 'Travel', href: '/dashboard/items/travel', icon: MapIcon }, //maybe use PaperAirplaneIcon ?
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link, index) => {

      return (
        <div key={link.name} className="flex items-center">
          <Link
            href={link.href}
            className={clsx(
              'flex text-white min-w-[90px] h-[48px] grow items-center justify-center gap-x-2 rounded-md p-1 font-medium hover:text-blue-300 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'text-blue-300': pathname === link.href,
              },
            )}
          >
            <p className="block md:text-xl">{link.name}</p>
          </Link>
        </div>
      );
    })}
    </>
  );
}
