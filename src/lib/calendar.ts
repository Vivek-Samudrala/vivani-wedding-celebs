import { COUPLE, toDate, type EventInfo } from "../events";

const utc = (local: string) => toDate(local).toISOString().replace(/[-:]|\.\d+/g, "");
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const title = (e: EventInfo) => `${e.name} – ${COUPLE.a} & ${COUPLE.b}`;
const where = (e: EventInfo) => `${e.venue}, ${e.address}`;
const notes = (e: EventInfo) => `${e.tagline}\n\nDirections: ${e.maps}`;

/** One calendar file with any number of events (each gets a reminder the day before and 2 hours before). */
export function buildIcs(events: EventInfo[]): string {
  const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${COUPLE.a} & ${COUPLE.b}//Wedding//EN`, "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.slug}-${e.start.slice(0, 10)}@vivek-shivani`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${utc(e.start)}`,
      `DTEND:${utc(e.end)}`,
      `SUMMARY:${esc(title(e))}`,
      `LOCATION:${esc(where(e))}`,
      `DESCRIPTION:${esc(notes(e))}`,
      `URL:${e.maps}`,
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc("Tomorrow: " + title(e))}`, "TRIGGER:-P1D", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc("In 2 hours: " + title(e))}`, "TRIGGER:-PT2H", "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function downloadIcs(events: EventInfo[], filename: string) {
  const url = URL.createObjectURL(new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function googleLink(e: EventInfo): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: title(e),
    dates: `${utc(e.start)}/${utc(e.end)}`,
    location: where(e),
    details: notes(e),
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
