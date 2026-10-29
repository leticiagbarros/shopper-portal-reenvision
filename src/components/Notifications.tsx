import { useEffect, useRef, useState } from 'react';
import '../camera.css';
import '../notifications.css';
import { BRANDS } from '../data/places';

const logo = (id: string) => BRANDS.find((b) => b.id === id)?.logo ?? '';

// Positions are percentages of the map; sizes are the marker diameter in px.
const STORES = [
  { id: 'louis-vuitton', x: 31, y: 0, size: 70 },
  { id: 'sephora', x: 79, y: 27, size: 72 },
  { id: 'gucci', x: 19, y: 74, size: 86 },
];

const FaceIcon = ({ path }: { path: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={path} />
  </svg>
);

function NearbyMap() {
  return (
    <div className="nmap" aria-hidden="true">
      <div className="nmap__map">
      <svg className="nmap__svg" viewBox="0 0 350 190" preserveAspectRatio="xMidYMid slice">
        <rect width="350" height="190" fill="#f3f3f1" />
        <path d="M0 0H40C32 40 48 80 36 120C30 150 42 175 38 190H0Z" fill="#dde3e8" />
        <path d="M40 0C32 40 48 80 36 120C30 150 42 175 38 190" fill="none" stroke="#ebe8de" strokeWidth="6" />
        <rect x="150" y="118" width="44" height="30" rx="4" fill="#e4e8e1" />
        <rect x="96" y="8" width="30" height="24" rx="4" fill="#e4e8e1" />
        <rect x="256" y="160" width="58" height="26" rx="4" fill="#e4e8e1" />
        <g stroke="#e1e1de" strokeWidth="7" strokeLinecap="round">
          {[70, 115, 160, 205, 250, 300].map((x) => (
            <line key={x} x1={x} y1="-5" x2={x} y2="195" />
          ))}
          {[30, 70, 110, 150].map((y) => (
            <line key={y} x1="40" y1={y} x2="355" y2={y} />
          ))}
          <line x1="60" y1="200" x2="360" y2="55" strokeWidth="10" />
        </g>
        <g stroke="#ffffff" strokeWidth="4" strokeLinecap="round">
          {[70, 115, 160, 205, 250, 300].map((x) => (
            <line key={x} x1={x} y1="-5" x2={x} y2="195" />
          ))}
          {[30, 70, 110, 150].map((y) => (
            <line key={y} x1="40" y1={y} x2="355" y2={y} />
          ))}
          <line x1="60" y1="200" x2="360" y2="55" strokeWidth="7" />
        </g>
      </svg>

      <span className="nmap__dot" style={{ left: '43%', top: '60%' }}>
        <i />
      </span>
      </div>

      {STORES.map((s, i) => (
        <span key={s.id} className={`nmap__pin nmap__pin--logo nmap-i-${i}`} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}>
          <img src={logo(s.id)} alt="" draggable={false} />
        </span>
      ))}

      <span className="nmap__pin nmap__pin--dark nmap-i-3" style={{ left: '56%', top: '47%', width: 42, height: 42 }}>
        <FaceIcon path="M7 3v7a2 2 0 0 0 2 2v9M11 3v7M5 3v7M17 21V3c-2 1-3 4-3 8h3" />
      </span>
      <span className="nmap__pin nmap__pin--dark nmap-i-4" style={{ left: '47%', top: '18%', width: 36, height: 36 }}>
        <FaceIcon path="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5M7 11.500h.01" />
      </span>

      <div className="nmap__card nmap-i-5">
        <span className="nmap__card-icon">
          <FaceIcon path="m5 12.500 4.500 4.500L19 7.500" />
        </span>
        <div>
          <p className="nmap__card-title">Refund ready</p>
          <p className="nmap__card-text">€420,00 from Loewe</p>
        </div>
      </div>
    </div>
  );
}

// Prototype only: no real notification permission is requested.
export function Notifications({ onDone }: { onDone: () => void }) {
  const [asking, setAsking] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const leave = () => {
    setAsking(false);
    setLeaving(true);
    timers.current.push(window.setTimeout(onDone, 380));
  };

  return (
    <div className={`onb notif${leaving ? ' is-leaving' : ''}`}>
      <div className="notif__scrim" />

      <section className="notif__sheet" role="dialog" aria-modal="true" aria-labelledby="notif-title">
        <span className="notif__grabber" aria-hidden="true" />

        <NearbyMap />

        <h1 id="notif-title" className="notif__title">
          Know when your refund arrives
        </h1>
        <p className="notif__text">
          Allow notifications to know when your refund is approved, get reminders before your Tax Free form expires, and
          discover Tax Free stores nearby.
        </p>
        <p className="notif__text notif__text--note">We won’t share your data externally or use it for marketing.</p>

        <button type="button" className="btn-primary notif__continue" onClick={() => setAsking(true)}>
          Allow notifications
        </button>
        <button type="button" className="notif__skip" onClick={leave}>
          Skip for now
        </button>
      </section>

      {asking && (
        <div className="cam-alert notif__alert">
          <div className="cam-alert__box" role="alertdialog" aria-modal="true" aria-labelledby="notif-alert-title" aria-describedby="notif-alert-text">
            <div className="cam-alert__body">
              <h2 id="notif-alert-title">“Shopper Portal” Would Like to Send You Notifications</h2>
              <p id="notif-alert-text">Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.</p>
            </div>
            <div className="cam-alert__actions">
              <button type="button" onClick={leave}>
                Don’t Allow
              </button>
              <button type="button" className="is-primary" onClick={leave}>
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
