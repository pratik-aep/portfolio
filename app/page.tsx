import { ContactSection } from "@/components/contact/ContactSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { LaptopShowcaseLoader } from "@/components/laptop/LaptopShowcaseLoader";

export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />
      <LaptopShowcaseLoader />
      <FeaturedProjects />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
