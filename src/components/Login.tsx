import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import '../login.css';
import collage from '../assets/login/collage.gif';
import chevronDown from '../assets/login/chevron-down.svg';
import logo from '../assets/login/shopper-portal-logo.svg';
import { ArrowLeft } from './trips/icons';
import { EmailKeyboard } from './EmailKeyboard';

type Busy = 'email' | 'code' | 'apple' | 'google' | 'facebook' | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_LENGTH = 6;
const LANGUAGES = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português'];

const iconProps = { width: 22, height: 22, 'aria-hidden': true } as const;

const AppleIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const GoogleIcon = () => (
  <svg {...iconProps} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const FacebookIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5.500" width="18" height="13" rx="2.500" />
    <path d="m4 8 8 5.500L20 8" />
  </svg>
);

const CloseIcon = () => (
  <svg {...iconProps} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const Spinner = () => <span className="login-spinner" role="status" aria-label="Loading" />;

const SOCIAL = [
  { id: 'apple', label: 'Continue with apple', icon: <AppleIcon /> },
  { id: 'google', label: 'Continue with Gmail', icon: <GoogleIcon /> },
  { id: 'facebook', label: 'Continue with Facebook', icon: <FacebookIcon /> },
] as const;

const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['0', ''],
] as const;

// Staggers the entrance animation by position.
const at = (i: number) => ({ '--i': i }) as CSSProperties;

export function Login({ onDone, initial = 'start' }: { onDone: () => void; initial?: 'start' | 'email' | 'check' }) {
  const [view, setView] = useState<'email' | 'check'>(initial === 'check' ? 'check' : 'email');
  const [sheet, setSheet] = useState<'closed' | 'open' | 'closing'>(initial === 'start' ? 'closed' : 'open');
  const [email, setEmail] = useState(initial === 'check' ? 'alex@gmail.com' : '');
  const [emailError, setEmailError] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState<Busy>(null);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    if (cooldown === 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const finish = onDone;

  // Prototype only: any valid email or 6-digit code is accepted.
  const social = (id: 'apple' | 'google' | 'facebook') => {
    setBusy(id);
    later(finish, 900);
  };

  const closeSheet = () => {
    if (busy) return;
    setSheet('closing');
    setEmailError(false);
    later(() => {
      setSheet('closed');
      setView('email');
    }, 260);
  };

  const submitEmail = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    if (!EMAIL_RE.test(email)) {
      setEmailError(true);
      return;
    }
    setBusy('email');
    later(() => {
      setBusy(null);
      setView('check');
    }, 900);
  };

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (code.length !== CODE_LENGTH) {
      setCodeError(true);
      return;
    }
    setBusy('code');
    later(finish, 1100);
  };

  const changeCode = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH));
    setCodeError(false);
  };

  return (
    <div className="onb login" aria-label="Log in or sign up">
      <main className="login__start">
          <button type="button" className="icon-btn login__skip" aria-label="Skip log in" onClick={finish}>
            <CloseIcon />
          </button>

          <img className="login__in login__logo" style={at(0)} src={logo} alt="Shopper Portal from Planet" width={150} height={36} />
          <img className="login__in login__collage" style={at(1)} src={collage} alt="" draggable={false} />

          <div className="login__form">
            <h1 className="login__in login__heading" style={at(2)}>
              Log in or sign up
            </h1>
            <button
              type="button"
              className="btn-primary login__in login__btn"
              style={at(3)}
              disabled={busy !== null}
              onClick={() => setSheet('open')}
            >
              <MailIcon />
              Sign in with email
            </button>

            <div className="login__in login__or" style={at(4)} aria-hidden="true">
              <span />
              or
              <span />
            </div>

            {SOCIAL.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="login__in login__social"
                style={at(5 + i)}
                disabled={busy !== null}
                onClick={() => social(s.id)}
              >
                {busy === s.id ? <Spinner /> : s.icon}
                {s.label}
              </button>
            ))}
          </div>

          <p className="login__in login__note" style={at(8)}>
            You’ll need your passport to complete sign-up
          </p>

          <div
            className="login__in login__langwrap"
            style={at(9)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setLangOpen(false);
            }}
            onKeyDown={(e) => e.key === 'Escape' && setLangOpen(false)}
          >
            <button
              type="button"
              className="login__lang"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((o) => !o)}
            >
              {lang}
              <img src={chevronDown} alt="" width={16} height={16} />
            </button>
            {langOpen && (
              <ul className="login__langlist" role="listbox" aria-label="Language">
                {LANGUAGES.map((l) => (
                  <li key={l} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={l === lang}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>

      {sheet !== 'closed' && (
        <>
          <div
            className={`login__scrim${sheet === 'closing' ? ' is-out' : ''}`}
            onClick={view === 'email' ? closeSheet : undefined}
          />
          <form
            className={`login__sheet login__sheet--keys${sheet === 'closing' ? ' is-out' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-sheet-title"
            onSubmit={view === 'email' ? submitEmail : submitCode}
            noValidate
          >
            {view === 'email' ? (
              <>
                <button type="button" className="icon-btn login__close" aria-label="Close" onClick={closeSheet}>
                  <CloseIcon />
                </button>
                <h2 id="login-sheet-title" className="login__sheet-title">
                  Sign in with email
                </h2>
                <div>
                  <input
                    className="login__input"
                    type="email"
                    inputMode="none"
                    autoComplete="email"
                    autoCapitalize="off"
                    maxLength={254}
                    placeholder="Email"
                    aria-label="Email"
                    aria-invalid={emailError}
                    aria-describedby={emailError ? 'login-email-error' : undefined}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.trim());
                      setEmailError(false);
                    }}
                    autoFocus
                  />
                  {emailError && (
                    <p id="login-email-error" className="login__error" role="alert">
                      Enter a valid email address
                    </p>
                  )}
                </div>
                <button type="submit" className="btn-primary login__btn" disabled={busy !== null}>
                  {busy === 'email' ? <Spinner /> : 'Continue'}
                </button>
                <EmailKeyboard
                  disabled={busy !== null}
                  onKey={(ch) => {
                    setEmail((v) => (v + ch).slice(0, 254));
                    setEmailError(false);
                  }}
                  onBackspace={() => {
                    setEmail((v) => v.slice(0, -1));
                    setEmailError(false);
                  }}
                  onReturn={() => submitEmail()}
                />
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="icon-btn login__close"
                  aria-label="Back"
                  disabled={busy !== null}
                  onClick={() => {
                    setView('email');
                    setCode('');
                    setCodeError(false);
                    setResent(false);
                    setCooldown(0);
                  }}
                >
                  <ArrowLeft />
                </button>
                <div className="login__check-body">
                  <span className="login__mail">
                    <MailIcon />
                  </span>
                  <h2 id="login-sheet-title" className="login__check-title">
                    Check your email
                  </h2>
                  <p className="login__check-text">
                    A temporary login link has been sent to <strong>{email}</strong>
                  </p>
                  <input
                    className="login__input login__input--code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={CODE_LENGTH}
                    placeholder="Enter code"
                    aria-label="6-digit code"
                    aria-invalid={codeError}
                    aria-describedby={codeError ? 'login-code-error' : undefined}
                    value={code}
                    disabled={busy === 'code'}
                    onChange={(e) => changeCode(e.target.value)}
                    autoFocus
                  />
                  {codeError && (
                    <p id="login-code-error" className="login__error" role="alert">
                      Enter the 6-digit code from your email
                    </p>
                  )}
                  <button
                    type="button"
                    className="login__link"
                    disabled={cooldown > 0 || busy !== null}
                    onClick={() => {
                      setResent(true);
                      setCooldown(5);
                    }}
                  >
                    {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
                  </button>
                  <p className="login__sent" role="status">
                    {resent && 'We sent you a new email'}
                  </p>
                </div>
                <button type="submit" className="btn-primary login__btn" disabled={busy !== null}>
                  {busy === 'code' ? <Spinner /> : 'Continue'}
                </button>
                <div className="login__keypad" role="group" aria-label="Number keypad">
                  {KEYS.map(([digit, letters]) => (
                    <button
                      key={digit}
                      type="button"
                      disabled={busy !== null}
                      onClick={() => changeCode(code + digit)}
                    >
                      {digit}
                      {letters && <span aria-hidden="true">{letters}</span>}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="login__key-del"
                    aria-label="Delete"
                    disabled={busy !== null}
                    onClick={() => setCode((c) => c.slice(0, -1))}
                  >
                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8.500 1.500h13a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-13L1.500 10l7-8.500Z" />
                      <path d="m12.500 7 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
}
