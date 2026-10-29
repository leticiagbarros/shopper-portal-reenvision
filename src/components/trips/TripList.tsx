import { STORES, cityById, formatRange, type City, type Trip } from '../../data/places';
import { SwipeRow } from './SwipeRow';

export function TripThumb({ city }: { city: City }) {
  return (
    <img
      className="trip-thumb"
      src={city.image}
      alt={`${city.name} landmark`}
      style={{ objectPosition: city.imagePosition }}
      draggable={false}
    />
  );
}

interface Props {
  trips: Trip[];
  onOpen: (tripId: string) => void;
  onDelete: (tripId: string) => void;
}

export function TripList({ trips, onOpen, onDelete }: Props) {
  return (
    <div className="trip-list">
      {trips.length === 0 && (
        <p className="trip-list__empty">
          Tap + to plan where you are shopping next and save the Tax Free stores you want to visit.
        </p>
      )}
      {trips.map((trip) => {
        const city = cityById(trip.cityId);
        if (!city) return null;
        const available = STORES.filter((s) => s.cityId === city.id).length;
        return (
          <SwipeRow key={trip.id} label={`${city.name} trip`} onDelete={() => onDelete(trip.id)}>
            <button type="button" className="trip-card" onClick={() => onOpen(trip.id)}>
              <TripThumb city={city} />
              <span className="trip-card__text">
                <span className="trip-card__city">{city.name}</span>
                <span className="trip-card__dates">
                  {formatRange(trip.start, trip.end)} · exit {trip.exitAirport}
                </span>
                <span className="trip-card__meta">
                  {trip.saved.length} saved · {available} Tax Free stores
                  {trip.reminder?.onArrival && ' · Reminder on'}
                </span>
              </span>
            </button>
          </SwipeRow>
        );
      })}
    </div>
  );
}
