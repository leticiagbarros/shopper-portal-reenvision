// Sample data for the prototype: store names are real landmarks, Tax Free participation is illustrative.
// City photos: Wikimedia Commons (Torre de Belém, Eiffel Tower, Milan Cathedral, Colosseum, Royal Palace of Madrid).
import lisbonImg from '../assets/cities/lisbon.jpg';
import parisImg from '../assets/cities/paris.jpg';
import milanImg from '../assets/cities/milan.jpg';
import romeImg from '../assets/cities/rome.jpg';
import madridImg from '../assets/cities/madrid.jpg';
import bulgariLogo from '../assets/logos/bulgari.png';
import corteInglesLogo from '../assets/logos/el-corte-ingles.png';
import galeriesLogo from '../assets/logos/galeries-lafayette.jpg';
import gucciLogo from '../assets/logos/gucci.png';
import loeweLogo from '../assets/logos/loewe.png';
import louisVuittonLogo from '../assets/logos/louis-vuitton.png';
import pradaLogo from '../assets/logos/prada.png';
import sephoraLogo from '../assets/logos/sephora.png';
import zaraLogo from '../assets/logos/zara.png';
export type Category = 'Luxury' | 'Department store' | 'Shopping mall' | 'Beauty' | 'Souvenirs';

export interface City {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  image: string;
  imagePosition: string;
  minSpend: string;
}

export interface Store {
  id: string;
  cityId: string;
  name: string;
  category: Category;
  address: string;
  lat: number;
  lng: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Luxury: '#18181b',
  'Department store': '#2563eb',
  'Shopping mall': '#d97706',
  Beauty: '#db2777',
  Souvenirs: '#059669',
};
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Reminder {
  onArrival: boolean;
}

export interface Trip {
  id: string;
  cityId: string;
  otherCountries: string[];
  exitAirport: string; // IATA code of the last airport the shopper leaves from
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  saved: string[]; // stores planned for the trip
  done: string[]; // saved stores the shopper has already visited / bought from
  reminder?: Reminder;
}

export const AIRPORTS: Airport[] = [
  { code: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal' },
  { code: 'OPO', name: 'Francisco Sá Carneiro Airport', city: 'Porto', country: 'Portugal' },
  { code: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France' },
  { code: 'NCE', name: 'Côte d’Azur Airport', city: 'Nice', country: 'France' },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'LIN', name: 'Linate Airport', city: 'Milan', country: 'Italy' },
  { code: 'VCE', name: 'Marco Polo Airport', city: 'Venice', country: 'Italy' },
  { code: 'NAP', name: 'Naples International Airport', city: 'Naples', country: 'Italy' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Josep Tarradellas Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'AGP', name: 'Málaga Airport', city: 'Málaga', country: 'Spain' },
  { code: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma', country: 'Spain' },
  { code: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'BER', name: 'Brandenburg Airport', city: 'Berlin', country: 'Germany' },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
];

export const airportByCode = (code: string) => AIRPORTS.find((a) => a.code === code);

// Countries a shopper can add as extra stops: those that have an airport in the list.
export const EXTRA_COUNTRIES = Array.from(new Set(AIRPORTS.map((a) => a.country))).sort();

export const CITIES: City[] = [
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', center: [38.7223, -9.1393], image: lisbonImg, imagePosition: '50% 50%', minSpend: '61,35 EUR' },
  { id: 'paris', name: 'Paris', country: 'France', center: [48.8566, 2.3522], image: parisImg, imagePosition: '50% 40%', minSpend: '100,01 EUR' },
  { id: 'milan', name: 'Milan', country: 'Italy', center: [45.4642, 9.19], image: milanImg, imagePosition: '50% 50%', minSpend: '70,00 EUR' },
  { id: 'rome', name: 'Rome', country: 'Italy', center: [41.9028, 12.4964], image: romeImg, imagePosition: '50% 50%', minSpend: '70,00 EUR' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', center: [40.4168, -3.7038], image: madridImg, imagePosition: '50% 50%', minSpend: '90,16 EUR' },
];

export const STORES: Store[] = [
  { id: 'lis-1', cityId: 'lisbon', name: 'El Corte Inglés', category: 'Department store', address: 'Av. António Augusto de Aguiar 31', lat: 38.7326, lng: -9.1537 },
  { id: 'lis-2', cityId: 'lisbon', name: 'Armazéns do Chiado', category: 'Shopping mall', address: 'R. do Carmo 2, Chiado', lat: 38.7106, lng: -9.1397 },
  { id: 'lis-3', cityId: 'lisbon', name: 'Amoreiras Shopping Center', category: 'Shopping mall', address: 'Av. Eng. Duarte Pacheco', lat: 38.7231, lng: -9.162 },
  { id: 'lis-4', cityId: 'lisbon', name: 'Louis Vuitton', category: 'Luxury', address: 'Av. da Liberdade 190', lat: 38.7197, lng: -9.1457 },
  { id: 'lis-5', cityId: 'lisbon', name: 'Gucci', category: 'Luxury', address: 'Av. da Liberdade 180', lat: 38.7203, lng: -9.1452 },
  { id: 'lis-6', cityId: 'lisbon', name: 'A Vida Portuguesa', category: 'Souvenirs', address: 'R. Anchieta 11, Chiado', lat: 38.7105, lng: -9.1424 },
  { id: 'lis-7', cityId: 'lisbon', name: 'Sephora Colombo', category: 'Beauty', address: 'Centro Colombo, Benfica', lat: 38.7545, lng: -9.1881 },
  { id: 'lis-8', cityId: 'lisbon', name: 'Centro Vasco da Gama', category: 'Shopping mall', address: 'Av. Dom João II, Parque das Nações', lat: 38.7677, lng: -9.0951 },

  { id: 'par-1', cityId: 'paris', name: 'Galeries Lafayette Haussmann', category: 'Department store', address: '40 Bd Haussmann', lat: 48.8738, lng: 2.332 },
  { id: 'par-2', cityId: 'paris', name: 'Printemps Haussmann', category: 'Department store', address: '64 Bd Haussmann', lat: 48.8737, lng: 2.3282 },
  { id: 'par-3', cityId: 'paris', name: 'Le Bon Marché', category: 'Department store', address: '24 Rue de Sèvres', lat: 48.8509, lng: 2.3238 },
  { id: 'par-4', cityId: 'paris', name: 'Louis Vuitton Champs-Élysées', category: 'Luxury', address: '101 Av. des Champs-Élysées', lat: 48.8716, lng: 2.3002 },
  { id: 'par-5', cityId: 'paris', name: 'Sephora Champs-Élysées', category: 'Beauty', address: '70 Av. des Champs-Élysées', lat: 48.8707, lng: 2.3033 },

  { id: 'mil-1', cityId: 'milan', name: 'La Rinascente Duomo', category: 'Department store', address: 'Via Santa Radegonda 3', lat: 45.465, lng: 9.1915 },
  { id: 'mil-2', cityId: 'milan', name: 'Prada Montenapoleone', category: 'Luxury', address: 'Via Montenapoleone 8', lat: 45.469, lng: 9.195 },
  { id: 'mil-3', cityId: 'milan', name: 'Galleria Vittorio Emanuele II', category: 'Shopping mall', address: 'Piazza del Duomo', lat: 45.4655, lng: 9.19 },
  { id: 'mil-4', cityId: 'milan', name: 'Zara Corso Buenos Aires', category: 'Shopping mall', address: 'Corso Buenos Aires 33', lat: 45.4786, lng: 9.2064 },

  { id: 'rom-1', cityId: 'rome', name: 'La Rinascente Tritone', category: 'Department store', address: 'Via del Tritone 61', lat: 41.9024, lng: 12.485 },
  { id: 'rom-2', cityId: 'rome', name: 'Bulgari Via Condotti', category: 'Luxury', address: 'Via dei Condotti 10', lat: 41.906, lng: 12.48 },
  { id: 'rom-3', cityId: 'rome', name: 'Galleria Alberto Sordi', category: 'Shopping mall', address: 'Piazza Colonna', lat: 41.9005, lng: 12.4807 },
  { id: 'rom-4', cityId: 'rome', name: 'Kiko Via del Corso', category: 'Beauty', address: 'Via del Corso 181', lat: 41.902, lng: 12.48 },

  { id: 'mad-1', cityId: 'madrid', name: 'El Corte Inglés Preciados', category: 'Department store', address: 'Calle de Preciados 3', lat: 40.4199, lng: -3.7059 },
  { id: 'mad-2', cityId: 'madrid', name: 'Loewe Serrano', category: 'Luxury', address: 'Calle de Serrano 34', lat: 40.4249, lng: -3.6846 },
  { id: 'mad-3', cityId: 'madrid', name: 'ABC Serrano', category: 'Shopping mall', address: 'Calle de Serrano 61', lat: 40.4306, lng: -3.6872 },
  { id: 'mad-4', cityId: 'madrid', name: 'Sephora Gran Vía', category: 'Beauty', address: 'Gran Vía 32', lat: 40.4203, lng: -3.704 },
];

export const cityById = (id: string) => CITIES.find((c) => c.id === id);

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const BRANDS: Brand[] = [
  { id: 'louis-vuitton', name: 'Louis Vuitton', logo: louisVuittonLogo },
  { id: 'gucci', name: 'Gucci', logo: gucciLogo },
  { id: 'prada', name: 'Prada', logo: pradaLogo },
  { id: 'bulgari', name: 'Bulgari', logo: bulgariLogo },
  { id: 'loewe', name: 'Loewe', logo: loeweLogo },
  { id: 'sephora', name: 'Sephora', logo: sephoraLogo },
  { id: 'zara', name: 'Zara', logo: zaraLogo },
  { id: 'el-corte-ingles', name: 'El Corte Inglés', logo: corteInglesLogo },
  { id: 'galeries-lafayette', name: 'Galeries Lafayette', logo: galeriesLogo },
];

// Stores that are not listed here have no brand logo and use a category icon.
const STORE_BRAND: Record<string, string> = {
  'lis-1': 'el-corte-ingles',
  'lis-4': 'louis-vuitton',
  'lis-5': 'gucci',
  'lis-7': 'sephora',
  'par-1': 'galeries-lafayette',
  'par-4': 'louis-vuitton',
  'par-5': 'sephora',
  'mil-2': 'prada',
  'mil-4': 'zara',
  'rom-2': 'bulgari',
  'mad-1': 'el-corte-ingles',
  'mad-2': 'loewe',
  'mad-4': 'sephora',
};

export const brandOfStore = (storeId: string) => BRANDS.find((b) => b.id === STORE_BRAND[storeId]);

export const brandCategory = (brandId: string): Category | undefined => {
  const storeId = Object.keys(STORE_BRAND).find((id) => STORE_BRAND[id] === brandId);
  return STORES.find((s) => s.id === storeId)?.category;
};

export interface Preferences {
  categories: Category[];
  brands: string[];
}

export const NO_PREFERENCES: Preferences = { categories: [], brands: [] };

// A favorite brand outweighs a liked category.
export function matchScore(store: Store, prefs: Preferences): { score: number; reason?: string } {
  const brand = brandOfStore(store.id);
  if (brand && prefs.brands.includes(brand.id)) return { score: 10, reason: 'Favorite brand' };
  if (prefs.categories.includes(store.category)) return { score: 3, reason: store.category };
  return { score: 0 };
}

const fmtDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' });
const fmtDayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtFull = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export function formatRange(start: string, end: string): string {
  const s = toDate(start);
  const e = toDate(end);
  if (start === end) return fmtFull.format(s);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  return sameMonth
    ? `${fmtDay.format(s)}–${fmtFull.format(e)}`
    : `${fmtDayMonth.format(s)} – ${fmtFull.format(e)}`;
}

export const SEED_TRIPS: Trip[] = [
  { id: 'trip-lisbon', cityId: 'lisbon', otherCountries: [], exitAirport: 'LIS', start: '2026-12-05', end: '2026-12-06', saved: ['lis-1', 'lis-4'], done: [] },
  { id: 'trip-milan', cityId: 'milan', otherCountries: ['France'], exitAirport: 'CDG', start: '2026-03-12', end: '2026-03-15', saved: [], done: [] },
];
