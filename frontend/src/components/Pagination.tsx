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
      <div className="d-flex flex-column align-items-center mt-4 gap-3">
        {/* Pagination buttons (top row) */}
        <ul className="pagination justify-content-center m-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              &laquo; Previous
            </button>
          </li>
    
          {currentPage > 2 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => onPageChange(1)}>
                  1
                </button>
              </li>
              {currentPage > 3 && (
                <li className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              )}
            </>
          )}
    
          {currentPage > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                {currentPage - 1}
              </button>
            </li>
          )}
    
          <li className="page-item active">
            <span className="page-link">{currentPage}</span>
          </li>
    
          {currentPage < totalPages && (
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                {currentPage + 1}
              </button>
            </li>
          )}
    
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <li className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              )}
              <li className="page-item">
                <button className="page-link" onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}
    
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Next &raquo;
            </button>
          </li>
        </ul>
    
        {/* Dropdown (second row, centered) */}
        <div className="d-flex align-items-center">
          <label className="me-2 mb-0" style={{ color: '#000' }}>
            Results per page:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: '80px' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    );
    
  }
export default Pagination;