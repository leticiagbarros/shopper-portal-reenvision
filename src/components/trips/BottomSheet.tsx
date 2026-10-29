import { useRef, useState, type ReactNode } from 'react';

export type Snap = 'title' | 'peek' | 'half' | 'full';

const PEEK_PX = 230;
const FULL_TOP_GAP = 60;
const HALF_RATIO = 0.56;

// Height of the title-only state: set by --sheet-title in trips.css so it clears the tab bar.
export const titleHeight = (el: Element) => parseFloat(getComputedStyle(el).getPropertyValue('--sheet-title')) || 166;

interface Props {
  snap: Snap;
  onSnapChange: (snap: Snap) => void;
  /** The lowest state: 'title' shows only the header above the tab bar. */
  minSnap?: 'peek' | 'title';
  header: ReactNode;
  children: ReactNode;
}

export function BottomSheet({ snap, onSnapChange, minSnap = 'peek', header, children }: Props) {
  const sheetRef = useRef<HTMLElement>(null);
  const [dragHeight, setDragHeight] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sheet = sheetRef.current;
    const container = sheet?.parentElement;
    if (!sheet || !container || (e.pointerType === 'mouse' && e.button !== 0)) return;

    const startY = e.clientY;
    const startHeight = sheet.offsetHeight;
    const containerHeight = container.offsetHeight;
    const min = minSnap === 'title' ? titleHeight(container) : PEEK_PX;
    const max = containerHeight - FULL_TOP_GAP;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - startY;
      if (!moved && Math.abs(dy) > 4) moved = true;
      if (moved) setDragHeight(Math.min(max, Math.max(min, startHeight - dy)));
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!moved) {
        if (snap === 'title') onSnapChange('half');
        return;
      }
      const height = Math.min(max, Math.max(min, startHeight - (ev.clientY - startY)));
      const targets: [Snap, number][] = [
        [minSnap, min],
        ['half', Math.round(containerHeight * HALF_RATIO)],
        ['full', max],
      ];
      const nearest = targets.reduce((a, b) =>
        Math.abs(b[1] - height) < Math.abs(a[1] - height) ? b : a,
      );
      setDragHeight(null);
      onSnapChange(nearest[0]);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <section
      ref={sheetRef}
      className={`sheet sheet--${snap}${dragHeight !== null ? ' is-dragging' : ''}`}
      style={dragHeight !== null ? { height: dragHeight } : undefined}
    >
      <div className="sheet__header" onPointerDown={handlePointerDown}>
        <button
          type="button"
          className="sheet__handle"
          aria-label={snap === 'full' ? 'Collapse' : 'Expand'}
          onClick={() => onSnapChange(snap === 'full' ? 'half' : snap === 'half' ? 'full' : 'half')}
        />
        {header}
      </div>
      <div className="sheet__body">{children}</div>
    </section>
  );
}
