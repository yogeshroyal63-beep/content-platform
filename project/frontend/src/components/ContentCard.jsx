import { useState } from 'react';
import styles from './ContentCard.module.css';

const CATEGORY_ICONS = { article: '◎', tutorial: '◈', news: '⬡', review: '◇', other: '○' };

export default function ContentCard({ content, onDelete, delay = 0 }) {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 3000); return; }
    setDeleting(true);
    try { await onDelete(content.id); } catch { setDeleting(false); }
  };

  const date = new Date(content.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const icon = CATEGORY_ICONS[content.category] || '○';

  return (
    <div className={styles.card + ' fade-in'} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardTop}>
        <div className={styles.categoryBadge}>
          <span className={styles.catIcon}>{icon}</span>
          <span className={`badge badge-${content.category}`}>{content.category}</span>
        </div>
        <span className={`badge badge-${content.status}`}>{content.status}</span>
      </div>

      <h3 className={styles.title}>{content.title}</h3>
      <p className={styles.body}>{content.body?.slice(0, 160)}{content.body?.length > 160 ? '…' : ''}</p>

      {content.tags?.length > 0 && (
        <div className={styles.tags}>
          {content.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.meta}>
          <div className={styles.authorAvatar}>{content.author?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.authorName}>{content.author?.username}</div>
            <div className={styles.date}>{date}</div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.views}>👁 {content.views}</div>
          <button
            className={`btn btn-danger ${styles.deleteBtn}`}
            onClick={handleDelete}
            disabled={deleting}
            title={confirm ? 'Click again to confirm' : 'Delete'}
            style={{ padding: '6px 10px', fontSize: 12 }}
          >
            {deleting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> :
             confirm ? '⚠ Confirm' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
}
