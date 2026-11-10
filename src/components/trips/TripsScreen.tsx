import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import '../../trips.css';
import { BottomSheet, type Snap } from './BottomSheet';
import { CreateTrip } from './CreateTrip';
import { offerForStore, type Offer } from '../../data/offers';
import { VouchersButton } from '../Vouchers';
import { ArrowLeft, CategoryIcon, Plus, Search } from './icons';
import { ReminderDialog } from './ReminderDialog';
import { TripDetail } from './TripDetail';
import { TripList } from './TripList';
import { TripMap, type MapScene } from './TripMap';
import { STORES, brandOfStore, cityById, formatRange, type Category, type Preferences, type Reminder, type Store, type Trip } from '../../data/places';

type View = { name: 'list' } | { name: 'create' } | { name: 'trip'; tripId: string };

// 'sheet' is the My trips home with its sheet pulled up.
export type TripsLayer = 'trip' | 'create' | 'dialog' | 'sheet' | null;

interface Props {
  trips: Trip[];
  setTrips: Dispatch<SetStateAction<Trip[]>>;
  onLayerChange: (layer: TripsLayer) => void;
  prefs: Preferences;
  onEditInterests: () => void;
  voucherCount: number;
  onOpenVouchers: () => void;
  onOpenOffer: (offer: Offer) => void;
  /** Opens straight at a view, for presenter navigation. */
  initial?: 'list' | 'trip' | 'create';
}

export function TripsScreen({ trips, setTrips, onLayerChange, prefs, onEditInterests, voucherCount, onOpenVouchers, onOpenOffer, initial = 'list' }: Props) {
  const [view, setView] = useState<View>(() =>
    initial === 'trip' && trips[0] ? { name: 'trip', tripId: trips[0].id } : initial === 'create' ? { name: 'create' } : { name: 'list' },
  );
  const [category, setCategory] = useState<Category | 'All' | 'Vouchers'>('All');
  const [query, setQuery] = useState('');
  const [askReminder, setAskReminder] = useState(false);
  const [snap, setSnap] = useState<Snap>(initial === 'list' ? 'title' : 'half');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [homeQuery, setHomeQuery] = useState('');
  const homeResults = useMemo(() => {
    const q = homeQuery.trim().toLowerCase();
    if (!q) return [];
    return STORES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        brandOfStore(s.id)?.name.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [homeQuery]);
  const trip = view.name === 'trip' ? trips.find((t) => t.id === view.tripId) : undefined;
  const city = trip ? cityById(trip.cityId) : undefined;
  const cityStores = useMemo(() => (city ? STORES.filter((s) => s.cityId === city.id) : []), [city]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cityStores.filter(
      (s) =>
        (category === 'All' || (category === 'Vouchers' ? offerForStore(s) !== undefined : s.category === category)) &&
        (!q || s.name.toLowerCase().includes(q)),
    );
  }, [cityStores, category, query]);

  const scene = useMemo<MapScene | null>(() => {
    if (city && trip) {
      return { kind: 'city', city, stores: visible, savedIds: trip.saved, doneIds: trip.done, selectedId };
    }
    if (view.name !== 'list') return null;
    return {
      kind: 'overview',
      pins: trips.flatMap((t) => {
        const c = cityById(t.cityId);
        return c ? [{ id: t.id, label: `${c.name} ${t.start.slice(0, 4)}`, city: c }] : [];
      }),
    };
  }, [city, trip, visible, selectedId, view.name, trips]);

  const noTrips = view.name === 'list' && trips.length === 0;
  // The empty home keeps the tab bar, so its sheet doesn't count as a covering layer.
  const layer: TripsLayer = askReminder ? 'dialog' : view.name === 'list' ? (snap === 'title' || noTrips ? null : 'sheet') : view.name;
  // With no trips the empty state lives in the sheet body, so keep the sheet open.
  useEffect(() => {
    if (view.name === 'list' && trips.length === 0) setSnap((s) => (s === 'title' ? 'peek' : s));
  }, [view.name, trips.length]);
  useEffect(() => {
    onLayerChange(layer);
    return () => onLayerChange(null);
  }, [layer, onLayerChange]);

  const openTrip = (tripId: string) => {
    setView({ name: 'trip', tripId });
    setCategory('All');
    setQuery('');
    setSelectedId(null);
    setSnap('half');
  };

  const goList = () => {
    setView({ name: 'list' });
    setSnap('title');
  };

  const selectStore = (id: string) => {
    setSelectedId(id);
    setSnap((s) => (s === 'peek' ? 'half' : s));
  };

  // A result opens the trip for its city, or starts a new trip when there is none yet.
  const pickResult = (store: Store) => {
    const match = trips.find((t) => t.cityId === store.cityId);
    setHomeQuery('');
    if (match) {
      openTrip(match.id);
      setSelectedId(store.id);
    } else {
      setView({ name: 'create' });
    }
  };

  const toggleStore = (storeId: string) => {
    if (!trip) return;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== trip.id) return t;
        const removing = t.saved.includes(storeId);
        return {
          ...t,
          saved: removing ? t.saved.filter((id) => id !== storeId) : [...t.saved, storeId],
          done: removing ? t.done.filter((id) => id !== storeId) : t.done,
        };
      }),
    );
  };

  const toggleDone = (storeId: string) => {
    if (!trip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id !== trip.id
          ? t
          : { ...t, done: t.done.includes(storeId) ? t.done.filter((id) => id !== storeId) : [...t.done, storeId] },
      ),
    );
  };

  // Leaving a trip with no reminder set asks whether to enable one first.
  const handleBack = () => {
    if (trip && !trip.reminder?.onArrival) setAskReminder(true);
    else goList();
  };

  const saveReminder = (reminder: Reminder | null) => {
    if (trip && reminder) {
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? { ...t, reminder } : t)));
    }
    setAskReminder(false);
    goList();
  };

  const createTrip = (cityId: string, otherCountries: string[], exitAirport: string, start: string, end: string) => {
    const id = `trip-${Date.now()}`;
    setTrips((prev) => [{ id, cityId, otherCountries, exitAirport, start, end, saved: [], done: [] }, ...prev]);
    openTrip(id);
  };

  let header: React.ReactNode;
  let body: React.ReactNode;
  if (view.name === 'trip' && trip && city) {
    header = (
      <div className="page-head">
        <button type="button" className="icon-btn" aria-label="Back to trips" onClick={handleBack}>
          <ArrowLeft />
        </button>
        <div className="page-head__title">
          <h1>{city.name}</h1>
          <p>
            {formatRange(trip.start, trip.end)} · exit {trip.exitAirport}
          </p>
        </div>
      </div>
    );
    body = (
      <TripDetail
        city={city}
        cityStores={cityStores}
        visible={visible}
        saved={trip.saved}
        done={trip.done}
        selectedId={selectedId}
        onSelect={selectStore}
        category={category}
        onCategory={setCategory}
        onOpenOffer={onOpenOffer}
        onToggle={toggleStore}
        onToggleDone={toggleDone}
        prefs={prefs}
        onEditInterests={onEditInterests}
      />
    );
  } else if (view.name === 'create') {
    header = (
      <div className="page-head">
        <button type="button" className="icon-btn" aria-label="Back to trips" onClick={goList}>
          <ArrowLeft />
        </button>
        <div className="page-head__title">
          <h1>New trip</h1>
        </div>
      </div>
    );
    body = <CreateTrip onCreate={createTrip} />;
  } else {
    header = (
      <div className="page-head">
        <div className="page-head__title">
          <h1>My trips</h1>
        </div>
      </div>
    );
    body = (
      <>
        {trips.length > 0 && (
          <div className="trips-vouchers">
            <VouchersButton count={voucherCount} onClick={onOpenVouchers} />
          </div>
        )}
        <TripList
          trips={trips}
          onOpen={openTrip}
          onDelete={(id) => setTrips((prev) => prev.filter((t) => t.id !== id))}
        />
      </>
    );
  }

  if (scene) {
    return (
      <div className={`trips trips--map${noTrips ? ' trips--empty' : ''}`}>
        <TripMap scene={scene} snap={snap} onOpenTrip={openTrip} onSelectStore={selectStore} />
        {view.name === 'trip' && (
          <label className="map-search">
            <Search />
            <input
              type="search"
              value={query}
              placeholder="Search Tax Free stores"
              aria-label="Search Tax Free stores"
              maxLength={40}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        )}
        {view.name === 'list' && (
          <>
            <label className="map-search map-search--home">
              <Search />
              <input
                type="search"
                value={homeQuery}
                placeholder="Search your favorite brands near you"
                aria-label="Search your favorite brands near you"
                maxLength={40}
                onChange={(e) => setHomeQuery(e.target.value)}
              />
            </label>
            {homeQuery.trim() !== '' && (
              <ul className="search-results" aria-label="Search results">
                {homeResults.length === 0 && <li className="search-results__empty">No stores found</li>}
                {homeResults.map((s) => {
                  const brand = brandOfStore(s.id);
                  const hasTrip = trips.some((t) => t.cityId === s.cityId);
                  return (
                    <li key={s.id}>
                      <button type="button" onClick={() => pickResult(s)}>
                        <span className="search-results__icon">
                          {brand ? <img src={brand.logo} alt="" draggable={false} /> : <CategoryIcon category={s.category} />}
                        </span>
                        <span className="search-results__text">
                          <span className="search-results__name">{s.name}</span>
                          <span className="search-results__sub">
                            {cityById(s.cityId)?.name} · {s.category}
                          </span>
                        </span>
                        <span className="search-results__tag">{hasTrip ? 'Your trip' : 'Add trip'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
        <BottomSheet
          snap={snap}
          onSnapChange={setSnap}
          minSnap={view.name === 'list' ? 'title' : 'peek'}
          header={header}
          floating={
            view.name === 'list' && (
              <button type="button" className="trips-add" aria-label="New trip" onClick={() => setView({ name: 'create' })}>
                <Plus />
              </button>
            )
          }
        >
          {body}
        </BottomSheet>
        {askReminder && city && (
          <ReminderDialog country={city.country} onSave={saveReminder} onSkip={() => saveReminder(null)} />
        )}
      </div>
    );
  }

  const viewKey = view.name === 'trip' ? view.tripId : view.name;

  return (
    <div className="trips trips--create">
      <div className="trips__scroll" key={viewKey}>
        <div className="screen__content">
          {header}
          {body}
        </div>
      </div>
      {askReminder && city && (
        <ReminderDialog country={city.country} onSave={saveReminder} onSkip={() => saveReminder(null)} />
      )}
    </div>
  );
}
