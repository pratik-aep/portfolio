import { site } from "@/data/site";

export function Wordmark() {
  return (
    <span className="wordmark">
      {site.name}
      <span className="brand-dot" />
    </span>
  );
}
