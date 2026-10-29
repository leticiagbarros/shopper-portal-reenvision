export type ScreenId =
  | 'login'
  | 'login-email'
  | 'login-code'
  | 'passport'
  | 'camera-alert'
  | 'camera-scan'
  | 'passport-confirm'
  | 'welcome'
  | 'interests'
  | 'brands'
  | 'notifications'
  | 'refunds'
  | 'refund-loewe'
  | 'refund-gucci'
  | 'guide'
  | 'trips'
  | 'trip'
  | 'create-trip'
  | 'ai'
  | 'profile'
  | 'qr'
  | 'nearby';

export interface ScreenGroup {
  title: string;
  items: { id: ScreenId; label: string }[];
}

// Every screen of the prototype, in the order a shopper meets them.
export const SCREEN_GROUPS: ScreenGroup[] = [
  {
    title: 'Log in',
    items: [
      { id: 'login', label: 'Log in or sign up' },
      { id: 'login-email', label: 'Sign in with email' },
      { id: 'login-code', label: 'Check your email (code)' },
    ],
  },
  {
    title: 'Sign up',
    items: [
      { id: 'passport', label: 'Passport details' },
      { id: 'camera-alert', label: 'Camera permission (iOS)' },
      { id: 'camera-scan', label: 'Passport scan' },
      { id: 'passport-confirm', label: 'Confirm passport details' },
    ],
  },
  {
    title: 'First launch',
    items: [{ id: 'notifications', label: 'Allow notifications' }],
  },
  {
    title: 'My refunds',
    items: [
      { id: 'refunds', label: 'My refunds' },
      { id: 'refund-loewe', label: 'Refund details: Loewe (customs)' },
      { id: 'refund-gucci', label: 'Refund details: Gucci (digital)' },
      { id: 'guide', label: 'Next step: validation guide' },
      { id: 'qr', label: 'My QR code' },
    ],
  },
  {
    title: 'My trips',
    items: [
      { id: 'trips', label: 'My trips' },
      { id: 'trip', label: 'Trip: Tax Free stores' },
      { id: 'create-trip', label: 'New trip' },
    ],
  },
  {
    title: 'Shopping interests',
    items: [
      { id: 'welcome', label: 'Welcome' },
      { id: 'interests', label: 'What do you like to shop?' },
      { id: 'brands', label: 'Favorite brands' },
    ],
  },
  {
    title: 'More',
    items: [
      { id: 'ai', label: 'Tax Free AI' },
      { id: 'profile', label: 'Profile' },
      { id: 'nearby', label: 'Nearby store notification' },
    ],
  },
];
