import { useEffect, useRef, useState } from 'react';
import '../taxfree.css';
import { STORES, airportByCode, cityById, formatRange, type Trip } from '../data/places';
import { Check, ChevronDown, ExternalLink, Send, Sparkle } from './trips/icons';

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'What is the minimum spend?',
  'Where do I validate my receipts?',
  'What documents do I need?',
  'When will I get my refund?',
];

// Prototype only: canned answers built from the selected trip, no AI backend behind it.
function reply(question: string, trip?: Trip): string {
  const t = question.toLowerCase();
  const city = trip ? cityById(trip.cityId) : undefined;
  const airport = trip ? airportByCode(trip.exitAirport) : undefined;
  const others = trip?.otherCountries ?? [];

  if (/minimum|min\.|spend|how much/.test(t)) {
    return city
      ? `For ${city.name}, the minimum spend is ${city.minSpend} per purchase receipt. Check it before you pay, so the receipt qualifies for Tax Free.`
      : 'The minimum spend depends on the country, per purchase receipt. Pick a trip above and I will tell you the amount for your destination.';
  }
  if (/validat|customs|stamp|airport|exit/.test(t)) {
    const place = airport ? `${airport.name} (${airport.code})` : 'your last exit airport';
    const extra = others.length
      ? ` Your trip also includes ${others.join(', ')}, so validate once, at your last exit airport, not in every country.`
      : '';
    return `Validate at ${place}. Go to the customs or Tax Free validation point before you check in your luggage, with your passport, boarding pass, receipts and the unused goods.${extra}`;
  }
  if (/document|passport|bring|need|receipt/.test(t)) {
    return 'Bring your passport, boarding pass, the original Tax Free forms and receipts, and the goods unused and in their original packaging. Keep them in your hand luggage until validation.';
  }
  if (/refund|money|when|how long|card/.test(t)) {
    return 'After your goods are validated, the refund is sent to your chosen method. You can follow every step in My refunds, where each purchase shows its current status.';
  }
  if (/countr/.test(t)) {
    return others.length
      ? `Your trip covers ${city?.country} and ${others.join(', ')}. Your last exit airport is ${airport?.name ?? 'not set'}, and that is where validation happens.`
      : `Your trip only covers ${city?.country ?? 'one country'}. If you add more countries, the last airport you leave from is where you validate.`;
  }
  if (/store|shop|where|buy/.test(t)) {
    if (!trip || !city) return 'Pick a trip above and I will list your saved Tax Free stores.';
    const saved = STORES.filter((s) => trip.saved.includes(s.id));
    return saved.length
      ? `You saved ${saved.length} store${saved.length > 1 ? 's' : ''} in ${city.name}: ${saved.map((s) => s.name).join(', ')}. You have visited ${trip.done.length} so far.`
      : `You have not saved any store in ${city.name} yet. Open My trips, choose ${city.name}, and add Tax Free stores from the list.`;
  }
  if (/trip|summary|plan|date/.test(t)) {
    return trip && city
      ? `${city.name}, ${formatRange(trip.start, trip.end)}. Last exit airport: ${airport?.code ?? 'not set'}. ${trip.saved.length} saved store${trip.saved.length === 1 ? '' : 's'}, ${trip.done.length} visited.`
      : 'You have no trip selected. Create one in My trips and I can use its details to answer you.';
  }
  return 'I can help with minimum spend, where to validate, documents, refund timing and your saved stores. For anything else, open Help in Profile.';
}

type Popover = 'trips' | null;

export function TaxFreeScreen({ trips }: { trips: Trip[] }) {
  const [tripId, setTripId] = useState<string | null>(trips[0]?.id ?? null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [popover, setPopover] = useState<Popover>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const timer = useRef<number>();

  const trip = trips.find((t) => t.id === tripId);
  const city = trip ? cityById(trip.cityId) : undefined;
  const airport = trip ? airportByCode(trip.exitAirport) : undefined;

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, thinking]);
  useEffect(() => {
    if (!popover) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPopover(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popover]);

  const ask = (text: string) => {
    const q = text.trim().slice(0, 300);
    if (!q || thinking) return;
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text: q }]);
    setInput('');
    setThinking(true);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, role: 'assistant', text: reply(q, trip) }]);
      setThinking(false);
    }, 700);
  };

  const resetChat = () => {
    window.clearTimeout(timer.current);
    setThinking(false);
    setMessages([]);
    setInput('');
    setPopover(null);
  };

  const selectTrip = (id: string | null) => {
    setTripId(id);
    resetChat();
  };

  const contextLabel = trip && city ? `${city.name} · ${formatRange(trip.start, trip.end)}` : 'No trip';

  return (
    <main className="screen screen--chat" aria-label="Tax Free">
      <div className="chat">
        {popover && <div className="chat__scrim" onClick={() => setPopover(null)} />}

        <header className="chat__header">
          <div className="chat__heading">
            <h1 className="chat__title">Tax Free AI</h1>
            <button
              type="button"
              className="context-chip"
              aria-haspopup="listbox"
              aria-expanded={popover === 'trips'}
              onClick={() => setPopover(popover === 'trips' ? null : 'trips')}
            >
              {contextLabel}
              <ChevronDown />
            </button>
          </div>

          {popover === 'trips' && (
            <div className="pop pop--trips" role="listbox" aria-label="Trip">
              {trips.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={t.id === tripId}
                  className="pop__item"
                  onClick={() => selectTrip(t.id)}
                >
                  <span className="pop__label">
                    {cityById(t.cityId)?.name} · {formatRange(t.start, t.end)}
                  </span>
                  {t.id === tripId && <Check />}
                </button>
              ))}
              <button
                type="button"
                role="option"
                aria-selected={tripId === null}
                className="pop__item"
                onClick={() => selectTrip(null)}
              >
                <span className="pop__label">No trip</span>
                {tripId === null && <Check />}
              </button>
            </div>
          )}
        </header>

        <div className="chat__body">
          {messages.length === 0 && !thinking ? (
            <div className="welcome">
              <span className="welcome__badge">
                <Sparkle />
              </span>
              <h2 className="welcome__title">How can I help?</h2>
              <p className="welcome__text">
                {trip && city
                  ? `I know your trip to ${city.name}: exit via ${airport?.code ?? 'no airport yet'}, ${trip.saved.length} saved store${trip.saved.length === 1 ? '' : 's'}.`
                  : 'Ask me anything about Tax Free. Pick a trip for answers about your journey.'}
              </p>
              <div className="welcome__suggest">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    className="suggest"
                    style={{ animationDelay: `${420 + i * 110}ms` }}
                    onClick={() => ask(s)}
                  >
                    <span>{s}</span>
                    <ExternalLink />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="thread" aria-live="polite">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <p key={m.id} className="msg msg--user">
                    {m.text}
                  </p>
                ) : (
                  <div key={m.id} className="msg msg--ai">
                    <span className="msg__avatar">
                      <Sparkle />
                    </span>
                    <p>{m.text}</p>
                  </div>
                ),
              )}
              {thinking && (
                <div className="msg msg--ai" aria-label="Assistant is typing">
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
              <p className="thread__note">AI answers can be wrong. Check the validation guide before you fly.</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            className="composer__input"
            type="text"
            value={input}
            maxLength={300}
            placeholder="Ask about Tax Free"
            aria-label="Your question"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="composer__send" aria-label="Send" disabled={!input.trim() || thinking}>
            <Send />
          </button>
        </form>
      </div>
    </main>
  );
}
