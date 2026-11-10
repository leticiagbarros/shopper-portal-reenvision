import pradaLogo from '../assets/logos/prada.png';
import sephoraLogo from '../assets/logos/sephora.png';
import corteInglesLogo from '../assets/logos/el-corte-ingles.png';
import { brandOfStore, type Store } from './places';

export interface Offer {
  id: string;
  brand: string;
  logo: string;
  /** The big number on the ticket, e.g. "15%" or "Free". */
  value: string;
  unit: string;
  title: string;
  /** Why the shopper sees this offer. */
  reason: string;
  /** Matches a trip city, so the offer can show on that trip. */
  cityId: string;
  daysLeft: number;
  /** Prototype only: a real code comes from the merchant. */
  code: string;
  barcode: string;
  terms: string[];
}

export const OFFERS: Offer[] = [
  {
    id: 'prada-15',
    brand: 'Prada',
    logo: pradaLogo,
    value: '15%',
    unit: 'off',
    title: 'On your next purchase',
    reason: 'Because you shopped at Gucci',
    cityId: 'milan',
    daysLeft: 3,
    code: 'PRADA-TF15',
    barcode: '590123412345',
    terms: ['Valid on full-price items.', 'Show this code and your Tax Free QR at the till.', 'One use per shopper.'],
  },
  {
    id: 'sephora-gift',
    brand: 'Sephora',
    logo: sephoraLogo,
    value: 'Free',
    unit: 'gift',
    title: 'Mini set with any purchase over 50 EUR',
    reason: 'Available at Sephora Gran Vía, Madrid',
    cityId: 'madrid',
    daysLeft: 6,
    code: 'SEPH-MINI50',
    barcode: '590123412346',
    terms: ['While stocks last.', 'Tax Free paperwork can be done in the same visit.'],
  },
  {
    id: 'eci-20',
    brand: 'El Corte Inglés',
    logo: corteInglesLogo,
    value: '20€',
    unit: 'off',
    title: 'On 150 EUR or more',
    reason: 'Because you shopped at Loewe',
    cityId: 'lisbon',
    daysLeft: 10,
    code: 'ECI-TAXFREE20',
    barcode: '590123412347',
    terms: ['Valid in all Lisbon stores.', 'Cannot be combined with other vouchers.'],
  },
];

// A store has a voucher when its brand has an offer in the store's city.
export const offerForStore = (store: Store) =>
  OFFERS.find((o) => o.cityId === store.cityId && o.brand === brandOfStore(store.id)?.name);
