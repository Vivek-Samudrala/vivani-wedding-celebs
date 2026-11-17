import Countdown from "../components/Countdown";
import Roses from "../components/Roses";
import { COUPLE, EVENTS, WEDDING_MOMENT, shortDay, toDate } from "../events";
import { downloadIcs } from "../lib/calendar";

const sorted = [...EVENTS].sort((a, b) => a.start.localeCompare(b.start));
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-IN", { ...o, timeZone: "Asia/Kolkata" });

export default function Home() {
  const first = toDate(sorted[0].start);
  const last = toDate(sorted[sorted.length - 1].start);
  const range = `${fmt(first, { day: "numeric" })} – ${fmt(last, { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <main className="page home">
      <Roses />
      <header className="home__head">
        <p className="eyebrow">Together with our families</p>
        <h1 className="script home__couple">
          {COUPLE.a} &amp; {COUPLE.b}
        </h1>
        <p className="eyebrow">invite you to our wedding celebrations</p>
        <p className="home__range">{range}</p>
        <Countdown at={WEDDING_MOMENT.at} label={WEDDING_MOMENT.label} />
        <button className="btn" onClick={() => downloadIcs(EVENTS, "vivek-shivani-wedding.ics")}>
          Add all events to calendar
        </button>
      </header>

      <div className="tl">
        {sorted.map((e, i) => {
          const d = toDate(e.start);
          return (
            <section key={e.slug} className={`stop ${i % 2 ? "stop--r" : ""}`}>
              <a className="medal" href={`#/${e.slug}`} aria-label={`${e.name} invitation`}>
                <span className="medal__title script">{e.name}</span>
                <span className="medal__date">
                  <b>{fmt(d, { day: "numeric" })}</b>
                  {fmt(d, { month: "short" })}
                </span>
              </a>
              <p className="stop__cap">
                <b>{shortDay(e)}</b>
                <br />
                {e.time}
                <br />
                {e.venue}
              </p>
              <a className="pill" href={`#/${e.slug}`}>
                Open invitation
              </a>
            </section>
          );
        })}
      </div>
      <footer className="home__foot">With love, {COUPLE.a} &amp; {COUPLE.b}</footer>
    </main>
  );
}
