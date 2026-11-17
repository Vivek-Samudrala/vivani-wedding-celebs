/** Soft decorative roses for the corners of the home page (placeholder until real artwork). */
function Rose({ x, y, r, c }: { x: number; y: number; r: number; c: [string, string, string] }) {
  const rings: [number, number, number, number][] = [[8, 0.62, 0.46, 0], [7, 0.42, 0.38, 1], [5, 0.22, 0.3, 1], [3, 0.08, 0.22, 2]];
  return (
    <g transform={`translate(${x} ${y})`}>
      {rings.flatMap(([n, rad, pr, ci], ring) =>
        Array.from({ length: n }, (_, k) => (
          <ellipse
            key={`${ring}-${k}`}
            cx={0}
            cy={-r * rad}
            rx={r * pr}
            ry={r * pr * 1.1}
            fill={c[ci]}
            stroke="#fff"
            strokeOpacity={0.5}
            transform={`rotate(${(360 / n) * k + ring * 23})`}
          />
        )),
      )}
    </g>
  );
}

function Leaf({ x, y, l, a }: { x: number; y: number; l: number; a: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${a})`}
      d={`M0 0 C${l * 0.3} ${-l * 0.25} ${l * 0.75} ${-l * 0.2} ${l} 0 C${l * 0.75} ${l * 0.2} ${l * 0.3} ${l * 0.25} 0 0Z`}
      fill="#B7CDB4"
      stroke="#9DB79B"
    />
  );
}

const PINK: [string, string, string] = ["#F8C9C0", "#F2A9A8", "#E58E94"];
const PEACH: [string, string, string] = ["#FBD9CF", "#F6BFB8", "#EBA0A4"];
const IVORY: [string, string, string] = ["#FFF3EA", "#F9E2D6", "#F0C9BC"];

export default function Roses() {
  return (
    <>
      <svg className="roses roses--tr" viewBox="0 0 300 300" aria-hidden="true">
        <Leaf x={150} y={90} l={90} a={200} />
        <Leaf x={190} y={150} l={80} a={150} />
        <Leaf x={230} y={60} l={70} a={250} />
        <Rose x={220} y={90} r={70} c={PINK} />
        <Rose x={120} y={70} r={50} c={PEACH} />
        <Rose x={255} y={185} r={42} c={IVORY} />
      </svg>
      <svg className="roses roses--bl" viewBox="0 0 300 300" aria-hidden="true">
        <Leaf x={60} y={200} l={90} a={-20} />
        <Leaf x={120} y={250} l={80} a={-60} />
        <Leaf x={40} y={120} l={70} a={20} />
        <Rose x={90} y={220} r={68} c={PINK} />
        <Rose x={190} y={255} r={48} c={IVORY} />
        <Rose x={50} y={140} r={40} c={PEACH} />
      </svg>
    </>
  );
}
