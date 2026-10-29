import { useEffect, useRef, useState } from 'react';
import '../camera.css';

const LINE_1 = 'P<USASNOW<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<<<<';
const LINE_2 = 'P01234679USA9012139M3212135<<<<<<<<<<<<<<04';

type Phase = 'opening' | 'permission' | 'scanning';

interface Props {
  onScanned: () => void;
  /** Opens straight at a phase and stays there (presenter navigation). */
  initialPhase?: Phase;
  onDeny: () => void;
  onClose: () => void;
}

// Prototype only: no real camera. The iris-open, iOS permission alert and the passport in frame are all simulated.
export function CameraScan({ onScanned, initialPhase, onDeny, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>(initialPhase ?? 'opening');
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => {
    if (!initialPhase) later(() => setPhase('permission'), 900);
    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  const allow = () => {
    setPhase('scanning');
    later(onScanned, 2600);
  };

  return (
    <div className="cam" role="dialog" aria-modal="true" aria-label="Passport scanner">
      <div className="cam__feed" aria-hidden="true" />

      <div className="cam__top">
        <button type="button" className="cam__close" aria-label="Close camera" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <p className="cam__hint">Place your passport photo page inside the frame</p>
      </div>

      <div className="cam__stage">
        <div className={`cam__frame${phase === 'scanning' ? ' is-locking' : ''}`}>
          <span className="cam__corner cam__corner--tl" />
          <span className="cam__corner cam__corner--tr" />
          <span className="cam__corner cam__corner--bl" />
          <span className="cam__corner cam__corner--br" />

          {phase === 'scanning' && (
            <div className="cam-pass" aria-hidden="true">
              <div className="cam-pass__page">
                <p className="cam-pass__title">PASSPORT</p>
                <div className="cam-pass__row">
                  <div className="cam-pass__photo">
                    <span className="cam-pass__head" />
                    <span className="cam-pass__shoulders" />
                  </div>
                  <div className="cam-pass__fields">
                    <span style={{ width: '46%' }} />
                    <span style={{ width: '82%' }} />
                    <span style={{ width: '64%' }} />
                    <span style={{ width: '74%' }} />
                    <span style={{ width: '52%' }} />
                  </div>
                </div>
              </div>
              <div className="cam-pass__mrz">
                <p>{LINE_1}</p>
                <p>{LINE_2}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {phase === 'permission' && (
        <div className="cam-alert">
          <div className="cam-alert__box" role="alertdialog" aria-modal="true" aria-labelledby="cam-alert-title" aria-describedby="cam-alert-text">
            <div className="cam-alert__body">
              <h2 id="cam-alert-title">“Shopper Portal” Would Like to Access the Camera</h2>
              <p id="cam-alert-text">To scan your passport and complete your sign-up.</p>
            </div>
            <div className="cam-alert__actions">
              <button type="button" onClick={onDeny}>
                Don’t Allow
              </button>
              <button type="button" className="is-primary" onClick={allow}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
