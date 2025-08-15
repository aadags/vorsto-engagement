import React, { useMemo, useRef, useState } from 'react';

export default function TagMultiSelect({
  value,
  onChange,
  suggestions,
  placeholder = 'Add a tag…',
  max,
}) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const normalizedSelected = useMemo(
    () => new Set((value || []).map((v) => v.toLowerCase())),
    [value]
  );

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    const pool = (suggestions || []).filter(
      (s) => !normalizedSelected.has(String(s).toLowerCase())
    );
    if (!q) return pool.slice(0, 8);
    return pool.filter((s) => String(s).toLowerCase().includes(q)).slice(0, 8);
  }, [input, suggestions, normalizedSelected]);

  const addTag = (raw) => {
    const t = String(raw || '').trim();
    if (!t) return;
    if (max && (value?.length || 0) >= max) return;
    if (normalizedSelected.has(t.toLowerCase())) return;
    onChange([...(value || []), t]);
    setInput('');
    setOpen(false);
  };

  const removeTag = (tag) => {
    onChange((value || []).filter((v) => v !== tag));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      if (input.trim()) {
        e.preventDefault();
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input) {
      // quick remove last tag
      onChange((value || []).slice(0, -1));
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',')) {
      e.preventDefault();
      text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach(addTag);
    }
  };

  return (
    <div
      className="tag-field"
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {(value || []).map((tag) => (
        <span className="chip" key={tag}>
          {tag}
          <button
            type="button"
            className="chip-remove"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        className="tag-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)} 
        placeholder={(value?.length || 0) === 0 ? placeholder : ''}
        autoComplete="off"
      />

      {open && filtered.length > 0 && (
        <ul className="tag-suggestions" role="listbox">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
