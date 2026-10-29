import { useEffect, useState } from 'react';
import '../camera.css';

// Prototype only: simulates the iOS location permission alert, no real geolocation.
export function LocationAlert({ onAnswer }: { onAnswer: () => void }) {
  const [ready, setReady] = useState(false);

  // Let the tab transition settle before the system alert appears.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 450);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <div className="cam-alert loc-alert">
      <div className="cam-alert__box" role="alertdialog" aria-modal="true" aria-labelledby="loc-alert-title" aria-describedby="loc-alert-text">
        <div className="cam-alert__body">
          <h2 id="loc-alert-title">Allow “Shopper Portal” to use your location?</h2>
          <p id="loc-alert-text">Your location is used to show the Tax Free stores closest to you.</p>
        </div>
        <div className="cam-alert__actions cam-alert__actions--stack">
          <button type="button" onClick={onAnswer}>
            Allow Once
          </button>
          <button type="button" onClick={onAnswer} autoFocus>
            Allow While Using App
          </button>
          <button type="button" onClick={onAnswer}>
            Don’t Allow
          </button>
        </div>
      </div>
    </div>
  );
}
