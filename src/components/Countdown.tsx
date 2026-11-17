import { useEffect, useState } from "react";
import { toDate } from "../events";

export default function Countdown({ at, label }: { at: string; label?: string }) {
  const target = toDate(at).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  let left = target - now;
  if (left <= 0) return null;
  const parts: [string, number][] = [["Days", 864e5], ["Hours", 36e5], ["Mins", 6e4], ["Secs", 1e3]];
  return (
    <div className="countdown" role="timer" aria-label={label ?? "Countdown"}>
      <div className="countdown__row">
        {parts.map(([name, ms]) => {
          const n = Math.floor(left / ms);
          left -= n * ms;
          return (
            <div key={name}>
              <b>{String(n).padStart(2, "0")}</b>
              {name}
            </div>
          );
        })}
      </div>
      {label && <p className="countdown__label">{label}</p>}
    </div>
  );
}
