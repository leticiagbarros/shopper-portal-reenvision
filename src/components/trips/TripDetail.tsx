import { useEffect, useRef, useState } from 'react';
import { STORES, brandOfStore, cityById, distanceLabel, matchScore, type Category, type City, type Preferences, type Store } from '../../data/places';
import { offerForStore, OFFERS, type Offer } from '../../data/offers';
import { CategoryIcon, Check, Directions, Plus } from './icons';
import { SwipeRow } from './SwipeRow';
import chevron from '../../assets/icons/chevron.svg';

const TicketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8a2 2 0 0 0 0 8v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a2 2 0 0 1 0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2Z" />
    <path d="M14 5v3M14 11v2M14 16v3" />
  </svg>
);

interface Props {
  city: City;
  cityStores: Store[];
  visible: Store[];
  saved: string[];
  done: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  category: Category | 'All' | 'Vouchers';
  onCategory: (c: Category | 'All' | 'Vouchers') => void;
  onOpenOffer: (offer: Offer) => void;
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
  offer,
  onOpenOffer,
  readOnly = false,
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
  offer?: Offer;
  onOpenOffer: (offer: Offer) => void;
  /** A store from another city: it can't be shown on this trip's map. */
  readOnly?: boolean;
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
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly ? undefined : 0}
          aria-label={readOnly ? undefined : `Show ${store.name} on the map`}
          aria-pressed={readOnly ? undefined : selected}
          onClick={readOnly ? undefined : onSelect}
          onKeyDown={
            readOnly
              ? undefined
              : (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect();
                  }
                }
          }
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
              {store.category} · {readOnly ? city.name : distanceLabel(store, city)}
            </span>
          </span>
        </div>
        {mode === 'browse' && (
          <button
            type="button"
            className={`store-card__add${saved ? ' is-saved' : ''}`}
            aria-label={saved ? `Remove ${store.name} from trip` : `Add ${store.name} to trip`}
            aria-pressed={saved}
            onClick={onToggle}
          >
            {saved ? <Check /> : <Plus />}
          </button>
        )}
      </div>
      <div className="store-card__actions">
        <a
          className="store-card__directions"
          href={directionsUrl(store, city)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Directions />
          Directions
        </a>
        {offer && (
          <button type="button" className="store-card__voucher" aria-label={`View voucher: ${offer.value} ${offer.unit} at ${offer.brand}`} onClick={() => onOpenOffer(offer)}>
            <TicketIcon />
            {offer.value} {offer.unit}
          </button>
        )}
      </div>
      {offer && (
        <button type="button" className="store-card__rules" onClick={() => onOpenOffer(offer)}>
          See voucher rules
          <img src={chevron} alt="" width={16} height={16} />
        </button>
      )}
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
  onOpenOffer,
  prefs,
  onEditInterests,
}: Props) {
  const [segment, setSegment] = useState<'stores' | 'saved'>('stores');
  const hasVouchers = OFFERS.length > 0;
  const showOffers = segment === 'stores' && category === 'Vouchers';
  // One card per offer, on the store that honours it; this trip's city first.
  const offerStores = OFFERS.flatMap((offer) => {
    const store = STORES.find((s) => offerForStore(s)?.id === offer.id);
    return store ? [{ offer, store }] : [];
  }).sort((a, b) => Number(b.store.cityId === city.id) - Number(a.store.cityId === city.id));
  const categories = [
    'All',
    ...(hasVouchers ? ['Vouchers'] : []),
    ...Array.from(new Set(cityStores.map((s) => s.category))),
  ] as (Category | 'All' | 'Vouchers')[];
  const hasPrefs = prefs.categories.length > 0 || prefs.brands.length > 0;
  // Best matches first; Array.sort is stable so equal scores keep their order.
  const ranked = hasPrefs ? [...visible].sort((a, b) => matchScore(b, prefs).score - matchScore(a, prefs).score) : visible;
  const list = segment === 'stores' ? ranked : STORES.filter((s) => saved.includes(s.id));
  const rootRef = useRef<HTMLDivElement>(null);

  // Tapping a pin brings the matching card into view.
  useEffect(() => {
    if (!selectedId) return;
    rootRef.current?.querySelector(`[data-store-id="${selectedId}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
              {c === 'Vouchers' ? 'Offers' : c}
            </button>
          ))}
        </div>
      )}

      {segment === 'stores' && hasPrefs && !showOffers && list.length > 0 && (
        <p className="interests-hint">
          <span>Sorted by your interests</span>
          <button type="button" onClick={onEditInterests}>
            Edit
          </button>
        </p>
      )}

      {list.length === 0 && !showOffers && (
        <p className="trip-list__empty">
          {segment === 'stores'
            ? 'No stores match your search.'
            : `Add the Tax Free stores you plan to visit in ${city.name}.`}
        </p>
      )}

      {segment === 'saved' && list.length > 0 && (
        <p className="question__hint">Swipe left to remove a store from your trip.</p>
      )}

      {showOffers &&
        offerStores.map(({ offer, store }) => {
          const storeCity = cityById(store.cityId) ?? city;
          const here = store.cityId === city.id;
          return (
            <StoreCard
              key={store.id}
              store={store}
              city={storeCity}
              mode="browse"
              saved={saved.includes(store.id)}
              done={false}
              selected={store.id === selectedId}
              onSelect={() => onSelect(store.id)}
              onToggle={() => onToggle(store.id)}
              offer={offer}
              onOpenOffer={onOpenOffer}
              readOnly={!here}
            />
          );
        })}

      {!showOffers && list.map((store) =>
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
            offer={offerForStore(store)}
            onOpenOffer={onOpenOffer}
          />
        ) : (
          <SwipeRow key={store.id} label={store.name} actionLabel="Remove" onDelete={() => onToggle(store.id)}>
            <StoreCard
              store={store}
              city={cityById(store.cityId) ?? city}
              mode="trip"
              saved
              done={done.includes(store.id)}
              selected={store.id === selectedId}
              onSelect={() => onSelect(store.id)}
              onToggle={() => onToggleDone(store.id)}
              offer={offerForStore(store)}
              onOpenOffer={onOpenOffer}
              readOnly={store.cityId !== city.id}
            />
          </SwipeRow>
        ),
      )}
    </div>
  );
}
