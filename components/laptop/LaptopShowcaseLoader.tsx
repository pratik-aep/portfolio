"use client";
import dynamic from "next/dynamic";

// three.js and the scene load on the client only, after first paint. The
// placeholder reserves the section's height so nothing shifts.
export const LaptopShowcaseLoader = dynamic(() => import("./LaptopShowcase"), {
  ssr: false,
  loading: () => (
    <div
      className="showcase-placeholder"
      aria-label="Loading interactive showcase"
    />
  ),
});
