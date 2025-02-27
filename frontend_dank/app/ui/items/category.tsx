import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ItemCategory({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-purple-100 text-white': status === 'Dining',
          'bg-red-500 text-white': status === 'Food',
          'bg-blue-500 text-white': status === 'Media',
          'bg-green-500 text-white': status === 'Travel',
        },
      )}
    >
      {status === 'Dining' ? (
        <>
          Dining
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'Food' ? (
        <>
          Food
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
        {status === 'Media' ? (
        <>
          Media
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'Travel' ? (
        <>
          Travel
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
