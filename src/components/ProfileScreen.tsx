import '../profile.css';
import { useState } from 'react';
import chevron from '../assets/icons/chevron-right.svg';
import passportIcon from '../assets/icons/passport.svg';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: '#18181b',
  strokeWidth: 1.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const PersonIcon = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="5" r="2.500" />
    <path d="M3 13.500c.5-2.300 2.400-3.500 5-3.500s4.500 1.200 5 3.500" />
  </svg>
);

const WalletIcon = () => (
  <svg {...iconProps}>
    <rect x="1.700" y="3" width="12.600" height="10" rx="1.500" />
    <path d="M1.700 6.200h12.600" />
  </svg>
);

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M8 13.500S2 10 2 6a3 3 0 0 1 6-.8A3 3 0 0 1 14 6c0 4-6 7.500-6 7.500Z" />
  </svg>
);

const GlobeIcon = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="8" r="6.300" />
    <path d="M1.700 8h12.600M8 1.700c1.800 1.800 2.700 3.900 2.700 6.300S9.800 12.500 8 14.300C6.200 12.500 5.300 10.400 5.300 8S6.200 3.500 8 1.700Z" />
  </svg>
);

const LegalIcon = () => (
  <svg {...iconProps}>
    <path d="M8 2.500v10.500M5 13.500h6M3 5h10" />
    <path d="M3 5 1.500 8.500a1.800 1.800 0 0 0 3 0L3 5ZM13 5l-1.500 3.500a1.800 1.800 0 0 0 3 0L13 5Z" />
  </svg>
);

const HelpIcon = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="8" r="6.300" />
    <path d="M6.200 6.300a1.800 1.800 0 1 1 2.600 1.600c-.5.300-.8.700-.8 1.300M8 11.300v.1" />
  </svg>
);

const ExternalIcon = () => (
  <svg {...iconProps} stroke="#71717a">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

const TrashIcon = () => (
  <svg {...iconProps}>
    <path d="M3 4.500h10M6.200 4.500V3h3.600v1.500M4.200 4.500l.6 8.500h6.400l.6-8.500M6.700 7v4M9.300 7v4" />
  </svg>
);

const LogoutIcon = () => (
  <svg {...iconProps}>
    <path d="M6.500 2.500h-3v11h3M6 8h7M10.500 5.500 13 8l-2.500 2.500" />
  </svg>
);

const LINKS = [
  { label: 'Legal', href: 'https://www.weareplanet.com/legal', icon: <LegalIcon /> },
  { label: 'Help', href: 'https://europe-taxfree.planetpayment.com/SPortalEU/Help', icon: <HelpIcon /> },
];

function Row({
  icon,
  label,
  badge,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon}
      <span className="profile-row__label">{label}</span>
      {badge !== undefined && <span className="profile-row__badge">{badge}</span>}
      {href ? <ExternalIcon /> : <img src={chevron} alt="" width={16} height={16} />}
    </>
  );
  return href ? (
    <a className="profile-row" href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <button type="button" className="profile-row" onClick={onClick}>
      {content}
    </button>
  );
}

type Action = 'delete' | 'logout';

const COPY: Record<Action, { title: string; text: string; confirm: string; doneTitle: string; doneText: string }> = {
  delete: {
    title: 'Delete your account?',
    text: 'This removes your profile, passport and wallet details. It cannot be undone.',
    confirm: 'Delete account',
    doneTitle: 'Request received',
    doneText: 'We will delete your account within 30 days. You can keep using the app until then.',
  },
  logout: {
    title: 'Log out?',
    text: 'You will need to log in again to see your refunds and trips.',
    confirm: 'Log out',
    doneTitle: 'You are logged out',
    doneText: 'See you soon, John. This is a prototype, so you stay on this screen.',
  },
};

function ActionDialog({ action, onClose }: { action: Action; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const copy = COPY[action];

  return (
    <div className="qr-scrim" onClick={onClose}>
      <div
        className="qr-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="action-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="action-title" className="qr-dialog__title">
          {done ? copy.doneTitle : copy.title}
        </h2>
        <p className="qr-dialog__text">{done ? copy.doneText : copy.text}</p>
        {done ? (
          <button type="button" className="btn-primary" onClick={onClose}>
            Close
          </button>
        ) : (
          <>
            <button type="button" className="btn-primary" onClick={() => setDone(true)}>
              {copy.confirm}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ProfileScreen({ onEditInterests }: { onEditInterests: () => void }) {
  const [action, setAction] = useState<Action | null>(null);

  return (
    <>
    <main className="screen" aria-label="Profile">
      <div className="screen__content profile">
        <h1 className="screen__title">Profile</h1>

        <section className="profile-card" aria-label="Account">
          <p className="profile-card__name">John Snow</p>
          <p className="profile-card__email">johnsnow@mail.com</p>
        </section>

        <div className="profile-list">
          <Row icon={<PersonIcon />} label="Profile details" />
          <Row icon={<img src={passportIcon} alt="" width={16} height={16} />} label="Passport" badge={1} />
          <Row icon={<WalletIcon />} label="My wallet" />
          <Row icon={<HeartIcon />} label="Shopping interests" onClick={onEditInterests} />
        </div>

        <div className="profile-list">
          <Row icon={<GlobeIcon />} label="Language" />
        </div>

        <div className="profile-list">
          {LINKS.map((l) => (
            <Row key={l.href} icon={l.icon} label={l.label} href={l.href} />
          ))}
        </div>

        <div className="profile-list profile-list--bottom">
          <Row icon={<TrashIcon />} label="Delete account" onClick={() => setAction('delete')} />
          <Row icon={<LogoutIcon />} label="Logout" onClick={() => setAction('logout')} />
        </div>
      </div>
    </main>
    {action && <ActionDialog key={action} action={action} onClose={() => setAction(null)} />}
    </>
  );
}
