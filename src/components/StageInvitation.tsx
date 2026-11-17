import { COUPLE, dayLabel, type EventInfo } from "../events";

// Twinkles near the chandeliers and the glowing globes: [left %, top %, size px, delay s]
const SPARKLES: [number, number, number, number][] = [
  [14, 9, 5, 0], [19, 16, 4, 1.2], [9, 20, 3, 2.1], [23, 27, 4, 0.6],
  [84, 10, 5, 0.8], [90, 19, 4, 1.8], [78, 24, 3, 0.3], [95, 28, 4, 2.4],
  [47, 45, 4, 1.0], [33, 56, 3, 2.7], [61, 60, 4, 1.5],
  [12, 72, 6, 0.4], [30, 80, 5, 1.9], [60, 82, 5, 0.9], [88, 74, 6, 2.2],
];

/** Reception: the decor photo (gently moving, twinkling), a VS monogram where the old one was, and our details. */
export default function StageInvitation({ event: e }: { event: EventInfo }) {
  return (
    <article className="stage" aria-label={`Invitation to ${e.name}`}>
      <div className="stage__photo">
        <img className="stage__img" src={e.art} alt="" />
        <span className="stage__shine" aria-hidden="true" />
        {SPARKLES.map(([x, y, s, d], i) => (
          <i key={i} className="stage__spark" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s` }} aria-hidden="true" />
        ))}
        <span className="stage__vs" aria-label={`${COUPLE.a[0]} and ${COUPLE.b[0]}`}>
          {COUPLE.a[0]}
          <i>{COUPLE.b[0]}</i>
        </span>
      </div>

      <div className="stage__details">
        <p className="stage__eyebrow">Together with our families</p>
        <p className="stage__eyebrow stage__eyebrow--soft">request the pleasure of your company at the</p>
        <h1 className="stage__name">{e.name}</h1>
        <p className="stage__couple">
          {COUPLE.a} <i>&amp;</i> {COUPLE.b}
        </p>
        <p className="stage__date">
          <strong>{dayLabel(e)}</strong>
          <span>{e.time}</span>
        </p>
        <address className="stage__where">
          <span>{e.venue}</span>
          {e.address}
        </address>
      </div>
    </article>
  );
}
