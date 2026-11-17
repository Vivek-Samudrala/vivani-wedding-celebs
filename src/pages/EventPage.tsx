import ArtInvitation from "../components/ArtInvitation";
import Countdown from "../components/Countdown";
import StageInvitation from "../components/StageInvitation";
import { EVENTS, dayLabel, type EventInfo } from "../events";
import { downloadIcs, googleLink } from "../lib/calendar";

const sorted = [...EVENTS].sort((a, b) => a.start.localeCompare(b.start));

export function Card({ e }: { e: EventInfo }) {
  if (e.card === "stage") return <StageInvitation event={e} />;
  if (e.card === "image" && e.art) return <img className="finished" src={e.art} alt={`${e.name} invitation`} />;
  return <ArtInvitation event={e} />;
}

export default function EventPage({ event: e }: { event: EventInfo }) {
  const i = sorted.findIndex((x) => x.slug === e.slug);
  const prev = sorted[i - 1];
  const next = sorted[i + 1];
  const both = [e];

  return (
    <main className="page event-page">
      <a className="back" href="#/">
        ← All celebrations
      </a>
      <div className="event-page__card">
        <Card e={e} />
      </div>

      {both.map((x) => (
        <section className="panel" key={x.slug}>
          <h2 className="script">{x.name}</h2>
          <p className="panel__when">
            <b>{dayLabel(x)}</b>
            <br />
            {x.time}
          </p>
          <p className="panel__where">
            {x.venue}, {x.address}
          </p>
          <Countdown at={x.start} label={`until ${x.name}`} />
          <div className="actions">
            <button className="btn" onClick={() => downloadIcs([x], `${x.slug}.ics`)}>
              Add to calendar
            </button>
            <a className="btn btn--alt" href={x.maps} target="_blank" rel="noreferrer">
              Get directions
            </a>
            <a className="btn btn--alt" href={googleLink(x)} target="_blank" rel="noreferrer">
              Google Calendar
            </a>
          </div>
        </section>
      ))}

      <nav className="pager" aria-label="More celebrations">
        {prev ? <a href={`#/${prev.slug}`}>← {prev.name}</a> : <span />}
        {next ? <a href={`#/${next.slug}`}>{next.name} →</a> : <span />}
      </nav>
    </main>
  );
}
