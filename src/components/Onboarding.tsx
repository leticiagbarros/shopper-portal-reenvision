import { useState } from 'react';
import '../onboarding.css';
import {
  BRANDS,
  brandCategory,
  type Category,
  type Preferences,
} from '../data/places';
import { CategoryIcon, Check } from './trips/icons';
import arrowBack from '../assets/register/arrow-back.svg';
import { Welcome } from './Welcome';

const CATEGORY_OPTIONS: { value: Category; hint: string }[] = [
  { value: 'Luxury', hint: 'Fashion houses, jewelry' },
  { value: 'Department store', hint: 'Everything under one roof' },
  { value: 'Shopping mall', hint: 'Many shops, one stop' },
  { value: 'Beauty', hint: 'Makeup and skincare' },
  { value: 'Souvenirs', hint: 'Gifts and local crafts' },
];

interface Props {
  initial: Preferences;
  /** Opens at a given step (0 welcome, 1 interests, 2 brands), for presenter navigation. */
  initialStep?: 0 | 1 | 2;
  onFinish: (prefs: Preferences) => void;
  onClose: () => void;
}

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function Onboarding({ initial, initialStep = 0, onFinish, onClose }: Props) {
  const [step, setStep] = useState<number>(initialStep);
  const [categories, setCategories] = useState<Category[]>(initial.categories);
  const [brands, setBrands] = useState<string[]>(initial.brands);

  // The welcome screen is not a step: shopping interests -> brands.
  const total = 2;
  const position = step - 1;

  // Brands from the chosen categories come first.
  const sortedBrands = [...BRANDS].sort((a, b) => {
    const fa = categories.includes(brandCategory(a.id) as Category) ? 0 : 1;
    const fb = categories.includes(brandCategory(b.id) as Category) ? 0 : 1;
    return fa - fb;
  });

  const back = () => setStep(step - 1);

  if (step === 0) return <Welcome onStart={() => setStep(1)} onSkip={onClose} />;

  return (
    <div className="onb" role="dialog" aria-modal="true" aria-label="Your shopping interests">
      <header className="onb__top">
        <div className="onb__bar">
          <button type="button" className="onb__back" aria-label="Back" onClick={back}>
            <img src={arrowBack} alt="" width={24} height={24} />
          </button>
          <button type="button" className="onb__skip" onClick={onClose}>
            Cancel
          </button>
        </div>
        <div className="onb__progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={position + 1} aria-label={`Step ${position + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i <= position ? 'is-on' : undefined} />
          ))}
        </div>
      </header>

      <div className="onb__body" key={step}>
        {step === 1 && (
          <>
            <h1 className="onb__title">What do you like to shop?</h1>
            <p className="onb__sub">Pick as many as you like. We use this to sort the stores on your trips.</p>
            <div className="onb__cats" role="group" aria-label="Store types">
              {CATEGORY_OPTIONS.map((o, i) => {
                const on = categories.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    className={`cat-card${on ? ' is-on' : ''}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => setCategories((c) => toggle(c, o.value))}
                  >
                    <span className="cat-card__icon">
                      <CategoryIcon category={o.value} />
                    </span>
                    <span className="cat-card__label">{o.value}</span>
                    <span className="cat-card__hint">{o.hint}</span>
                    <span className="cat-card__check">{on && <Check />}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="onb__title">Any favorite brands?</h1>
            <p className="onb__sub">Stores of the brands you pick will appear at the top.</p>
            <div className="onb__brands" role="group" aria-label="Brands">
              {sortedBrands.map((b, i) => {
                const on = brands.includes(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    className={`brand-tile${on ? ' is-on' : ''}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() => setBrands((l) => toggle(l, b.id))}
                  >
                    <span className="brand-tile__logo">
                      <img src={b.logo} alt="" draggable={false} />
                    </span>
                    <span className="brand-tile__name">{b.name}</span>
                    <span className="brand-tile__check">{on && <Check />}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <footer className="onb__footer">
        {step === 1 && (
          <button type="button" className="btn-primary" onClick={() => setStep(2)}>
            Continue
          </button>
        )}
        {step === 2 && (
          <button type="button" className="btn-primary" onClick={() => onFinish({ categories, brands })}>
            Save
          </button>
        )}
      </footer>
    </div>
  );
}
