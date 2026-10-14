import { asset } from "@/lib/asset";

// Single source of project content: homepage cards, the laptop screens,
// /projects/ and the detail pages all read from here.
export const projects = [
  {
    slug: "lake-monitoring",
    title: "Lake Monitoring System",
    category: "IoT & Data",
    image: asset("/previews/lake.svg"),
    description:
      "An intelligent monitoring platform that transforms environmental sensor data into actionable insights.",
    short: "Making the invisible visible.",
    tags: ["React", "IoT", "Data Visualization"],
    features: [
      "A clear view of water quality",
      "Sensor readings in one place",
      "Trends that are easy to explore",
    ],
  },
  {
    slug: "antarctic-route-planner",
    title: "Antarctic Route Planner",
    category: "Geospatial & AI",
    image: asset("/previews/antarctic.svg"),
    description:
      "A data-driven route planning platform for safer and more efficient Antarctic navigation.",
    short: "A clearer path through complexity.",
    tags: ["Python", "FastAPI", "Geospatial"],
    features: [
      "Geographic route visualization",
      "Environmental condition overlays",
      "A focused planning interface",
    ],
  },
  {
    slug: "exoplanet-classifier",
    title: "NASA Exoplanet Classifier",
    category: "Machine Learning",
    image: asset("/previews/space.svg"),
    description:
      "A machine learning application that analyzes astronomical data to classify exoplanet candidates.",
    short: "Finding patterns beyond our world.",
    tags: ["Python", "Machine Learning", "FastAPI"],
    features: [
      "Planetary candidate exploration",
      "Readable classification results",
      "Data presented with context",
    ],
  },
  {
    slug: "medical-simulation",
    title: "3D Medical Simulation",
    category: "Interactive 3D",
    image: asset("/previews/medical.svg"),
    description:
      "An immersive 3D experience for exploring complex anatomical structures.",
    short: "A new perspective on learning.",
    tags: ["React", "Three.js", "WebGL"],
    features: [
      "Spatial anatomical exploration",
      "Focused learning interactions",
      "An immersive visual interface",
    ],
  },
] as const;

export type Project = (typeof projects)[number];
