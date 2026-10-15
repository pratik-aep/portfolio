import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { Horizon } from "@/components/home/Horizon";
import type { Metadata } from "next";
import { LaptopShowcaseLoader } from "@/components/laptop/LaptopShowcaseLoader";
import { shareMetadata, site } from "@/data/site";

export const metadata: Metadata = shareMetadata({
  path: "/",
  title: `${site.name} — Engineering what's next`,
});

export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />
      <LaptopShowcaseLoader />
      <FeaturedProjects />
      <Horizon />
      <AboutSection />
      <ContactCTA />
    </main>
  );
}
