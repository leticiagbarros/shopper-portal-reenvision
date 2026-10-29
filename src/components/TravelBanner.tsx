import airport from '../assets/icons/airport.svg';
import chevron from '../assets/icons/chevron.svg';

export function TravelBanner() {
  return (
    <button type="button" className="travel-banner">
      <span className="travel-banner__icon">
        <img src={airport} alt="" width={16} height={16} />
      </span>
      <span className="travel-banner__text">
        <span className="travel-banner__title">Traveling soon?</span>
        <span className="travel-banner__body">
          Find Customs at major EU airports with maps and pictures to avoid stress when leaving
        </span>
      </span>
      <img src={chevron} alt="" width={16} height={16} />
    </button>
  );
}
