import { useState } from 'react';
import { AIRPORTS, CITIES, EXTRA_COUNTRIES, type Airport, type City } from '../../data/places';

interface Props {
  onCreate: (cityId: string, otherCountries: string[], exitAirport: string, start: string, end: string) => void;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function CreateTrip({ onCreate }: Props) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [moreCountries, setMoreCountries] = useState<boolean | null>(null);
  const [others, setOthers] = useState<string[]>([]);
  const [airportQuery, setAirportQuery] = useState('');
  const [airport, setAirport] = useState<Airport | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const q = query.trim().toLowerCase();
  const suggestions = city ? [] : CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
  const datesValid = ISO_DATE.test(start) && ISO_DATE.test(end) && end >= start;

  // The last exit airport can only be in a country the shopper is visiting.
  const visited = city ? [city.country, ...others] : [];
  const aq = airportQuery.trim().toLowerCase();
  const airportOptions = AIRPORTS.filter(
    (a) =>
      visited.includes(a.country) &&
      (!aq || [a.code, a.name, a.city, a.country].some((v) => v.toLowerCase().includes(aq))),
  );
  const airportStepReady = moreCountries === false || (moreCountries === true && others.length > 0);
  const canCreate = city !== null && airportStepReady && airport !== null && datesValid;

  const pick = (c: City) => {
    setCity(c);
  };

  const changeDestination = () => {
    setCity(null);
    setQuery('');
    setMoreCountries(null);
    setOthers([]);
    setAirport(null);
    setAirportQuery('');
  };

  const answerMore = (value: boolean) => {
    setMoreCountries(value);
    if (!value) setOthers([]);
    setAirport(null);
    setAirportQuery('');
  };

  const toggleCountry = (country: string) => {
    setOthers((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]));
    setAirport(null);
  };

  return (
    <form
      className="create-trip"
      onSubmit={(e) => {
        e.preventDefault();
        if (city && airportStepReady && airport && datesValid) {
          onCreate(city.id, others, airport.code, start, end);
        }
      }}
    >
      {!city && (
        <label className="field">
          <span className="field__label">Where are you going?</span>
          <input
            className="field__input"
            type="text"
            value={query}
            placeholder="Search a city, e.g. Lisbon"
            autoComplete="off"
            maxLength={40}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      )}

      {city && (
        <div className="destination">
          <img
            className="suggestions__dot"
            src={city.image}
            alt=""
            style={{ objectPosition: city.imagePosition }}
            draggable={false}
          />
          <span className="destination__text">
            <span className="field__label">Going to</span>
            <span className="suggestions__name">
              {city.name}, {city.country}
            </span>
          </span>
          <button type="button" className="destination__change" onClick={changeDestination}>
            Change
          </button>
        </div>
      )}

      {!city && (
        <ul className="suggestions" aria-label="Destinations">
          {suggestions.length === 0 && <li className="suggestions__empty">No Tax Free destinations match yet.</li>}
          {suggestions.map((c) => (
            <li key={c.id}>
              <button type="button" className="suggestions__item" onClick={() => pick(c)}>
                <img
                  className="suggestions__dot"
                  src={c.image}
                  alt=""
                  style={{ objectPosition: c.imagePosition }}
                  draggable={false}
                />
                <span>
                  <span className="suggestions__name">{c.name}</span>
                  <span className="suggestions__country">{c.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {city && (
        <>
          <div className="question">
            <span className="field__label">Are you visiting other countries on this trip?</span>
            <div className="segments" role="group">
              <button
                type="button"
                className={moreCountries === false ? 'is-active' : undefined}
                aria-pressed={moreCountries === false}
                onClick={() => answerMore(false)}
              >
                No, only {city.country}
              </button>
              <button
                type="button"
                className={moreCountries === true ? 'is-active' : undefined}
                aria-pressed={moreCountries === true}
                onClick={() => answerMore(true)}
              >
                Yes
              </button>
            </div>
          </div>

          {moreCountries === true && (
            <div className="question">
              <span className="field__label">Which other countries?</span>
              <div className="chips chips--wrap" role="group" aria-label="Other countries">
                {EXTRA_COUNTRIES.filter((c) => c !== city.country).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip${others.includes(c) ? ' is-active' : ''}`}
                    aria-pressed={others.includes(c)}
                    onClick={() => toggleCountry(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {airportStepReady && (
            <div className="question">
              <span className="field__label">Last exit airport</span>
              <p className="question__hint">
                The last airport you will fly from before leaving. Your Tax Free goods are validated there.
              </p>
              {airport ? (
                <div className="destination">
                  <span className="airport-code">{airport.code}</span>
                  <span className="destination__text">
                    <span className="suggestions__name">{airport.name}</span>
                    <span className="suggestions__country">
                      {airport.city}, {airport.country}
                    </span>
                  </span>
                  <button type="button" className="destination__change" onClick={() => setAirport(null)}>
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    className="field__input"
                    type="text"
                    value={airportQuery}
                    placeholder="Search airport or code, e.g. LIS"
                    autoComplete="off"
                    maxLength={40}
                    onChange={(e) => setAirportQuery(e.target.value)}
                  />
                  <ul className="suggestions" aria-label="Airports">
                    {airportOptions.length === 0 && <li className="suggestions__empty">No airports match.</li>}
                    {airportOptions.map((a) => (
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
                </>
              )}
            </div>
          )}

          {airport && (
            <div className="field-row">
              <label className="field">
                <span className="field__label">From</span>
                <input
                  className="field__input"
                  type="date"
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                    if (end && e.target.value > end) setEnd(e.target.value);
                  }}
                />
              </label>
              <label className="field">
                <span className="field__label">To</span>
                <input
                  className="field__input"
                  type="date"
                  value={end}
                  min={start || undefined}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </label>
            </div>
          )}

          {airport && (
            <button type="submit" className="btn-primary" disabled={!canCreate}>
              Create trip
            </button>
          )}
        </>
      )}
    </form>
  );
}
