export const site = {
  name: "forgeD",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
};
export const projects = [
  {
    slug: "lake-monitoring",
    title: "Lake Monitoring System",
    category: "IoT & data",
    image: "/previews/lake.svg",
    description:
      "An IoT-powered water quality monitoring platform with real-time sensor data and interactive visualizations.",
    short: "Making the invisible visible.",
    tags: ["IoT", "Data visualization"],
    features: [
      "A clear view of water quality",
      "Sensor readings in one place",
      "Trends that are easy to explore",
    ],
    color: "#427c76",
  },
  {
    slug: "antarctic-route-planner",
    title: "Antarctic Route Planner",
    category: "Geospatial",
    image: "/previews/antarctic.svg",
    description:
      "An intelligent routing platform designed to visualize environmental conditions and plan safer routes across Antarctic waters.",
    short: "A clearer path through complexity.",
    tags: ["Geospatial", "Route planning"],
    features: [
      "Geographic route visualization",
      "Environmental condition overlays",
      "A focused planning interface",
    ],
    color: "#668baf",
  },
  {
    slug: "exoplanet-classifier",
    title: "NASA Exoplanet Classifier",
    category: "Machine learning",
    image: "/previews/space.svg",
    description:
      "A machine learning application built to analyze planetary data and classify exoplanet candidates.",
    short: "Finding patterns beyond our world.",
    tags: ["Machine learning", "Data analysis"],
    features: [
      "Planetary candidate exploration",
      "Readable classification results",
      "Data presented with context",
    ],
    color: "#b29878",
  },
  {
    slug: "medical-simulation",
    title: "3D Medical Simulation",
    category: "Interactive 3D",
    image: "/previews/medical.svg",
    description:
      "An interactive 3D visualization experience designed to make anatomical exploration more immersive.",
    short: "A new perspective on learning.",
    tags: ["3D", "Visualization"],
    features: [
      "Spatial anatomical exploration",
      "Focused learning interactions",
      "An immersive visual interface",
    ],
    color: "#ae7678",
  },
] as const;
export type Project = (typeof projects)[number];
