import '../welcome.css';
import glowBottom from '../assets/welcome/glow-bottom.svg';
import glowTop from '../assets/welcome/glow-top.svg';
import { LOGOS, LogoTile } from './LogoTile';

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
          <LogoTile key={l.name} logo={l} index={i} />
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
