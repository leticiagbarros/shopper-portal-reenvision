import addCardLayers from '../assets/illustrations/add-card/layers.json';
import luggageLayers from '../assets/illustrations/luggage/layers.json';

interface Layer {
  file: string;
  inset: string[];
}

const urls = import.meta.glob('../assets/illustrations/*/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const SETS: Record<'add-card' | 'luggage', Layer[]> = {
  'add-card': addCardLayers,
  luggage: luggageLayers,
};

export function Illustration({ name }: { name: 'add-card' | 'luggage' }) {
  return (
    <span className="illustration" aria-hidden="true">
      {SETS[name].map((layer) => {
        const [top, right, bottom, left] = layer.inset;
        return (
          <span key={layer.file} className="illustration__layer" style={{ top, right, bottom, left }}>
            <img src={urls[`../assets/illustrations/${name}/${layer.file}`]} alt="" />
          </span>
        );
      })}
    </span>
  );
}
