interface PaginationProps {
  page: number;
  limit: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, limit, totalItems, onPageChange, onLimitChange }) => {
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="mt-4 flex items-center justify-end">
      {/* Page navigation buttons */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {/* Items per page dropdown */}
      {/* <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          className="pr-8 py-2 rounded-lg border border-gray-300 appearance-none bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div> */}
    </div>
  );
};

export default Pagination;
