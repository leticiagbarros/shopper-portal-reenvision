import { useEffect, useRef, useState } from 'react';
import '../guide.css';
import chevron from '../assets/icons/chevron-right.svg';
import { AIRPORTS, airportByCode, cityById, formatRange, type Airport, type Trip } from '../data/places';
import {
  FORMS,
  daysLeft,
  getPlan,
  getRoutePlan,
  type BagHandling,
  type GoodsLocation,
  type Method,
  type PlanKind,
  type RefundForm,
} from '../data/guidance';
import { ArrowLeft, Check, Directions, Sparkle } from './trips/icons';

const tagIcon = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const StampIcon = () => (
  <svg {...tagIcon}>
    <path d="M12 3 4.500 6v5.500c0 4.500 3 8 7.500 9.500 4.500-1.500 7.500-5 7.500-9.500V6L12 3Z" />
    <path d="m9 12 2.200 2.200L15.500 10" />
  </svg>
);
const PhoneIcon = () => (
  <svg {...tagIcon}>
    <rect x="7" y="2.500" width="10" height="19" rx="2.500" />
    <path d="M11 18.500h2" />
  </svg>
);
const PlaneIcon = () => (
  <svg {...tagIcon}>
    <path d="M3 13.500 21 4l-5 16-4-6.500-9 0Z" />
    <path d="m12 13.500 9-9.500" />
  </svg>
);
const ClockIcon = () => (
  <svg {...tagIcon}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const AlertIcon = () => (
  <svg {...tagIcon}>
    <path d="M12 4 2.500 20h19L12 4Z" />
    <path d="M12 10v4.500M12 17.500h.01" />
  </svg>
);
const UploadIcon = () => (
  <svg {...tagIcon} width={18} height={18}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);
const PinIcon = () => (
  <svg {...tagIcon} width={18} height={18}>
    <path d="M12 21s-6.500-5.600-6.500-11a6.500 6.500 0 0 1 13 0c0 5.400-6.500 11-6.500 11Z" />
    <circle cx="12" cy="10" r="2.300" />
  </svg>
);

const METHOD_ICON: Record<Method, React.ReactNode> = {
  digital: <PhoneIcon />,
  customs: <StampIcon />,
  'outside-eu': <PlaneIcon />,
};

const KIND_ICON: Record<PlanKind, React.ReactNode> = {
  digital: <PhoneIcon />,
  customs: <StampIcon />,
  'outside-eu': <PlaneIcon />,
  mixed: <StampIcon />,
  wait: <ClockIcon />,
  early: <AlertIcon />,
};

const GOODS_OPTIONS: { value: GoodsLocation; label: string }[] = [
  { value: 'hand', label: 'In my hand luggage' },
  { value: 'checked', label: 'In my checked luggage' },
  { value: 'unpacked', label: 'Not packed yet' },
];

const BAG_OPTIONS = (exit: Airport): { value: BagHandling; label: string }[] => [
  { value: 'hand', label: 'Hand luggage only' },
  { value: 'collect', label: `Checked, I collect it in ${exit.country}` },
  { value: 'through', label: 'Checked through to my final destination' },
];

const METHOD_LABEL: Record<Method, string> = {
  digital: 'Digital stamp',
  customs: 'Customs desk',
  'outside-eu': 'Earlier EU airport',
};

function useTypewriter(text: string, active: boolean) {
  const [count, setCount] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    setCount(0);
    if (!active) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active]);

  return { text: words.slice(0, count).join(' '), done: active && count >= words.length };
}

function Ai({ children }: { children: React.ReactNode }) {
  return (
    <div className="msg msg--ai guide-rise">
      <span className="msg__avatar">
        <Sparkle />
      </span>
      <p>{children}</p>
    </div>
  );
}

function User({ children }: { children: React.ReactNode }) {
  return <p className="msg msg--user guide-rise">{children}</p>;
}

interface Props {
  trips: Trip[];
  onBack: () => void;
  onAskAi: () => void;
  /** Forms to guide; defaults to every form that needs validation. */
  forms?: RefundForm[];
  /** Shown as the main action when the plan needs a stamped form upload. */
  /** Name of the stamped form already uploaded for these forms. */
  uploaded?: string;
  /** Enables the stamped form upload when the plan needs a customs stamp. */
  onUpload?: (fileName: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_BYTES = 10 * 1024 * 1024;

export function ValidationGuide({ trips, onBack, onAskAi, forms: formsIn = FORMS, uploaded, onUpload }: Props) {
  // Most urgent first everywhere, so the order matches the instructions.
  const forms = [...formsIn].sort((a, b) => daysLeft(a.purchaseDate) - daysLeft(b.purchaseDate));
  const [airport, setAirport] = useState<Airport | null>(null);
  const [pickOther, setPickOther] = useState(false);
  const [query, setQuery] = useState('');
  const [goods, setGoods] = useState<GoodsLocation | null>(null);
  const [here, setHere] = useState<string | null>(null);
  const [bag, setBag] = useState<BagHandling | null>(null);
  const [ready, setReady] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const trip = trips[0];
  const suggested = trip ? airportByCode(trip.exitAirport) : undefined;
  const tripCity = trip ? cityById(trip.cityId) : undefined;
  const hereMap = new Map(
    forms.map((f) => {
      const c = cityById(f.cityId);
      return [c?.country ?? '', `${c?.name}, ${c?.country}`] as const;
    }),
  );
  if (airport && !hereMap.has(airport.country)) hereMap.set(airport.country, `${airport.city}, ${airport.country}`);
  const hereOptions = Array.from(hereMap);
  const atExit = airport !== null && here === airport.country;
  const plan =
    airport && here && atExit && goods
      ? getPlan(forms, airport, goods)
      : airport && here && !atExit && bag
        ? getRoutePlan(forms, airport, here, bag)
        : null;
  const answered = plan !== null;
  const typed = useTypewriter(plan?.summary ?? '', ready && plan !== null);
  const many = forms.length > 1;

  useEffect(() => {
    if (!answered) {
      setReady(false);
      return;
    }
    const id = window.setTimeout(() => setReady(true), 1100);
    return () => window.clearTimeout(id);
  }, [answered, goods, bag]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [airport, pickOther, here, goods, bag, ready, typed.done]);

  const reset = () => {
    setAirport(null);
    setPickOther(false);
    setQuery('');
    setGoods(null);
    setHere(null);
    setBag(null);
  };

  const q = query.trim().toLowerCase();
  const options = AIRPORTS.filter(
    (a) => !q || [a.code, a.name, a.city, a.country].some((v) => v.toLowerCase().includes(q)),
  ).slice(0, 6);

  const perForm = plan !== null && plan.forms.some((f) => f.where || f.upload);
  const needsUpload = onUpload !== undefined && plan !== null && plan.forms.some((f) => f.method === 'customs');
  const [cardUploads, setCardUploads] = useState<Record<string, string>>({});
  const pendingCard = useRef<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const card = pendingCard.current;
    pendingCard.current = null;
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
      setUploadError('Upload a JPG, PNG or PDF up to 10 MB.');
      return;
    }
    setUploadError(null);
    if (card) setCardUploads((prev) => ({ ...prev, [card]: file.name }));
    else onUpload?.(file.name);
  };

  const pickFor = (formId: string) => {
    pendingCard.current = formId;
    fileRef.current?.click();
  };

  return (
    <main className="screen" aria-label="Next step">
      <div className="screen__content guide">
        <div className="page-head">
          <button type="button" className="icon-btn" aria-label="Back to My refunds" onClick={onBack}>
            <ArrowLeft />
          </button>
          <div className="page-head__title">
            <h1>Next step</h1>
          </div>
        </div>

        <section className="form-summary" aria-label="Forms to validate">
          <span className="form-summary__status">
            <StampIcon />
            {many ? `${forms.length} forms need customs validation` : 'Needs customs validation'}
          </span>
          {forms.map((f) => {
            const city = cityById(f.cityId);
            return (
              <div className="form-summary__item" key={f.id}>
                <div className="form-summary__row">
                  <span className="form-summary__merchant">{f.merchant}</span>
                  <span className="form-summary__amount">{f.amount}</span>
                </div>
                <p className="form-summary__meta">
                  Bought in {city?.name}, {city?.country} · {formatRange(f.purchaseDate, f.purchaseDate)}
                </p>
              </div>
            );
          })}
        </section>

        <div className="guide__thread" aria-live="polite">
          <Ai>
            Hi John! I will help you validate your {many ? `${forms.length} forms` : 'form'} (
            {forms.map((f) => `${f.merchant} ${f.amount}`).join(', ')}). A few quick questions and you will know exactly
            what to do.
          </Ai>
          <Ai>Which airport will you fly from at the end of your trip?</Ai>

          {airport ? (
            <User>
              {airport.code} · {airport.name}
            </User>
          ) : (
            <div className="quick guide-rise">
              {suggested && !pickOther && (
                <button type="button" className="quick__chip quick__chip--main" onClick={() => setAirport(suggested)}>
                  {suggested.code} · {suggested.city}
                  <small>
                    From your {tripCity?.name} trip{trip ? `, ${formatRange(trip.start, trip.end)}` : ''}
                  </small>
                </button>
              )}
              {!pickOther && (
                <button type="button" className="quick__chip" onClick={() => setPickOther(true)}>
                  {suggested ? 'Another airport' : 'Choose an airport'}
                </button>
              )}
              {pickOther && (
                <div className="quick__search">
                  <input
                    className="field__input"
                    type="text"
                    value={query}
                    placeholder="Search airport or code"
                    autoComplete="off"
                    maxLength={40}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <ul className="suggestions" aria-label="Airports">
                    {options.length === 0 && <li className="suggestions__empty">No airports match.</li>}
                    {options.map((a) => (
                      <li key={a.code}>
                        <button type="button" className="suggestions__item" onClick={() => setAirport(a)}>
                          <span className="airport-code">{a.code}</span>
                          <span>
                            <span className="suggestions__name">{a.name}</span>
                            <span className="suggestions__country">
                              {a.city}, {a.country}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {airport && <Ai>Where are you right now?</Ai>}
          {airport &&
            (here ? (
              <User>{hereOptions.find(([country]) => country === here)?.[1]}</User>
            ) : (
              <div className="quick guide-rise">
                {hereOptions.map(([country, label]) => (
                  <button key={country} type="button" className="quick__chip" onClick={() => setHere(country)}>
                    {label}
                  </button>
                ))}
              </div>
            ))}

          {airport && here && atExit && <Ai>Where are your goods right now?</Ai>}
          {airport &&
            here &&
            atExit &&
            (goods ? (
              <User>{GOODS_OPTIONS.find((o) => o.value === goods)?.label}</User>
            ) : (
              <div className="quick guide-rise">
                {GOODS_OPTIONS.map((o) => (
                  <button key={o.value} type="button" className="quick__chip" onClick={() => setGoods(o.value)}>
                    {o.label}
                  </button>
                ))}
              </div>
            ))}

          {airport && here && !atExit && (
            <Ai>
              You leave the EU from {airport.code} in {airport.country}, not from {here}. How will your bag travel until
              then?
            </Ai>
          )}
          {airport &&
            here &&
            !atExit &&
            (bag ? (
              <User>{BAG_OPTIONS(airport).find((o) => o.value === bag)?.label}</User>
            ) : (
              <div className="quick guide-rise">
                {BAG_OPTIONS(airport).map((o) => (
                  <button key={o.value} type="button" className="quick__chip" onClick={() => setBag(o.value)}>
                    {o.label}
                  </button>
                ))}
              </div>
            ))}

          {answered && !ready && (
            <div className="msg msg--ai guide-rise" aria-label="Preparing your plan">
              <span className="msg__avatar">
                <Sparkle />
              </span>
              <p className="typing">
                <span />
                <span />
                <span />
              </p>
            </div>
          )}

          {plan && ready && (
            <section className="plan guide-rise" aria-label="Your plan">
              <header className="plan__head">
                <span className={`plan__badge plan__badge--${plan.kind}`}>
                  {KIND_ICON[plan.kind]}
                  {plan.headline}
                </span>
              </header>
              <p className="plan__summary">{typed.text}</p>

              {typed.done && (
                <>
                  <ul className={`plan__forms${perForm ? ' plan__forms--stops' : ''}`} aria-label="Forms">
                    {plan.forms.map((f, i) => {
                      const first = many && i === 0 && f.daysLeft < plan.forms[1].daysLeft;
                      return (
                        <li key={f.form.id} style={{ animationDelay: '0ms' }}>
                          {perForm && (
                            <span className="plan__rail" aria-hidden="true">
                              <span className="plan__num">{i + 1}</span>
                            </span>
                          )}
                          <div className="plan__card">
                            <span className="plan__form-top">
                              <strong>{f.form.merchant}</strong>
                              <span className="plan__pill">
                                {METHOD_ICON[f.method]}
                                {METHOD_LABEL[f.method]}
                              </span>
                            </span>
                            <span className="plan__form-meta">
                              {f.place} · {f.form.amount}
                            </span>
                            <span className={`plan__due${first ? ' is-first' : ''}`}>
                              <ClockIcon />
                              {f.daysLeft} days left
                            </span>
                            {f.upload &&
                              (cardUploads[f.form.id] ? (
                                <p className="plan__card-uploaded" role="status">
                                  <Check />
                                  <span>
                                    Stamped form uploaded
                                    <small>{cardUploads[f.form.id]}</small>
                                  </span>
                                  <button type="button" onClick={() => pickFor(f.form.id)}>
                                    Change
                                  </button>
                                </p>
                              ) : (
                                <button type="button" className="plan__upload" onClick={() => pickFor(f.form.id)}>
                                  <UploadIcon />
                                  Upload stamped form
                                </button>
                              ))}
                            {f.where && (
                              <div className="plan__where">
                                <PinIcon />
                                <span>
                                  <small>Where to validate</small>
                                  {f.where}
                                </span>
                              </div>
                            )}
                            {f.steps && (
                              <ul className="plan__todo" aria-label={`What to do for ${f.form.merchant}`}>
                                {f.steps.map((s) => (
                                  <li key={s}>{s}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {plan.before && (
                    <div className="plan__section">
                      <h3>{plan.before.title}</h3>
                      <ol className="plan__steps">
                        {plan.before.steps.map((s, i) => (
                          <li key={s} style={{ animationDelay: `${i * 120}ms` }}>
                            <span className="plan__num">{i + 1}</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="plan__section">
                    {(perForm ? 'Before you go' : plan.stepsTitle) && <h3>{perForm ? 'Before you go' : plan.stepsTitle}</h3>}
                    <ol className={`plan__steps${perForm ? ' plan__steps--plain' : ''}`}>
                      {plan.steps.map((s, i) => (
                        <li key={s} style={{ animationDelay: `${i * 120}ms` }}>
                          <span className="plan__num">{i + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <a
                    className="plan__directions"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${plan.airport.name}, ${plan.airport.city}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Directions />
                    Directions to {plan.airport.code}
                  </a>

                  <details className="plan__why">
                    <summary>
                      Why this plan?
                      <img src={chevron} alt="" width={16} height={16} />
                    </summary>
                    <ul>
                      {plan.reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <p>
                      Based on the{' '}
                      <a href="https://taxassist.weareplanet.com/en" target="_blank" rel="noopener noreferrer">
                        Tax Free validation guide
                      </a>
                      . Airport and country data is sample data in this prototype.
                    </p>
                  </details>

                  {needsUpload && uploaded && (
                    <p className="plan__uploaded" role="status">
                      <Check />
                      <span>
                        Stamped form uploaded
                        <small>{uploaded}</small>
                      </span>
                    </p>
                  )}
                  {uploadError && (
                    <p className="plan__error" role="alert">
                      {uploadError}
                    </p>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    hidden
                    onChange={handleFile}
                  />

                  <div className="plan__actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={needsUpload && !uploaded ? () => fileRef.current?.click() : onBack}
                    >
                      {needsUpload && !uploaded ? 'Upload stamped form' : 'Done'}
                    </button>
                    <button type="button" className="plan__secondary" onClick={onAskAi}>
                      <Sparkle />
                      Ask Tax Free AI
                    </button>
                  </div>
                  <button type="button" className="plan__restart" onClick={reset}>
                    Start over
                  </button>
                </>
              )}
            </section>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </main>
  );
}
