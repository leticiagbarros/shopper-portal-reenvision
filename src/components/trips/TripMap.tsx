import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BAG_SVG } from './icons';
import { CATEGORY_COLORS, brandOfStore, type City, type Store } from '../../data/places';
import { titleHeight, type Snap } from './BottomSheet';

export interface OverviewPin {
  id: string;
  label: string;
  city: City;
}

export type MapScene =
  | { kind: 'overview'; pins: OverviewPin[] }
  | { kind: 'city'; city: City; stores: Store[]; savedIds: string[]; doneIds: string[]; selectedId: string | null };

interface Props {
  scene: MapScene;
  snap: Snap;
  onOpenTrip: (tripId: string) => void;
  onSelectStore: (storeId: string) => void;
}

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '© OpenStreetMap contributors';
const TOP_INSET = 110;

function sheetInset(map: L.Map, snap: Snap) {
  if (snap === 'title') return titleHeight(map.getContainer());
  return snap === 'peek' ? 230 : Math.round(map.getSize().y * 0.56);
}

function tripPin(pin: OverviewPin) {
  const root = document.createElement('div');
  root.className = 'pin-trip';
  const thumb = document.createElement('span');
  thumb.className = 'pin-trip__thumb';
  thumb.style.backgroundImage = `url("${pin.city.image}")`;
  thumb.style.backgroundPosition = pin.city.imagePosition;
  const label = document.createElement('span');
  label.className = 'pin-trip__label';
  label.textContent = pin.label;
  root.append(thumb, label);
  return L.divIcon({ html: root, className: 'pin-wrap', iconSize: [72, 72], iconAnchor: [36, 26] });
}

function storePin(store: Store, saved: boolean, done: boolean, selected: boolean) {
  const brand = brandOfStore(store.id);
  const el = document.createElement('div');
  el.className = `pin-store${brand ? ' has-logo' : ''}${saved ? ' is-saved' : ''}${done ? ' is-done' : ''}${selected ? ' is-selected' : ''}`;
  if (brand) {
    const img = document.createElement('img');
    img.src = brand.logo;
    img.alt = '';
    img.draggable = false;
    el.append(img);
  } else {
    el.style.background = CATEGORY_COLORS[store.category];
    el.innerHTML = BAG_SVG;
  }
  return L.divIcon({ html: el, className: 'pin-wrap', iconSize: [36, 36], iconAnchor: [18, 18] });
}

export function TripMap({ scene, snap, onOpenTrip, onSelectStore }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const cb = useRef({ onOpenTrip, onSelectStore });
  cb.current = { onOpenTrip, onSelectStore };

  useEffect(() => {
    if (!elRef.current) return;
    const map = L.map(elRef.current, { zoomControl: false, attributionControl: false, worldCopyJump: true });
    map.setView([48, 10], 4);
    L.tileLayer(TILES, { maxZoom: 19 }).addTo(map);
    L.control.attribution({ position: 'topleft', prefix: false }).addAttribution(ATTRIBUTION).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (scene.kind === 'overview') {
      scene.pins.forEach((pin) => {
        L.marker(pin.city.center, { icon: tripPin(pin), keyboard: false })
          .on('click', () => cb.current.onOpenTrip(pin.id))
          .addTo(layer);
      });
    } else {
      const saved = new Set(scene.savedIds);
      const done = new Set(scene.doneIds);
      scene.stores.forEach((store) => {
        L.marker([store.lat, store.lng], {
          icon: storePin(store, saved.has(store.id), done.has(store.id), store.id === scene.selectedId),
          keyboard: false,
          zIndexOffset: store.id === scene.selectedId ? 1000 : 0,
        })
          .on('click', () => cb.current.onSelectStore(store.id))
          .addTo(layer);
      });
    }
  }, [scene]);

  // Re-frame when the scene or the filtered stores change, so a search brings its results into view.
  const viewKey =
    scene.kind === 'overview'
      ? `overview:${scene.pins.map((p) => p.id).join(',')}`
      : `city:${scene.city.id}:${scene.stores.map((s) => s.id).join(',')}`;

  // Re-frame only when the view key or the sheet size changes, not on every marker update.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const inset = sheetInset(map, snap) + 16;
    const opts = { paddingTopLeft: L.point(24, TOP_INSET), paddingBottomRight: L.point(24, inset), duration: 0.8 };
    if (scene.kind === 'overview') {
      if (scene.pins.length === 0) return;
      map.flyToBounds(L.latLngBounds(scene.pins.map((p) => p.city.center)), { ...opts, maxZoom: 5 });
    } else {
      const pts = scene.stores.map((s) => L.latLng(s.lat, s.lng));
      map.flyToBounds(pts.length ? L.latLngBounds(pts) : L.latLngBounds([scene.city.center, scene.city.center]), {
        ...opts,
        maxZoom: 14,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey, snap]);

  const selectedId = scene.kind === 'city' ? scene.selectedId : null;
  useEffect(() => {
    const map = mapRef.current;
    if (!map || scene.kind !== 'city' || !selectedId) return;
    const store = scene.stores.find((s) => s.id === selectedId);
    if (!store) return;
    const zoom = Math.max(map.getZoom(), 15);
    const shift = (sheetInset(map, snap) - TOP_INSET / 2) / 2;
    const center = map.unproject(map.project([store.lat, store.lng], zoom).add([0, shift]), zoom);
    map.flyTo(center, zoom, { duration: 0.5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return <div className="trip-map" ref={elRef} />;
}
