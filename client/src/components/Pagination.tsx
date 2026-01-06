import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = Math.min(itemsPerPage, totalItems - startIndex);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-4 pl-4 text-sm text-gray-600  gap-2 sm:gap-0">
      <span>
        Showing {currentItems} of {totalItems} job(s)
      </span>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          ‹ Previous
        </button>

        {/* Current Page */}
        <span className="px-3 py-1 border border-gray-300 rounded-md bg-white">
          {currentPage}
        </span>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
