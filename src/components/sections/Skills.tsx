import { SkillsShowcase } from "@/components/sections/SkillsShowcase";
import { skillGroups, skillOrbit, skillsIntro } from "@/lib/content";

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 py-20 md:py-28">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-fg"
        style={{
          boxShadow: "0 0 14px 1px color-mix(in srgb, var(--accent) 65%, transparent)",
        }}
      />
      <SkillsShowcase intro={skillsIntro} groups={skillGroups} orbit={skillOrbit} />
    </section>
  );
}
