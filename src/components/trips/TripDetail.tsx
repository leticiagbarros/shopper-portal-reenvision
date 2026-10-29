import { useEffect, useRef, useState } from 'react';
import { brandOfStore, matchScore, type Category, type City, type Preferences, type Store } from '../../data/places';
import { CategoryIcon, Check, Directions, Plus } from './icons';
import { SwipeRow } from './SwipeRow';

interface Props {
  city: City;
  cityStores: Store[];
  visible: Store[];
  saved: string[];
  done: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  category: Category | 'All';
  onCategory: (c: Category | 'All') => void;
  onToggle: (id: string) => void;
  onToggleDone: (id: string) => void;
  prefs: Preferences;
  onEditInterests: () => void;
}

// Google Maps URLs API: opens turn-by-turn directions in the Maps app or site.
function directionsUrl(store: Store, city: City) {
  const destination = encodeURIComponent(`${store.name}, ${store.address}, ${city.name}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

function StoreCard({
  store,
  city,
  mode,
  saved,
  done,
  match,
  selected,
  onSelect,
  onToggle,
}: {
  store: Store;
  city: City;
  mode: 'browse' | 'trip';
  saved: boolean;
  done: boolean;
  match?: string;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const brand = brandOfStore(store.id);
  return (
    <div
      data-store-id={store.id}
      className={`store-card${mode === 'trip' && done ? ' is-done' : ''}${match ? ' has-match' : ''}${selected ? ' is-selected' : ''}`}
      style={match ? ({ '--tag-w': `${match.length * 9 + 30}px` } as React.CSSProperties) : undefined}
    >
      {match && <span className="badge badge--match">{match}</span>}
      <div className="store-card__top">
        <div
          className="store-card__main"
          role="button"
          tabIndex={0}
          aria-label={`Show ${store.name} on the map`}
          aria-pressed={selected}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect();
            }
          }}
        >
          {brand ? (
            <span className="store-card__icon store-card__icon--logo">
              <img src={brand.logo} alt="" draggable={false} />
            </span>
          ) : (
            <span className="store-card__icon">
              <CategoryIcon category={store.category} />
            </span>
          )}
          <span className="store-card__text">
            <span className="store-card__name">{store.name}</span>
            <span className="store-card__sub">
              {store.category} · {store.address}
            </span>
            <span className="store-card__tax">Min. spend {city.minSpend}</span>
          </span>
        </div>
        {mode === 'browse' ? (
          <button
            type="button"
            className={`store-card__add${saved ? ' is-saved' : ''}`}
            aria-label={saved ? `Remove ${store.name} from trip` : `Add ${store.name} to trip`}
            aria-pressed={saved}
            onClick={onToggle}
          >
            {saved ? <Check /> : <Plus />}
          </button>
        ) : (
          <button
            type="button"
            role="checkbox"
            className={`store-card__check${done ? ' is-done' : ''}`}
            aria-label={`Mark ${store.name} as visited`}
            aria-checked={done}
            onClick={onToggle}
          >
            {done && <Check />}
          </button>
        )}
      </div>
      <a
        className="store-card__directions"
        href={directionsUrl(store, city)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Directions />
        Directions
      </a>
    </div>
  );
}

export function TripDetail({
  city,
  cityStores,
  visible,
  saved,
  done,
  selectedId,
  onSelect,
  category,
  onCategory,
  onToggle,
  onToggleDone,
  prefs,
  onEditInterests,
}: Props) {
  const [segment, setSegment] = useState<'stores' | 'saved'>('stores');
  const categories = ['All', ...Array.from(new Set(cityStores.map((s) => s.category)))] as (Category | 'All')[];
  const hasPrefs = prefs.categories.length > 0 || prefs.brands.length > 0;
  // Best matches first; Array.sort is stable so equal scores keep their order.
  const ranked = hasPrefs ? [...visible].sort((a, b) => matchScore(b, prefs).score - matchScore(a, prefs).score) : visible;
  const list = segment === 'stores' ? ranked : cityStores.filter((s) => saved.includes(s.id));
  const rootRef = useRef<HTMLDivElement>(null);

  // Tapping a pin brings the matching card into view.
  useEffect(() => {
    if (!selectedId) return;
    rootRef.current?.querySelector(`[data-store-id="${selectedId}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  return (
    <div className="trip-detail" ref={rootRef}>
      <div className="segments" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'stores'}
          className={segment === 'stores' ? 'is-active' : undefined}
          onClick={() => setSegment('stores')}
        >
          Tax Free stores
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={segment === 'saved'}
          className={segment === 'saved' ? 'is-active' : undefined}
          onClick={() => setSegment('saved')}
        >
          My trip ({saved.length})
        </button>
      </div>

      {segment === 'stores' && (
        <div className="chips" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${c === category ? ' is-active' : ''}`}
              onClick={() => onCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {segment === 'stores' && hasPrefs && list.length > 0 && (
        <p className="interests-hint">
          <span>Sorted by your interests</span>
          <button type="button" onClick={onEditInterests}>
            Edit
          </button>
        </p>
      )}

      {list.length === 0 && (
        <p className="trip-list__empty">
          {segment === 'stores'
            ? 'No stores match your search.'
            : `Add the Tax Free stores you plan to visit in ${city.name}.`}
        </p>
      )}

      {segment === 'saved' && list.length > 0 && (
        <p className="question__hint">
          Check a store once you have shopped there. Swipe left to remove it from your trip.
        </p>
      )}

      {list.map((store) =>
        segment === 'stores' ? (
          <StoreCard
            key={store.id}
            store={store}
            city={city}
            mode="browse"
            saved={saved.includes(store.id)}
            done={false}
            match={matchScore(store, prefs).reason}
            selected={store.id === selectedId}
            onSelect={() => onSelect(store.id)}
            onToggle={() => onToggle(store.id)}
          />
        ) : (
          <SwipeRow key={store.id} label={store.name} actionLabel="Remove" onDelete={() => onToggle(store.id)}>
            <StoreCard
              store={store}
              city={city}
              mode="trip"
              saved
              done={done.includes(store.id)}
              selected={store.id === selectedId}
              onSelect={() => onSelect(store.id)}
              onToggle={() => onToggleDone(store.id)}
            />
          </SwipeRow>
        ),
      )}
    </div>
  );
}
