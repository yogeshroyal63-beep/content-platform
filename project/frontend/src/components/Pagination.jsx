import styles from './Pagination.module.css';

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPreviousPage } = pagination;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const getPages = () => {
    const pages = [];
    const delta = 1;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <span className={styles.info}>
        Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong> items
      </span>

      <div className={styles.controls}>
        <button
          className={`btn btn-ghost ${styles.navBtn}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
        >
          ← Previous
        </button>

        {currentPage > 2 && (
          <>
            <button className={`${styles.pageBtn} ${styles.ghost}`} onClick={() => onPageChange(1)}>1</button>
            {currentPage > 3 && <span className={styles.dots}>…</span>}
          </>
        )}

        {getPages().map((p) => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === currentPage ? styles.active : styles.ghost}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <span className={styles.dots}>…</span>}
            <button className={`${styles.pageBtn} ${styles.ghost}`} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button
          className={`btn btn-ghost ${styles.navBtn}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
