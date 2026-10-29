import { useEffect, useRef, useState } from 'react';
import '../screen-nav.css';
import { SCREEN_GROUPS, type ScreenId } from '../data/screens';

interface Props {
  current: ScreenId | null;
  onSelect: (id: ScreenId) => void;
}

// Presenter tool that sits outside the phone: jump to any screen of the prototype.
export function ScreenNav({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div className="screen-nav" ref={rootRef}>
      <button
        type="button"
        className="screen-nav__toggle"
        aria-expanded={open}
        aria-controls="screen-nav-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.500" y="3.500" width="7" height="7" rx="1.500" />
          <rect x="13.500" y="3.500" width="7" height="7" rx="1.500" />
          <rect x="3.500" y="13.500" width="7" height="7" rx="1.500" />
          <rect x="13.500" y="13.500" width="7" height="7" rx="1.500" />
        </svg>
        Screens
      </button>

      {open && (
        <nav className="screen-nav__panel" id="screen-nav-panel" aria-label="Prototype screens">
          {SCREEN_GROUPS.map((g) => (
            <section key={g.title} className="screen-nav__group">
              <h2>{g.title}</h2>
              <ul>
                {g.items.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={s.id === current ? 'is-current' : undefined}
                      aria-current={s.id === current ? 'true' : undefined}
                      onClick={() => {
                        onSelect(s.id);
                        setOpen(false);
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      )}
    </div>
  );
}
