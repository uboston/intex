interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
  }
  
  const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
  }: PaginationProps) => {
    return (
      <>
      <div className="pagination-container">
        {/* Previous Button */}
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* First page */}
        {currentPage > 2 && (
          <>
            <button
              className="btn btn-outline-light"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {currentPage > 3 && <span className="mx-2">…</span>}
          </>
        )}

        {/* CurrentPage - 1 */}
        {currentPage > 1 && (
          <button
            className="btn btn-outline-light"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}

        {/* Current Page */}
        <button className="btn btn-primary" disabled>
          {currentPage}
        </button>

        {/* CurrentPage + 1 */}
        {currentPage < totalPages && (
          <button
            className="btn btn-outline-light"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}

        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className="mx-2">…</span>}
            <button
              className="btn btn-outline-light"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
        {/* Results per page dropdown */}
        <div className="text-center">
          <label className="me-2">Results per page:</label>
          <select
            className="form-select w-auto d-inline-block bg-dark text-light border-light"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </>
    );
  };
  
  export default Pagination;
  