import type { ComponentType } from "react";

import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { sections } from "@/lib/content";
import type { SectionId } from "@/lib/schema";

/** Section id → component. The order and visibility come from content/settings.json. */
const REGISTRY: Record<SectionId, ComponentType> = {
  about: About,
  skills: Skills,
  projects: Projects,
  certificates: Certificates,
  achievements: Achievements,
  contact: Contact,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {sections.map((section) => {
        const SectionComponent = REGISTRY[section.id];
        return SectionComponent ? <SectionComponent key={section.id} /> : null;
      })}
    </>
  );
}
