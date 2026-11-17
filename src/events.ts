// All event details live here. Add or edit events and every page updates.
// Times are India time (IST). "card" decides how the invitation is drawn:
//   "art"    – YOUR image as the background with our text on top (set `art`, tune `overlay`)
//   "image"  – a finished card image shown as-is
//   "stage"  – animated decor photo with the VS monogram and our details underneath (Reception)
//
// To use a new Pinterest image for an event: save it in public/assets/, set `art` to its path, set
// card to "art", then adjust `overlay` until the text sits in the clear area. Add ?debug to the page
// address (e.g. /?debug#/haldi) to see the text box outlined while you tune it.

/** Where the text goes on the image, as % of the image (top/left/right/bottom are insets). */
export type Overlay = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  ink?: string; // main text colour
  accent?: string; // event name colour
  panel?: string; // fill that hides any old text on the image; "none" for no panel
  blessing?: string; // optional line at the very top, e.g. "|| Shree Ganeshaya Namah ||"
  ratio?: string; // image aspect ratio, e.g. "668 / 965"
  nameSize?: number; // event-name size in % of card width (default 11.5)
  hide?: ("tag" | "couple")[]; // drop lines when the clear area is small
  glow?: number; // softness of the cover's edge in % of card width (default 3.2); small keeps nearby artwork crisp
  sparkles?: boolean; // twinkling lights over the text area (for night-sky images)
  // Second text box for date + venue when the image keeps them apart (e.g. title at the top, details at the bottom)
  split?: { top: number; left: number; right: number; bottom: number; panel?: string; align?: "start" | "end" }; // align: where the text sits in its box (default end)
};

export type EventInfo = {
  slug: string;
  name: string;
  tagline: string;
  start: string; // local IST, YYYY-MM-DDTHH:MM
  end: string;
  time: string; // wording shown to guests
  venue: string;
  address: string;
  maps: string;
  card: "art" | "image" | "stage";
  art?: string;
  overlay?: Overlay;
};

const search = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// Where the site is published. The PDF buttons point here. Check it on Firebase console > Hosting after the first deploy.
export const SITE_URL = "https://vivani-wedding-celebs.web.app";
export const COUPLE = { a: "Vivek", b: "Shivani" };
export const WEDDING_MOMENT = { label: "until the wedding", at: "2026-11-26T09:28" };

export const EVENTS: EventInfo[] = [
  {
    slug: "haldi",
    name: "Haldi",
    tagline: "A morning of colour, laughter and love",
    start: "2026-11-21T09:30",
    end: "2026-11-21T12:30",
    time: "9:30 AM onwards",
    venue: "The Village Vibes",
    address: "The Village Vibes farm house & banquet hall, Nadergul Road, Adibatla, Hyderabad, Telangana 501510",
    maps: "https://maps.app.goo.gl/gDjck3PeDfncpWUF6",
    card: "image",
    art: "/assets/haldi.webp",
  },
  {
    slug: "pellikoduku",
    name: "Pellikoduku & Formalities",
    tagline: "Blessings and traditions before the big day",
    start: "2026-11-22T08:00",
    end: "2026-11-22T12:00",
    time: "8:00 AM onwards",
    venue: "Home",
    address: "Nehru Nagar Arch, Nandigama",
    maps: "https://maps.app.goo.gl/nrG9gFJHvzZ5Qw8A8",
    card: "art",
    art: "/assets/pellikoduku.webp",
    overlay: {
      // two boxes, each only as big as the old wording it hides: a wide one for the title (the arch is wide
      // there) and a narrower one for date + place (a leaf comes close on the left)
      top: 37.4, left: 15, right: 14, bottom: 49.6, ratio: "736 / 1030",
      ink: "#3e2523", accent: "#801d2e", panel: "#fef7ee", glow: 1.2, hide: ["tag", "couple"],
      blessing: "|| Shree Ganeshaya Namah ||",
      nameSize: 6.8,
      split: { top: 51.5, left: 29.5, right: 26.5, bottom: 33, align: "start" },
    },
  },
  {
    slug: "odugu",
    name: "Odugu",
    tagline: "A cherished family ritual",
    start: "2026-11-25T06:00",
    end: "2026-11-25T09:00",
    time: "6:00 AM onwards",
    venue: "Home",
    address: "Nehru Nagar Arch, Nandigama",
    maps: "https://maps.app.goo.gl/nrG9gFJHvzZ5Qw8A8",
    card: "art",
    art: "/assets/odugu.webp",
    overlay: {
      top: 24.5, left: 18, right: 17.5, bottom: 54.8, ratio: "1200 / 1691",
      ink: "#4a1f1a", accent: "#6e1f1a", panel: "#fdf8f0", hide: ["couple"],
      // date + venue go in a second box at the bottom, between the pots
      split: { top: 88.6, left: 24, right: 24, bottom: 3.2, panel: "#f8e6c8" },
    },
  },
  {
    slug: "wedding",
    name: "Wedding",
    tagline: "Muhurtam at 9:28 AM",
    start: "2026-11-26T07:30",
    end: "2026-11-26T13:00",
    time: "7:30 AM onwards · Muhurtam 9:28 AM",
    venue: "SPR Srirasthu Convention",
    address: "Sagar Road, near Injapur, Neeladrinagar, Hyderabad",
    maps: search("SPR Srirasthu Convention, Sagar Road, near Injapur, Neeladrinagar, Hyderabad"),
    card: "image",
    art: "/assets/wedding.webp",
  },
  {
    slug: "vratham",
    name: "Vratham & Reception",
    tagline: "Prayers, blessings and a joyful feast with family",
    start: "2026-11-28T09:00",
    end: "2026-11-28T13:00",
    time: "9:00 AM onwards",
    venue: "Kamma Kalyana Mandapam",
    address: "Nandigama",
    maps: "https://maps.app.goo.gl/4T3p1zKJrQ9yB7mL8",
    card: "art",
    art: "/assets/vratham.webp",
    overlay: {
      top: 20.5, left: 15.5, right: 15.5, bottom: 22.5, ratio: "1024 / 1536",
      ink: "#5a1a1a", accent: "#7a1f1a",
      // cream that matches the paper; a soft glow in the same colour feathers the edges
      panel: "#fdf0d6",
    },
  },
  {
    slug: "reception",
    name: "Reception",
    tagline: "An evening of dinner, music and celebration",
    start: "2026-11-30T18:00",
    end: "2026-11-30T22:00",
    time: "6:00 PM onwards",
    venue: "Skandha Farm Stay",
    address: "Near Nusthulapur, Kothapally, Karimnagar",
    maps: search("Skandha Farm Stay, near Nusthulapur, Kothapally, Karimnagar"),
    card: "art",
    art: "/assets/reception-night.webp",
    overlay: {
      top: 2.2, left: 14.5, right: 14.5, bottom: 69.6, ratio: "1080 / 1920",
      ink: "#f3e8d0", accent: "#f3dfa6", panel: "#04141f", // same navy as the sky, edges feathered by a glow
      nameSize: 10, hide: ["tag"], sparkles: true,
    },
    // The earlier option, the decor photo with the VS monogram, is still available: card: "stage", art: "/assets/reception-stage.webp"
  },
];

export const toDate = (local: string) => new Date(`${local}:00+05:30`);
export const dayLabel = (e: EventInfo) =>
  toDate(e.start).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
export const shortDay = (e: EventInfo) =>
  toDate(e.start).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
