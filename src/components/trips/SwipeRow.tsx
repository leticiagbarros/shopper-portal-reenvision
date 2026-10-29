import { useRef, useState, type ReactNode } from 'react';
import { Trash } from './icons';

const ACTION_WIDTH = 88;
const MAX_PULL = 400;

interface Props {
  label: string;
  actionLabel?: string;
  onDelete: () => void;
  children: ReactNode;
}

// iOS-style swipe-left to reveal Delete; a long swipe deletes immediately.
export function SwipeRow({ label, actionLabel = 'Delete', onDelete, children }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const justDragged = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startOffset = open ? -ACTION_WIDTH : 0;
    const width = row.offsetWidth;
    let moved = false;
    let current = startOffset;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!moved) {
        if (Math.abs(ev.clientY - startY) > Math.abs(dx) && Math.abs(ev.clientY - startY) > 6) {
          cleanup();
          return;
        }
        if (Math.abs(dx) < 6) return;
        moved = true;
        setDragging(true);
      }
      current = Math.max(-MAX_PULL, Math.min(0, startOffset + dx));
      setOffset(current);
    };
    const cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    const onUp = () => {
      cleanup();
      if (!moved) return;
      justDragged.current = true;
      setTimeout(() => (justDragged.current = false), 0);
      setDragging(false);
      if (current < -width * 0.6) {
        setOffset(-width);
        setTimeout(onDelete, 180);
      } else if (current < -ACTION_WIDTH / 2) {
        setOffset(-ACTION_WIDTH);
        setOpen(true);
      } else {
        setOffset(0);
        setOpen(false);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (justDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    } else if (open) {
      e.stopPropagation();
      e.preventDefault();
      setOpen(false);
      setOffset(0);
    }
  };

  return (
    <div className={`swipe-row${dragging ? ' is-dragging' : ''}`} ref={rowRef}>
      <button
        type="button"
        className="swipe-row__action"
        style={{ width: Math.max(0, -offset) }}
        tabIndex={open ? 0 : -1}
        aria-label={`${actionLabel} ${label}`}
        onClick={onDelete}
      >
        <Trash />
        <span>{actionLabel}</span>
      </button>
      <div
        className={`swipe-row__content${dragging ? ' is-dragging' : ''}`}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
      >
        {children}
      </div>
    </div>
  );
}
