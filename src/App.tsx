import { useEffect, useState } from 'react';
import { SummaryCard } from './components/SummaryCard';
import { PromoCarousel, type PromoCardData } from './components/PromoCarousel';
import { RefundCard, type RefundCardData } from './components/RefundCard';
import { TravelBanner } from './components/TravelBanner';
import { TabBar, type TabId } from './components/TabBar';
import { TripsScreen, type TripsLayer } from './components/trips/TripsScreen';
import { QrFab } from './components/QrFab';
import { ValidationGuide } from './components/ValidationGuide';
import { RefundDetails } from './components/RefundDetails';
import { FormCard } from './components/FormCard';
import { FORMS } from './data/guidance';
import './guide.css';
import { TaxFreeScreen } from './components/TaxFreeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { NO_PREFERENCES, SEED_TRIPS, type Preferences, type Trip } from './data/places';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Notifications } from './components/Notifications';
import { LocationAlert } from './components/LocationAlert';
import { NearbyNotice } from './components/NearbyNotice';
import { Toast } from './components/Toast';
import { ScreenNav } from './components/ScreenNav';
import type { ScreenId } from './data/screens';
import helpIcon from './assets/icons/help.svg';
import profileCard from './assets/cards/profile.svg';
import addCardCard from './assets/cards/add-card.svg';
import stayConnectedCard from './assets/cards/stay-connected.svg';
import getCustomsCard from './assets/refund-cards/get-customs.svg';
import processingCard1 from './assets/refund-cards/processing-1.svg';
import processingCard2 from './assets/refund-cards/processing-2.svg';

const PROMOS: PromoCardData[] = [
  { id: 'profile', title: 'Complete your profile', image: profileCard },
  { id: 'add-card', title: 'Add your card for a quick refund', image: addCardCard },
  { id: 'stay-connected', title: 'Stay connected', image: stayConnectedCard },
];

const REFUNDS: RefundCardData[] = [
  { id: '1', image: getCustomsCard, alt: 'Gucci refund: get Customs approval' },
  { id: '2', image: processingCard1, alt: 'Gucci refund: processing' },
  { id: '3', image: processingCard2, alt: 'Gucci refund: processing' },
];

export function App() {
  const [promos, setPromos] = useState(PROMOS);
  const [tab, setTab] = useState<TabId>('refunds');
  const [trips, setTrips] = useState<Trip[]>(SEED_TRIPS);
  const [layer, setLayer] = useState<TripsLayer>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState<Preferences>(NO_PREFERENCES);
  // Opened from Profile or the trip stores list.
  const [onboarding, setOnboarding] = useState<'edit' | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const [locationAsked, setLocationAsked] = useState(false);
  const [savedToast, setSavedToast] = useState(0);
  const [nearby, setNearby] = useState<'idle' | 'shown' | 'done'>('idle');
  const detailForm = FORMS.find((f) => f.id === detailId);

  // Presenter navigation: jump to any screen. Remounting with a new key applies the starting state.
  const [screen, setScreen] = useState<ScreenId | null>(null);
  const [navKey, setNavKey] = useState(0);
  const goTo = (id: ScreenId) => {
    const auth = id === 'login' || id === 'login-email' || id === 'login-code';
    const signup = ['passport', 'camera-alert', 'camera-scan', 'passport-confirm'].includes(id);
    const interests = id === 'welcome' || id === 'interests' || id === 'brands';
    setScreen(id);
    setNavKey((k) => k + 1);
    setLoggedIn(!auth);
    setRegistered(!auth && !signup);
    setNotifyDone(!(auth || signup || id === 'notifications'));
    setOnboarding(interests ? 'edit' : null);
    setGuideOpen(id === 'guide');
    setDetailId(id === 'refund-loewe' ? 'form-spain' : id === 'refund-gucci' ? 'form-portugal' : null);
    setLayer(null);
    // Jumping straight into a trip or the new-trip form skips the location alert.
    setLocationAsked(id === 'trip' || id === 'create-trip');
    setNearby(id === 'nearby' ? 'shown' : 'idle');
    setTab(
      id === 'trips' || id === 'trip' || id === 'create-trip' || id === 'welcome' || id === 'interests' || id === 'brands'
        ? 'trips'
        : id === 'ai'
          ? 'tax-free'
          : id === 'profile'
            ? 'profile'
            : 'refunds',
    );
  };
  const registerStep = screen === 'passport-confirm' ? 1 : 0;
  const registerCamera = screen === 'camera-alert' ? 'permission' : screen === 'camera-scan' ? 'scanning' : undefined;
  // The home screen sits under the first-run overlays: keep it frozen, then start it at the top.
  const firstRunOpen = !loggedIn || !registered || !notifyDone;
  const [settling, setSettling] = useState(true);
  useEffect(() => {
    if (firstRunOpen) {
      setSettling(true);
      return;
    }
    document.querySelectorAll('.device .screen, .device .trips__scroll').forEach((el) => {
      el.scrollTop = 0;
    });
    // Swallow trackpad momentum from the last overlay.
    const id = window.setTimeout(() => setSettling(false), 700);
    return () => window.clearTimeout(id);
  }, [firstRunOpen]);
  // A fake push banner a few seconds after the shopper lands in the app.
  useEffect(() => {
    if (firstRunOpen || nearby !== 'idle') return;
    const id = window.setTimeout(() => setNearby('shown'), 12000);
    return () => window.clearTimeout(id);
  }, [firstRunOpen, nearby]);
  const refundsSecondLayer = guideOpen || detailForm !== undefined;
  const tabBarHidden =
    !loggedIn || !registered || !notifyDone || onboarding !== null || (tab === 'trips' && layer !== null) || (tab === 'refunds' && refundsSecondLayer);
  const qrHidden =
    !loggedIn ||
    !registered ||
    !notifyDone ||
    onboarding !== null ||
    tab === 'tax-free' || (tab === 'trips' && layer !== 'trip') || (tab === 'refunds' && refundsSecondLayer);

  return (
    <div className="stage">
      <div
        className={`device${firstRunOpen || settling ? ' is-locked' : ''}`}
        onWheel={(e) => {
          // The floating tab bar, QR button and bezel sit outside the scroller, so pass their wheel events on.
          const root = e.currentTarget;
          if (root.querySelector('.onb')) return;
          const scroller =
            root.querySelector('.sheet__body') ?? root.querySelector('.trips__scroll') ?? root.querySelector('.chat__body') ?? root.querySelector('.screen');
          if (scroller && !scroller.contains(e.target as Node)) scroller.scrollBy({ top: e.deltaY });
        }}
      >
        <div className="device__island" aria-hidden="true" />
        <div className="device__status" aria-hidden="true">
          <span>9:41</span>
          <span className="device__status-icons">
            <svg width="19" height="12" viewBox="0 0 19 12" fill="#000">
              <rect x="0" y="8" width="3" height="4" rx="0.8" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
              <rect x="10" y="3" width="3" height="9" rx="0.8" />
              <rect x="15" y="0" width="3" height="12" rx="0.8" />
            </svg>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="#000">
              <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1-1.1A10.4 10.4 0 0 0 8.5.8C5.9.8 3.5 1.8 1.5 3.6l1 1.1a8.9 8.9 0 0 1 6-2.4Zm0 3.2c1.4 0 2.6.5 3.600 1.400l1-1.100a7 7 0 0 0-9.200 0l1 1.100c1-.9 2.200-1.400 3.600-1.400Zm0 3.100c.7 0 1.300.3 1.800.7L8.500 11.500 6.700 9.300c.5-.4 1.100-.7 1.800-.7Z" />
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="23" height="12" rx="3.800" stroke="#000" opacity="0.4" />
              <rect x="2" y="2" width="20" height="9" rx="2.500" fill="#000" />
              <path d="M25 4.500v4c.8-.3 1.500-1.100 1.500-2s-.7-1.700-1.500-2Z" fill="#000" opacity="0.4" />
            </svg>
          </span>
        </div>
        {tab === 'refunds' && guideOpen && (
          <ValidationGuide
            key={detailForm?.id ?? 'all'}
            trips={trips}
            forms={detailForm ? [detailForm] : undefined}
            uploaded={detailForm ? uploads[detailForm.id] : undefined}
            onUpload={
              detailForm ? (name) => setUploads((prev) => ({ ...prev, [detailForm.id]: name })) : undefined
            }
            onBack={() => setGuideOpen(false)}
            onAskAi={() => {
              setGuideOpen(false);
              setTab('tax-free');
            }}
          />
        )}
        {tab === 'refunds' && !guideOpen && detailForm && (
          <RefundDetails
            form={detailForm}
            uploaded={uploads[detailForm.id]}
            onBack={() => setDetailId(null)}
            onOpenGuide={() => setGuideOpen(true)}
          />
        )}
        {tab === 'refunds' && !guideOpen && !detailForm && (
          <main className="screen" aria-label="My refunds">
            <div className="screen__content">
              <h1 className="screen__title">My refunds</h1>
              <SummaryCard onOpenGuide={() => setGuideOpen(true)} />
              <PromoCarousel
                cards={promos}
                onDismiss={(id) => setPromos((prev) => prev.filter((p) => p.id !== id))}
              />
              <section className="refund-group">
                <p className="refund-group__date">20/10/2026</p>
                <FormCard merchant="Loewe" amount="420,00 EUR" onOpen={() => setDetailId('form-spain')} />
              </section>
              <section className="refund-group">
                <p className="refund-group__date">16/10/2026</p>
                <RefundCard data={REFUNDS[0]} onOpen={() => setDetailId('form-portugal')} />
              </section>
              <RefundCard data={REFUNDS[1]} />
              <RefundCard data={REFUNDS[2]} />
              <TravelBanner />
              <a className="help-link" href="#help">
                <img src={helpIcon} alt="" width={16} height={16} />
                <span>Can’t find your refund?</span>
              </a>
            </div>
          </main>
        )}
        {tab === 'trips' && (
          <main className="screen screen--fixed" aria-label="My trips">
            <TripsScreen
              key={`trips-${navKey}`}
              initial={screen === 'trip' ? 'trip' : screen === 'create-trip' ? 'create' : 'list'}
              trips={trips}
              setTrips={setTrips}
              onLayerChange={setLayer}
              prefs={prefs}
              onEditInterests={() => setOnboarding('edit')}
            />
          </main>
        )}
        {tab === 'tax-free' && <TaxFreeScreen trips={trips} />}
        {tab === 'profile' && <ProfileScreen onEditInterests={() => setOnboarding('edit')} />}
        {!loggedIn && (
          <Login
            key={`login-${navKey}`}
            initial={screen === 'login-email' ? 'email' : screen === 'login-code' ? 'check' : 'start'}
            onDone={() => setLoggedIn(true)}
          />
        )}
        {loggedIn && !registered && (
          <Register
            key={`register-${navKey}`}
            initialStep={registerStep}
            initialCamera={registerCamera}
            onDone={() => setRegistered(true)}
            onBack={() => setLoggedIn(false)}
          />
        )}
        {loggedIn && registered && onboarding === null && !notifyDone && (
          <Notifications key={`notif-${navKey}`} onDone={() => setNotifyDone(true)} />
        )}
        {loggedIn && registered && onboarding && (
          <Onboarding
            key={`onb-${navKey}`}
            initialStep={screen === 'welcome' ? 0 : screen === 'interests' ? 1 : screen === 'brands' ? 2 : undefined}
            initial={prefs}
            onFinish={(p) => {
              setPrefs(p);
              setOnboarding(null);
              setSavedToast((n) => n + 1);
            }}
            onClose={() => setOnboarding(null)}
          />
        )}
        <TabBar active={tab} hidden={tabBarHidden} onChange={setTab} />
        {savedToast > 0 && (
          <Toast key={savedToast} message="Your preferences were saved" onClose={() => setSavedToast(0)} />
        )}
        {tab === 'trips' && !firstRunOpen && onboarding === null && !locationAsked && (
          <LocationAlert onAnswer={() => setLocationAsked(true)} />
        )}
        {nearby === 'shown' && (
          <NearbyNotice
            key={`nearby-${navKey}`}
            onClose={(open) => {
              setNearby('done');
              if (open) setTab('trips');
            }}
          />
        )}
        <QrFab key={`qr-${navKey}`} hidden={qrHidden} low={tabBarHidden} defaultOpen={screen === 'qr'} />
        <div className="device__home" aria-hidden="true" />
      </div>
      <ScreenNav current={screen} onSelect={goTo} />
    </div>
  );
}
