import { useState } from 'react';
import '../register.css';
import arrowBack from '../assets/register/arrow-back.svg';
import { ScanAnimation } from './ScanAnimation';
import { CameraScan } from './CameraScan';

const LEGAL_URL = 'https://www.weareplanet.com/legal';
const STEPS = 2;
const TITLES = ['Passport details', 'Confirm passport details'];

// Sample passport data standing in for the scan result.
const SCANNED = { number: 'P0123467', expiry: '13/12/2032', country: 'United States of America' };

interface Props {
  /** Opens at a given step and camera phase, for presenter navigation. */
  initialStep?: number;
  initialCamera?: 'permission' | 'scanning';
  onDone: () => void;
  onBack: () => void;
}

export function Register({ onDone, onBack, initialStep = 0, initialCamera }: Props) {
  const [step, setStep] = useState(initialStep);
  const [camera, setCamera] = useState(initialCamera !== undefined);
  const [denied, setDenied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const scan = () => {
    if (!agreed) {
      setConsentError(true);
      return;
    }
    setDenied(false);
    setCamera(true);
  };

  return (
    <div className="onb reg" role="dialog" aria-modal="true" aria-label="Create your account">
      <header className="reg__header">
        <button
          type="button"
          className="reg__back"
          aria-label="Back"
          onClick={() => (step === 0 ? onBack() : setStep(step - 1))}
        >
          <img src={arrowBack} alt="" width={24} height={24} />
        </button>
        <h1 className="reg__title">{TITLES[step]}</h1>
        <span className="reg__back" />
      </header>

      <div className="reg__stepper" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of ${STEPS}`}>
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className={i <= step ? 'is-on' : undefined} />
        ))}
      </div>

      {step === 0 && (
        <>
          <div className="reg__body reg__body--icon reg__body--scan" key="passport">
            <ScanAnimation />
            <h2 className="reg__heading">Get your passport ready and allow camera access</h2>
            <p className="reg__text">To complete your signup, we need the camera to scan your passport.</p>
            {denied && (
              <p className="reg__denied" role="alert">
                Camera access is off. Turn it on in Settings to scan your passport.
              </p>
            )}
          </div>
          <footer className="reg__footer">
            <div className="reg-consent">
              <label className="reg-consent__row">
                <input
                  type="checkbox"
                  checked={agreed}
                  aria-describedby={consentError ? 'reg-consent-err' : undefined}
                  aria-invalid={consentError}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setConsentError(false);
                  }}
                />
                <span>
                  By continuing you agree to our{' '}
                  <a href={LEGAL_URL} target="_blank" rel="noopener noreferrer">
                    Terms of service
                  </a>{' '}
                  and{' '}
                  <a href={LEGAL_URL} target="_blank" rel="noopener noreferrer">
                    Privacy policy
                  </a>
                  .
                </span>
              </label>
              {consentError && (
                <p id="reg-consent-err" className="reg-consent__error" role="alert">
                  Please accept the Terms of service and Privacy policy to continue.
                </p>
              )}
            </div>
            <button type="button" className="btn-primary reg__btn" onClick={scan}>
              Continue to scan
            </button>
          </footer>
        </>
      )}

      {step === 1 && (
        <>
          <div className="reg__body" key="confirm">
            <dl className="reg__facts">
              <div>
                <dt>Passport number</dt>
                <dd>{SCANNED.number}</dd>
              </div>
              <div>
                <dt>Passport date of expiry</dt>
                <dd>{SCANNED.expiry}</dd>
              </div>
              <div>
                <dt>Passport country</dt>
                <dd>{SCANNED.country}</dd>
              </div>
            </dl>
            <p className="reg__again">
              Incorrect details?{' '}
              <button type="button" onClick={() => setStep(0)}>
                Scan passport again
              </button>
            </p>
          </div>
          <footer className="reg__footer">
            <button type="button" className="btn-primary reg__btn" onClick={onDone}>
              Continue
            </button>
          </footer>
        </>
      )}

      {camera && (
        <CameraScan
          initialPhase={initialCamera}
          onScanned={() => {
            setCamera(false);
            setStep(1);
          }}
          onDeny={() => {
            setCamera(false);
            setDenied(true);
          }}
          onClose={() => setCamera(false)}
        />
      )}
    </div>
  );
}
