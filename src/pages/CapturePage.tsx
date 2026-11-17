import { Card } from "./EventPage";
import type { EventInfo } from "../events";

/** Just the invitation card at a fixed 1080px width, no page around it. Used to make the PDFs (#/card/<slug>). */
export default function CapturePage({ event }: { event: EventInfo }) {
  return (
    <div className="capture" id="capture">
      <Card e={event} />
    </div>
  );
}
