import { useState } from 'react';

const LETTERS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const NUMBERS = ['1234567890', "-_+=#%&'/", '.,@!?'];

interface Props {
  onKey: (char: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  disabled?: boolean;
}

// On-screen keyboard that stands in for the phone keyboard in the prototype (email layout).
export function EmailKeyboard({ onKey, onBackspace, onReturn, disabled }: Props) {
  const [numbers, setNumbers] = useState(false);
  const [shift, setShift] = useState(false);

  const rows = numbers ? NUMBERS : LETTERS;
  const press = (ch: string) => {
    onKey(shift && !numbers ? ch.toUpperCase() : ch);
    if (shift) setShift(false);
  };

  return (
    <div className="kb" role="group" aria-label="Keyboard">
      {rows.map((row, i) => (
        <div key={row} className={`kb__row${i === 1 ? ' kb__row--inset' : ''}`}>
          {i === 2 && !numbers && (
            <button type="button" className={`kb__key kb__key--wide kb__key--dark${shift ? ' is-on' : ''}`} aria-label="Shift" aria-pressed={shift} disabled={disabled} onClick={() => setShift((s) => !s)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={shift ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4 3.500 13H8v6h8v-6h4.500L12 4Z" />
              </svg>
            </button>
          )}
          {[...row].map((ch) => (
            <button key={ch} type="button" className="kb__key" disabled={disabled} onClick={() => press(ch)}>
              {shift && !numbers ? ch.toUpperCase() : ch}
            </button>
          ))}
          {i === 2 && (
            <button type="button" className="kb__key kb__key--wide kb__key--dark" aria-label="Delete" disabled={disabled} onClick={onBackspace}>
              <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8.500 1.500h13a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-13L1.500 10l7-8.500Z" />
                <path d="m12.500 7 6 6m0-6-6 6" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <div className="kb__row">
        <button type="button" className="kb__key kb__key--wide kb__key--dark kb__key--text" disabled={disabled} onClick={() => setNumbers((n) => !n)}>
          {numbers ? 'ABC' : '123'}
        </button>
        <button type="button" className="kb__key" disabled={disabled} onClick={() => press('@')}>
          @
        </button>
        <button type="button" className="kb__key kb__key--grow" disabled={disabled} onClick={() => onKey('.com')}>
          .com
        </button>
        <button type="button" className="kb__key" disabled={disabled} onClick={() => press('.')}>
          .
        </button>
        <button type="button" className="kb__key kb__key--wide kb__key--dark kb__key--text" disabled={disabled} onClick={onReturn}>
          return
        </button>
      </div>
    </div>
  );
}
