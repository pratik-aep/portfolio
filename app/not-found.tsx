import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <span className="eyebrow">404</span>
      <h1>A little off the path.</h1>
      <p>Let&apos;s get you back to something good.</p>
      <Link className="button" href="/">
        Back home →
      </Link>
    </main>
  );
}
