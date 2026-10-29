const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

export function ean13(base12: string): string {
  const sum = base12.split('').reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  return `${base12}${(10 - (sum % 10)) % 10}`;
}

function modules(code: string): string {
  const parity = PARITY[Number(code[0])];
  const left = code
    .slice(1, 7)
    .split('')
    .map((d, i) => (parity[i] === 'L' ? L : G)[Number(d)])
    .join('');
  const right = code
    .slice(7)
    .split('')
    .map((d) => R[Number(d)])
    .join('');
  return `101${left}01010${right}101`;
}

const QUIET = 9;

export function Barcode({ base12, large = false }: { base12: string; large?: boolean }) {
  const code = ean13(base12);
  const bits = modules(code);
  let d = '';
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') d += `M${i + QUIET} 0h1v100h-1z`;
  }

  return (
    <figure className={`barcode${large ? ' barcode--large' : ''}`}>
      <svg
        viewBox={`0 0 ${bits.length + QUIET * 2} 100`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Barcode ${code}`}
        shapeRendering="crispEdges"
      >
        <path d={d} fill="#000000" />
      </svg>
      <figcaption>{code}</figcaption>
    </figure>
  );
}
