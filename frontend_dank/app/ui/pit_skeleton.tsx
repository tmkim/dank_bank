import React from 'react'

const PublicItemTableSkeleton: React.FC = () => (
    <table className="min-w-full table-fixed border-collapse text-gray-900">
    <thead className="sticky bg-green-300 rounded-lg text-left text-md font-bold h-[5vh]">
        <tr className="flex items-center justify-between py-4">
        <th scope="col" className="px-4 py-2 text-left pl-4 w-3/5">
            <div className="bg-gray-300 h-4 w-1/5 rounded-md"></div>
        </th>
        <th scope="col" className="px-4 py-2 text-right pr-7 w-1/5">
            <div className="bg-gray-300 h-4 w-full rounded-md"></div>
        </th>
        <th scope="col" className="px-4 py-2 text-right pr-7 w-1/5">
            <div className="bg-gray-300 h-4 w-full rounded-md"></div>
        </th>
        </tr>
    </thead>
    <tbody className="bg-white">
        {Array.from({ length: 5 }, (_, i) => (
        <tr key={i} className="flex items-center justify-between py-4 pl-4 pr-4 cursor-pointer">
            <td className="w-3/5">
            <div className="bg-gray-300 h-6 w-4/5 rounded-md mb-2"></div>
            <div className="bg-gray-300 h-4 w-3/4 rounded-md"></div>
            </td>
            <td className="w-1/5 text-right">
            <div className="bg-gray-300 h-6 w-full rounded-md"></div>
            </td>
            <td className="w-1/5 text-right flex space-x-2 justify-end">
            <div className="bg-gray-300 h-6 w-6 rounded-md"></div>
            <div className="bg-gray-300 h-6 w-6 rounded-md"></div>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
);

export default PublicItemTableSkeleton;