import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../hooks/useContent';
import CreateContentForm from '../components/CreateContentForm';
import ContentCard from '../components/ContentCard';
import Pagination from '../components/Pagination';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { contents, pagination, loading, error, fetchContent, createContent, deleteContent } = useContent();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ category: '', status: '', search: '' });
  const [searchInput, setSearchInput] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const load = useCallback(() => {
    const params = { page, limit: 6 };
    if (filter.category) params.category = filter.category;
    if (filter.status) params.status = filter.status;
    if (filter.search) params.search = filter.search;
    fetchContent(params);
  }, [page, filter, fetchContent]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    setCreateError('');
    try {
      await createContent(data);
      setShowForm(false);
      setCreateSuccess(true);
      setPage(1);
      setTimeout(() => setCreateSuccess(false), 3000);
      load();
    } catch (err) {
      setCreateError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter((f) => ({ ...f, search: searchInput }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilter({ category: '', status: '', search: '' });
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoName}>ContentHub</span>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navItem + ' ' + styles.active}>
            <span>⬡</span> Dashboard
          </div>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.userName}>{user?.username}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={logout}>← Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Content Library</h1>
            <p className={styles.pageSubtitle}>
              {pagination ? `${pagination.totalItems} item${pagination.totalItems !== 1 ? 's' : ''}` : 'Loading…'}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setCreateError(''); }}>
            <span>+</span> New Content
          </button>
        </div>

        {createSuccess && (
          <div className={styles.successBanner}>✓ Content published successfully!</div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search content…"
              className={styles.searchInput}
            />
            <button type="submit" className="btn btn-ghost" style={{ padding: '9px 16px' }}>Search</button>
          </form>
          <select
            value={filter.category}
            onChange={(e) => { setFilter((f) => ({ ...f, category: e.target.value })); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            <option value="article">Article</option>
            <option value="tutorial">Tutorial</option>
            <option value="news">News</option>
            <option value="review">Review</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => { setFilter((f) => ({ ...f, status: e.target.value })); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          {(filter.category || filter.status || filter.search) && (
            <button className="btn btn-ghost" onClick={clearFilters} style={{ fontSize: 13 }}>✕ Clear</button>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className={styles.stateBox}>
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            <p>Loading content…</p>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>⚠</div>
            <p className={styles.stateTitle}>Failed to load</p>
            <p className={styles.stateText}>{error}</p>
            <button className="btn btn-ghost" onClick={load} style={{ marginTop: 12 }}>Try again</button>
          </div>
        ) : contents.length === 0 ? (
          <div className={styles.stateBox}>
            <div className={styles.stateIcon}>◫</div>
            <p className={styles.stateTitle}>No content yet</p>
            <p className={styles.stateText}>Create your first piece of content to get started.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginTop: 16 }}>+ Create Content</button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {contents.map((c, i) => (
                <ContentCard key={c.id} content={c} onDelete={deleteContent} delay={i * 50} />
              ))}
            </div>
            {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
          </>
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <CreateContentForm
            onSubmit={handleCreate}
            onClose={() => setShowForm(false)}
            error={createError}
          />
        </div>
      )}
    </div>
  );
}
