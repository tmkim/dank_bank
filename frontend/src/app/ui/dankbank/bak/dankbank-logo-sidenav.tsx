import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/dankbank/fonts';

export default function DankBankLogoSidenav() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-8 w-8 rotate-[15deg]" />
      <p className="text-[26px]">Dank Bank</p>
    </div>
  );
}
