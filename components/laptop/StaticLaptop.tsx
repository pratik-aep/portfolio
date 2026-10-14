import Image from "next/image";
import { projects } from "@/data/projects";

/** CSS-only laptop for reduced motion and devices without WebGL2. */
export function StaticLaptop() {
  return (
    <div className="static-laptop">
      <div className="static-display">
        <Image
          src={projects[0].image}
          alt="Illustrative water quality monitoring interface in a laptop"
          width={1200}
          height={750}
        />
      </div>
      <div className="static-base" />
    </div>
  );
}
