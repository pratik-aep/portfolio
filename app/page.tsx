import { AboutSection } from "@/components/home/AboutSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { Horizon } from "@/components/home/Horizon";
import { LaptopShowcaseLoader } from "@/components/laptop/LaptopShowcaseLoader";

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
