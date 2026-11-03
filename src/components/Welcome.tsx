import type { CSSProperties } from 'react';
import '../welcome.css';
import bergwelt from '../assets/welcome/bergwelt.png';
import bestWestern from '../assets/welcome/best-western.png';
import bulgari from '../assets/welcome/bulgari.png';
import glowBottom from '../assets/welcome/glow-bottom.svg';
import glowTop from '../assets/welcome/glow-top.svg';
import gucci from '../assets/welcome/gucci.png';
import kewGreen from '../assets/welcome/kew-green.png';
import louisVuitton from '../assets/welcome/louis-vuitton.png';
import prada from '../assets/welcome/prada.png';
import sephora from '../assets/welcome/sephora.png';

interface Logo {
  name: string;
  src: string;
  // Logo box inside the 79.8 x 92 tile, in px.
  box: { left: number; top: number; w: number; h: number };
  // Crop of the exported image, in %; plain object-fit when omitted.
  crop?: { w: number; h: number; l: number; t: number };
  // Tile centre relative to the screen centre, in px, and tilt in degrees.
  dx: number;
  dy: number;
  rot: number;
}

const LOGOS: Logo[] = [
  { name: 'Louis Vuitton', src: louisVuitton, box: { left: 19.28, top: 23, w: 40.761, h: 45 }, crop: { w: 240, h: 144.93, l: -70, t: -22.46 }, dx: -140, dy: -132, rot: -10.84 },
  { name: 'Best Western', src: bestWestern, box: { left: 7, top: 39, w: 65.828, h: 13.097 }, dx: -60, dy: -206, rot: -5.51 },
  { name: 'Gucci', src: gucci, box: { left: 15, top: 21, w: 49.296, h: 50 }, crop: { w: 214.29, h: 140.85, l: -57.14, t: -20.42 }, dx: 35, dy: -190, rot: 5.55 },
  { name: 'Prada', src: prada, box: { left: 8, top: 37, w: 64.167, h: 17.646 }, crop: { w: 100, h: 363.64, l: 0, t: -131.82 }, dx: 137, dy: -145, rot: 3.68 },
  { name: 'Sephora', src: sephora, box: { left: 10, top: 42, w: 60.625, h: 7.862 }, dx: -141, dy: 139, rot: -10.92 },
  { name: 'Bulgari', src: bulgari, box: { left: 10, top: 43, w: 60.466, h: 6.676 }, dx: -44, dy: 202, rot: -2.97 },
  { name: 'Kew Green Hotels', src: kewGreen, box: { left: 10.9, top: 30.6, w: 57.511, h: 30.398 }, crop: { w: 140.71, h: 188.2, l: -20.36, t: -44.1 }, dx: 55, dy: 183, rot: 3.12 },
  { name: 'Bergwelt', src: bergwelt, box: { left: 10, top: 28, w: 60.654, h: 35.441 }, dx: 155, dy: 148, rot: 4.36 },
];

interface Props {
  onStart: () => void;
  onSkip: () => void;
}

export function Welcome({ onStart, onSkip }: Props) {
  return (
    <div className="onb wel" role="dialog" aria-modal="true" aria-labelledby="wel-title">
      <img className="wel__glow wel__glow--top" src={glowTop} alt="" aria-hidden="true" draggable={false} />
      <img className="wel__glow wel__glow--bottom" src={glowBottom} alt="" aria-hidden="true" draggable={false} />

      <div className="wel__field" aria-hidden="true">
        {LOGOS.map((l, i) => (
          <div
            key={l.name}
            className="wel-tile"
            style={{ '--dx': `${l.dx}px`, '--dy': `${l.dy}px`, '--r': `${l.rot}deg`, '--i': i } as CSSProperties}
          >
            <div className="wel-tile__float">
              <div className="wel-tile__logo" style={{ left: l.box.left, top: l.box.top, width: l.box.w, height: l.box.h }}>
                <img
                  src={l.src}
                  alt=""
                  draggable={false}
                  style={
                    l.crop
                      ? { width: `${l.crop.w}%`, height: `${l.crop.h}%`, left: `${l.crop.l}%`, top: `${l.crop.t}%`, objectFit: 'fill' }
                      : undefined
                  }
                  className={l.crop ? 'is-crop' : undefined}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="wel__skip" onClick={onSkip}>
        Skip
      </button>

      <div className="wel__copy">
        <h1 id="wel-title">
          Find Tax Free
          <br />
          stores you’ll love
        </h1>
        <p>Tell us what you like to shop for, and we’ll show you stores that match your interests.</p>
      </div>

      <footer className="wel__footer">
        <button type="button" className="btn-primary wel__btn" onClick={onStart}>
          Continue
        </button>
      </footer>
    </div>
  );
}
