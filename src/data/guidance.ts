import { AIRPORTS, cityById, type Airport } from './places';

// Sample rules and data for the prototype; a real version reads the validation guide and an airport feed.
const NON_EU = new Set(['LHR', 'ZRH']);
const DIGITAL_AIRPORTS = new Set(['LIS', 'CDG', 'MXP', 'MAD', 'AMS', 'FRA', 'CPH', 'BCN']);
// Forms from these countries can be validated digitally; the others need a customs stamp.
const DIGITAL_FORM_COUNTRIES = new Set(['Portugal', 'France', 'Italy', 'Germany']);

export const isEu = (a: Airport) => !NON_EU.has(a.code);
export const hasDigital = (a: Airport) => DIGITAL_AIRPORTS.has(a.code);

export interface RefundForm {
  id: string;
  merchant: string;
  amount: string;
  cityId: string;
  purchaseDate: string; // YYYY-MM-DD
  formNumber: string;
  purchaseId: string;
  address: string;
  totalAmount: string;
  barcodeBase: string; // first 12 digits of the EAN-13 form barcode
}

export const FORMS: RefundForm[] = [
  {
    id: 'form-spain',
    merchant: 'Loewe',
    amount: '420,00 EUR',
    cityId: 'madrid',
    purchaseDate: '2026-10-20',
    formNumber: 'TF-ES-48213',
    purchaseId: '4412 0820 1030 7721 5530 1184',
    address: 'Calle de Serrano 34, Madrid, Spain',
    totalAmount: '2.700,00 EUR',
    barcodeBase: '843412345678',
  },
  {
    id: 'form-portugal',
    merchant: 'Gucci',
    amount: '299,00 EUR',
    cityId: 'lisbon',
    purchaseDate: '2026-10-16',
    formNumber: 'TF-PT-30587',
    purchaseId: '2380 2201 2030 9902 4759 9268',
    address: 'Av. da Liberdade 180, Lisboa, Portugal',
    totalAmount: '1.900,00 EUR',
    barcodeBase: '560123456789',
  },
];

export type GoodsLocation = 'hand' | 'checked' | 'unpacked';
export type BagHandling = 'hand' | 'collect' | 'through';
export type Method = 'digital' | 'customs' | 'outside-eu';
export type PlanKind = Method | 'mixed' | 'wait' | 'early';

export interface FormPlan {
  form: RefundForm;
  place: string;
  method: Method;
  daysLeft: number;
  /** Where to validate this form, and what to do there; shown right under it. */
  where?: string;
  steps?: string[];
  /** Form only needs the stamped form uploaded, so the card shows an upload button instead of instructions. */
  upload?: boolean;
}

export interface Plan {
  kind: PlanKind;
  airport: Airport;
  headline: string;
  summary: string;
  before?: { title: string; steps: string[] };
  stepsTitle?: string;
  steps: string[];
  reasons: string[];
  forms: FormPlan[];
}

// The form must be validated within 3 months of the purchase.
export function validationDeadline(purchaseDate: string): string {
  const deadline = new Date(`${purchaseDate}T00:00:00Z`);
  deadline.setUTCMonth(deadline.getUTCMonth() + 3);
  return deadline.toISOString().slice(0, 10);
}

export function daysLeft(purchaseDate: string, now = new Date()): number {
  const deadline = new Date(`${validationDeadline(purchaseDate)}T00:00:00Z`);
  return Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
}

export function getPlan(forms: RefundForm[], airport: Airport, goods: GoodsLocation): Plan {
  const eu = isEu(airport);
  const formPlans: FormPlan[] = forms.map((form): FormPlan => {
    const city = cityById(form.cityId);
    const country = city?.country ?? '';
    const digital = eu && hasDigital(airport) && DIGITAL_FORM_COUNTRIES.has(country);
    return {
      form,
      place: `${city?.name ?? 'Europe'}, ${country}`,
      method: !eu ? 'outside-eu' : digital ? 'digital' : 'customs',
      daysLeft: daysLeft(form.purchaseDate),
    };
  }).sort((a, b) => a.daysLeft - b.daysLeft); // most urgent first, so the list matches the order of the steps

  const digitalForms = formPlans.filter((f) => f.method === 'digital');
  const customsForms = formPlans.filter((f) => f.method === 'customs');
  const many = forms.length > 1;

  const reasons = formPlans.map((f) => {
    const country = f.place.split(', ')[1];
    const how =
      f.method === 'digital'
        ? `${country} forms can be validated digitally at ${airport.code}.`
        : f.method === 'customs'
          ? !hasDigital(airport)
            ? `${airport.code} has no digital validation, so customs stamps it.`
            : `${country} forms need a customs stamp in this sample data.`
          : `${airport.code} is outside the EU, so the EU exit is earlier on your route.`;
    return `${f.form.merchant}: bought in ${f.place}. ${how}`;
  });
  reasons.push(
    `Validation happens at your last EU exit point (${airport.name}), not in the country where you bought.${
      many ? ' One stop covers all your forms.' : ''
    }`,
  );

  const goodsStep =
    goods === 'checked'
      ? 'Take the goods out of your checked luggage first. Customs may ask to see them.'
      : goods === 'unpacked'
        ? 'Keep the goods unused and in their original packaging, and pack them in your hand luggage.'
        : 'Keep the goods with you, unused and in their original packaging.';
  const done = 'After validation we process your refunds. Follow them in My refunds.';
  const upload = 'Take a photo of the stamp and upload the stamped form in Refund details.';

  if (!eu) {
    return {
      kind: 'outside-eu',
      airport,
      headline: 'Validate before you leave the EU',
      summary: `${airport.name} is outside the EU, so it is not where your goods leave the EU. Validate your ${
        many ? 'forms' : 'form'
      } at the last EU airport on your route, before the flight to ${airport.city}.`,
      steps: ['Find the last airport in the EU on your route.', goodsStep, 'Validate there, before you check in.', done],
      reasons,
      forms: formPlans,
    };
  }

  if (customsForms.length === 0) {
    return {
      kind: 'digital',
      airport,
      headline: 'Digital stamp',
      summary: `Good news: ${airport.name} offers digital validation for ${many ? 'all your forms' : 'your form'}, so you can skip the customs queue.`,
      steps: [
        `Go to the digital validation point at ${airport.name}, before security.`,
        goodsStep,
        `Scan ${many ? 'each form' : 'the form'} from this app and wait for the green confirmation.`,
        done,
      ],
      reasons,
      forms: formPlans,
    };
  }

  if (digitalForms.length === 0) {
    return {
      kind: 'customs',
      airport,
      headline: 'Customs desk',
      summary: `You need a customs stamp for ${many ? 'all your forms' : 'your form'} at ${airport.name}. Do it before you check in your luggage.`,
      steps: [
        `Go to the customs desk at ${airport.name}, before you check in your luggage.`,
        goodsStep,
        `Show your passport, boarding pass, ${many ? 'the forms' : 'the form'} and the goods.`,
        `Customs stamps ${many ? 'your forms' : 'your form'}. ${upload}`,
        done,
      ],
      reasons,
      forms: formPlans,
    };
  }

  const digitalStop = { upload: true };
  const customsStop = {
    where: `Customs desk at ${airport.name}, before you check in your luggage`,
    steps: [
      'Show your passport, boarding pass, the form and the goods.',
      'Customs stamps the form.',
      'Take a photo of the stamp and upload the stamped form in Refund details.',
    ],
  };

  return {
    kind: 'mixed',
    airport,
    headline: 'Digital + customs',
    summary: `Next steps with your ${forms.length} vouchers: validate ${forms.length === 2 ? 'both' : 'all'} before you check in.`,
    steps: [goodsStep, done],
    reasons,
    forms: formPlans.map((f) => ({ ...f, ...(f.method === 'digital' ? digitalStop : customsStop) })),
  };
}

// The shopper is in one country (e.g. Spain) but leaves the EU from another (e.g. Portugal).
export function getRoutePlan(forms: RefundForm[], exitAirport: Airport, hereCountry: string, bag: BagHandling): Plan {
  const hereAirport = AIRPORTS.find((a) => a.country === hereCountry) ?? exitAirport;
  const done = 'After validation we process your refunds. Follow them in My refunds.';

  if (bag === 'through') {
    const early = getPlan(forms, hereAirport, 'hand');
    return {
      ...early,
      kind: 'early',
      forms: early.forms.map(({ steps: _steps, where: _where, upload: _upload, ...f }) => f),
      headline: `Validate before you leave ${hereCountry}`,
      summary: `Your bag goes straight to your final destination, so you will not see it again at ${exitAirport.code}. Validate all your forms at ${hereAirport.name} before you check in. Rules for through-checked bags vary, so confirm with customs if you can.`,
      stepsTitle: `At ${hereAirport.name}`,
      steps: [
        `Go to the validation area at ${hereAirport.name} before you check in your bag.`,
        'Keep all the goods unused and in their original packaging, and take them out of your bag.',
        'Show your passport, boarding pass, the forms and the goods.',
        ...(early.forms.some((f) => f.method === 'customs') ? ['Customs stamps your forms. Take a photo of the stamp and upload the stamped form in Refund details.'] : []),
        done,
      ],
      reasons: [
        `Your route ends in ${exitAirport.country}, where you leave the EU from ${exitAirport.code}.`,
        `Your bag is checked through to your final destination, so the goods must be shown before they go into the hold.`,
        ...early.reasons.slice(0, -1),
      ],
    };
  }

  const exit = getPlan(forms, exitAirport, 'hand');
  const local = forms.filter((f) => cityById(f.cityId)?.country === hereCountry);
  const localNames = local.map((f) => f.merchant).join(' and ');
  const goodsLine =
    bag === 'hand'
      ? 'Carry the goods in your hand luggage.'
      : `You collect your bag at ${exitAirport.code}, so keep the goods easy to take out before you check in again.`;

  return {
    ...exit,
    kind: 'wait',
    headline: `Validate later, at ${exitAirport.code}`,
    summary: `Do not validate in ${hereCountry}. You leave the EU from ${exitAirport.name}, so ${
      localNames ? `your ${localNames} form` : 'your forms'
    } will be validated there with the others. For now, keep the goods ready.`,
    before: {
      title: `Before you leave ${hereCountry}`,
      steps: [
        `Do not get a stamp in ${hereCountry}. Flights inside the EU do not need validation.`,
        `Keep ${localNames ? `the ${localNames}` : 'all the'} goods unused and in their original packaging.`,
        goodsLine,
        'Keep your passport and the forms with you.',
      ],
    },
    stepsTitle: `At ${exitAirport.name}`,
    reasons: [
      `Your route: ${hereCountry}, then ${exitAirport.country}, then home. The EU exit is at ${exitAirport.code}.`,
      ...exit.reasons,
    ],
  };
}
