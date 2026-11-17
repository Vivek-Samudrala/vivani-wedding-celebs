import { useEffect, useState } from "react";
import { EVENTS } from "./events";
import AddPage from "./pages/AddPage";
import CapturePage from "./pages/CapturePage";
import EventPage from "./pages/EventPage";
import Home from "./pages/Home";

// Hash routing (#/haldi) so the site works on any static host with no server setup.
const slugFromHash = () => location.hash.replace(/^#\/?/, "");

export default function App() {
  const [slug, setSlug] = useState(slugFromHash);
  useEffect(() => {
    const onChange = () => {
      setSlug(slugFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const [head, rest] = slug.split("/");
  const find = (s?: string) => EVENTS.find((e) => e.slug === s);
  if (head === "add") return <AddPage key={rest ?? "all"} event={find(rest)} />;
  if (head === "card" && find(rest)) return <CapturePage event={find(rest)!} />;
  const event = find(slug);
  return event ? <EventPage event={event} /> : <Home />;
}
