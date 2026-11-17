import type { CSSProperties } from "react";
import { COUPLE, dayLabel, type EventInfo, type Overlay } from "../events";

const DEFAULT: Overlay = { top: 30, left: 12, right: 12, bottom: 12, ratio: "2 / 3" };
// Fixed twinkle positions inside the text box: [left %, top %, size px, delay s]
const TWINKLES: [number, number, number, number][] = [
  [8, 14, 3, 0], [22, 70, 2, 1.1], [35, 8, 3, 2.2], [48, 88, 2, 0.5], [62, 20, 3, 1.7],
  [77, 62, 2, 2.6], [90, 12, 3, 0.9], [14, 44, 2, 2], [84, 86, 3, 1.4], [55, 52, 2, 0.3],
];
const debug = typeof location !== "undefined" && new URLSearchParams(location.search).has("debug");

/** Your image as the background, with the event's details laid over it. Tune the text box in events.ts. */
export default function ArtInvitation({ event: e }: { event: EventInfo }) {
  const o = { ...DEFAULT, ...e.overlay };
  const vars = {
    aspectRatio: o.ratio,
    "--ink": o.ink ?? "#3b2326",
    "--accent": o.accent ?? "#8a2a3a",
    "--panel": o.panel ?? "none",
    "--glow": `calc(${o.glow ?? 3.2} * var(--u))`,
  } as CSSProperties;
  const details = (
    <>
      <p className="ai__date">
        <strong>{dayLabel(e)}</strong>
        <span>{e.time}</span>
      </p>
      <address className="ai__where">
        <span>{e.venue}</span>
        {e.address}
      </address>
    </>
  );
  return (
    <article className={`ai${debug ? " ai--debug" : ""}`} style={vars} aria-label={`Invitation to ${e.name}`}>
      {e.art ? <img className="ai__img" src={e.art} alt="" /> : <div className="ai__plain" />}
      <div className={`ai__copy${o.sparkles ? " ai__copy--stars" : ""}`} style={{ top: `${o.top}%`, left: `${o.left}%`, right: `${o.right}%`, bottom: `${o.bottom}%` }}>
        {o.sparkles && TWINKLES.map(([x, y, s, d], i) => (
          <i key={i} className="ai__spark" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s` }} aria-hidden="true" />
        ))}
        {o.blessing && <p className="ai__blessing">{o.blessing}</p>}
        <p className="ai__intro">You’re invited to</p>
        <h1 className="ai__name" style={o.nameSize ? { fontSize: `calc(${o.nameSize} * var(--u))` } : undefined}>{e.name}</h1>
        {!o.hide?.includes("tag") && <p className="ai__tag">{e.tagline}</p>}
        {!o.hide?.includes("couple") && (
          <p className="ai__couple">
            {COUPLE.a} <i>&amp;</i> {COUPLE.b}
          </p>
        )}
        {!o.split && details}
      </div>
      {o.split && (
        <div
          className={`ai__copy ai__copy--foot${o.split.align === "start" ? " ai__copy--start" : ""}`}
          style={{ top: `${o.split.top}%`, left: `${o.split.left}%`, right: `${o.split.right}%`, bottom: `${o.split.bottom}%`, "--panel": o.split.panel ?? o.panel } as CSSProperties}
        >
          {details}
        </div>
      )}
    </article>
  );
}
