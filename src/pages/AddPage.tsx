import { useEffect } from "react";
import { COUPLE, EVENTS, dayLabel, type EventInfo } from "../events";
import { downloadIcs, googleLink } from "../lib/calendar";

const sorted = [...EVENTS].sort((a, b) => a.start.localeCompare(b.start));
const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/i.test(ua) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(ua);

/** The page the PDF's "Add to calendar" buttons open. It picks the right calendar for the guest's phone. */
export default function AddPage({ event }: { event?: EventInfo }) {
  const events = event ? [event] : sorted;
  const file = event ? `${event.slug}.ics` : "vivek-shivani-wedding.ics";

  useEffect(() => {
    // iPhone/iPad/Mac: hand over the calendar file. Android: open Google Calendar for a single event.
    const t = setTimeout(() => {
      if (isIOS) downloadIcs(events, file);
      else if (isAndroid && event) window.location.href = googleLink(event);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const hint = isIOS
    ? "Opening your calendar… tap “Add” to save. If nothing opens, tap the button below."
    : isAndroid
      ? event
        ? "Opening Google Calendar… If nothing opens, tap “Google Calendar”."
        : "Tap the button, then open the file with your Calendar app."
      : "Click the button, then open the downloaded file.";

  return (
    <main className="page add-page">
      <a className="back" href="#/">
        ← All celebrations
      </a>
      <section className="panel">
        <p className="eyebrow">
          {COUPLE.a} &amp; {COUPLE.b}
        </p>
        <h1 className="script panel__title">{event ? event.name : "All celebrations"}</h1>
        {events.map((e) => (
          <p key={e.slug} className="panel__when">
            <b>{e.name}</b>
            <br />
            {dayLabel(e)} · {e.time}
          </p>
        ))}
        <p className="note">{hint}</p>
        <div className="actions">
          <button className="btn" onClick={() => downloadIcs(events, file)}>
            {isIOS ? "Add to Apple Calendar" : event ? "Add to calendar (Outlook / Apple)" : "Add all to my calendar"}
          </button>
          {events.map((e) => (
            <a key={e.slug} className="btn btn--alt" href={googleLink(e)} target="_blank" rel="noreferrer">
              Google Calendar{events.length > 1 ? ` – ${e.name}` : ""}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
