import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import '../qr.css';
import { Check, QrCode } from './trips/icons';
import walletIcon from '../assets/icons/wallet.svg';

const SHOPPER = { name: 'John Snow', id: 'TFS-4821-7730' };
// Opaque token: the store resolves it, so the code carries no personal data.
const PAYLOAD = `PLANET-TAXFREE:SHOPPER:${SHOPPER.id}`;
const QUIET_ZONE = 2;

function QrSvg({ value }: { value: string }) {
  const { size, path } = useMemo(() => {
    const modules = QRCode.create(value, { errorCorrectionLevel: 'M' }).modules;
    let d = '';
    for (let r = 0; r < modules.size; r++) {
      for (let c = 0; c < modules.size; c++) {
        if (modules.get(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { size: modules.size, path: d };
  }, [value]);
  const full = size + QUIET_ZONE * 2;

  return (
    <svg
      className="qr-code"
      viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${full} ${full}`}
      role="img"
      aria-label="Your Tax Free QR code"
      shapeRendering="crispEdges"
    >
      <rect x={-QUIET_ZONE} y={-QUIET_ZONE} width={full} height={full} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}

interface Props {
  hidden: boolean;
  low: boolean;
  /** Opens the QR dialog right away, for presenter navigation. */
  defaultOpen?: boolean;
}

const WalletIcon = () => <img src={walletIcon} alt="" width={22} height={22} />;

export function QrFab({ hidden, low, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [inWallet, setInWallet] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  return (
    <>
      <button
        type="button"
        className={`qr-fab${hidden ? ' is-hidden' : ''}${low ? ' is-low' : ''}`}
        aria-label="Show my QR code"
        tabIndex={hidden ? -1 : 0}
        onClick={() => setOpen(true)}
      >
        <QrCode />
      </button>

      {open && (
        <div className="qr-scrim" onClick={() => setOpen(false)}>
          <div
            className="qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="qr-title" className="qr-dialog__title">
              Your Tax Free QR code
            </h2>
            <p className="qr-dialog__text">Show this code at the store. They scan it to get your Tax Free details.</p>
            <div className="qr-dialog__code">
              <QrSvg value={PAYLOAD} />
            </div>
            <p className="qr-dialog__name">{SHOPPER.name}</p>
            <p className="qr-dialog__id">{SHOPPER.id}</p>
            {/* Prototype: a real pass needs a signed Apple Wallet / Google Wallet file from the backend. */}
            <button
              type="button"
              className={`wallet-btn${inWallet ? ' is-added' : ''}`}
              disabled={inWallet}
              onClick={() => setInWallet(true)}
            >
              {inWallet ? <Check /> : <WalletIcon />}
              {inWallet ? 'Added to wallet' : 'Add to wallet'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
