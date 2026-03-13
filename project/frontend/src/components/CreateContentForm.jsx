import { useState } from 'react';
import styles from './CreateContentForm.module.css';

const CATEGORIES = ['article', 'tutorial', 'news', 'review', 'other'];
const STATUSES = ['published', 'draft', 'archived'];

export default function CreateContentForm({ onSubmit, onClose, error }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'article',
    status: 'published',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      await onSubmit({ ...form, tags });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal + ' fade-in'}>
      <div className={styles.header}>
        <h2 className={styles.title}>New Content</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
      </div>

      <form onSubmit={submit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Title <span className={styles.req}>*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handle}
            placeholder="Give your content a compelling title…"
            required
            maxLength={200}
            className={styles.input}
          />
          <span className={styles.charCount}>{form.title.length}/200</span>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select name="category" value={form.category} onChange={handle} className={styles.select}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select name="status" value={form.status} onChange={handle} className={styles.select}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Body <span className={styles.req}>*</span></label>
          <textarea
            name="body"
            value={form.body}
            onChange={handle}
            placeholder="Write your content here…"
            required
            rows={7}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handle}
            placeholder="react, javascript, tutorial  (comma separated)"
            className={styles.input}
          />
          <span className={styles.hint}>Separate tags with commas</span>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : <span>◈</span>}
            {loading ? 'Publishing…' : 'Publish Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
