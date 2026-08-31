import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import highlights from '../data/highlights.json';

// Cap how many result cards we render at once so a broad filter (or no filter)
// doesn't paint 1,500+ nodes on a phone.
const RESULT_CAP = 200;

const decodeHtml = (str = '') => {
  if (typeof document === 'undefined') return str;
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
};

// Some Title values carry HTML tags / entities; use this for plain-text
// contexts like <option> labels and keyword matching.
const plainText = (str = '') => decodeHtml(str).replace(/<[^>]*>/g, '').trim();

function FilterQuotes() {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');

  const authors = useMemo(
    () =>
      [...new Set(highlights.map((h) => h.Author).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  // Book list narrows to the selected author, when there is one.
  const titles = useMemo(() => {
    const pool = author
      ? highlights.filter((h) => h.Author === author)
      : highlights;
    return [...new Set(pool.map((h) => h.Title).filter(Boolean))].sort((a, b) =>
      plainText(a).localeCompare(plainText(b))
    );
  }, [author]);

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return highlights.filter((h) => {
      if (author && h.Author !== author) return false;
      if (title && h.Title !== title) return false;
      if (kw) {
        const hay = `${h['Highlight Text'] || ''} ${plainText(h.Title)} ${
          h.Author || ''
        }`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [author, title, keyword]);

  const hasFilters = Boolean(author || title || keyword.trim());
  const shown = results.slice(0, RESULT_CAP);

  const clearFilters = () => {
    setAuthor('');
    setTitle('');
    setKeyword('');
  };

  const fieldClass =
    'w-full rounded-lg border border-accent/40 bg-primary-one/70 text-copy-primary px-3 py-2';

  return (
    <div className="flex flex-col flex-grow w-full max-w-[720px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-copy-primary"
        >
          <ArrowBackIcon fontSize="small" /> Back
        </Link>
        <h1 className="font-sans font-bold uppercase tracking-tight text-copy-primary text-xl md:text-2xl">
          Filter Quotes
        </h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3 bg-primary-two/40 ring-1 ring-accent/10 rounded-xl p-4 backdrop-blur-sm">
        <label className="flex flex-col gap-1 text-sm text-copy-primary">
          Author
          <select
            className={fieldClass}
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setTitle('');
            }}
          >
            <option value="">All authors</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-copy-primary">
          Book title
          <select
            className={fieldClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
            <option value="">All books</option>
            {titles.map((t) => (
              <option key={t} value={t}>
                {plainText(t)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-copy-primary">
          Subject / keyword
          <input
            className={fieldClass}
            type="search"
            placeholder="Search within quote text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
      </div>

      <div className="flex items-center justify-between my-4 text-sm text-copy-primary">
        <span>
          {results.length} {results.length === 1 ? 'quote' : 'quotes'}
          {results.length > RESULT_CAP ? ` — showing first ${RESULT_CAP}` : ''}
        </span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="rounded-lg border border-accent bg-accent/20 px-3 py-1 font-sans font-semibold text-copy-primary"
          >
            Clear
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-4 pb-8">
        {shown.map((h, i) => (
          <li
            key={`${h.Title}-${h.Location}-${i}`}
            className="flex gap-4 bg-primary-two/30 ring-1 ring-accent/10 rounded-xl p-4"
          >
            {h['Book Cover'] && (
              <img
                src={h['Book Cover']}
                alt=""
                loading="lazy"
                className="w-14 h-20 object-cover rounded shrink-0"
              />
            )}
            <div className="text-left">
              <h2
                className="font-semibold text-copy-primary"
                dangerouslySetInnerHTML={{ __html: h.Title }}
              />
              <p className="text-sm text-copy-primary/80 mb-2">{h.Author}</p>
              <p className="text-copy-primary">{h['Highlight Text']}</p>
              {h['Book URL'] && (
                <a
                  href={h['Book URL']}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm inline-block mt-2"
                >
                  Buy on Amazon
                </a>
              )}
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="text-center text-copy-primary/70 py-10">
            No quotes match these filters.
          </li>
        )}
      </ul>
    </div>
  );
}

export default FilterQuotes;
