import '../scan-animation.css';

const LINE_1 = 'P<USASNOW<<JOHN<<<<<<<<<<<<<<<<<<<<<<<<<<<<<';
const LINE_2 = 'P01234679USA9012139M3212135<<<<<<<<<<<<<<04';

// Looping demo: align the photo page, then the two lines at the bottom (MRZ) get outlined, which is what the scanner reads.
export function ScanAnimation() {
  return (
    <figure
      className="scan"
      role="img"
      aria-label="Animation: open your passport to the photo page, line up the two lines of numbers at the bottom of the page inside the frame, and hold still while they are read."
    >
      <div className="scan__view" aria-hidden="true">
        <span className="scan__corner scan__corner--tl" />
        <span className="scan__corner scan__corner--tr" />
        <span className="scan__corner scan__corner--bl" />
        <span className="scan__corner scan__corner--br" />

        <div className="scan__passport">
          <div className="scan__page">
            <p className="scan__title">PASSPORT</p>
            <div className="scan__row">
              <div className="scan__photo">
                <span className="scan__head" />
                <span className="scan__shoulders" />
              </div>
              <div className="scan__fields">
                <span style={{ width: '46%' }} />
                <span style={{ width: '82%' }} />
                <span style={{ width: '64%' }} />
                <span style={{ width: '74%' }} />
                <span style={{ width: '52%' }} />
              </div>
            </div>
            <span className="scan__dim" />
          </div>

          <div className="scan__mrz">
            <p>{LINE_1}</p>
            <p>{LINE_2}</p>
            <svg className="scan__ring" viewBox="0 0 208 38" preserveAspectRatio="none">
              <rect x="0.75" y="0.75" width="206.5" height="36.5" rx="7" />
            </svg>
            <svg className="scan__outline" viewBox="0 0 208 38" preserveAspectRatio="none">
              <rect x="0.75" y="0.75" width="206.5" height="36.5" rx="7" pathLength="1" />
            </svg>
          </div>
        </div>
      </div>
    </figure>
  );
}
