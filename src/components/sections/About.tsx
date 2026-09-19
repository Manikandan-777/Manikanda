import { Section } from "@/components/Section";
import { education, profile, roles } from "@/lib/content";
import type { Education, Role } from "@/lib/schema";

function TimelineEntry({
  title,
  place,
  when,
  detail,
  notes,
}: {
  title: string;
  place: string;
  when: string;
  detail: string;
  notes: string[];
}) {
  return (
    <li className="relative border-l border-border pl-6 pb-8 last:pb-0">
      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
      <p className="font-display text-lg text-fg">{title}</p>
      <p className="text-sm text-muted">{place}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-faint">
        {when}
        {detail && when ? " · " : ""}
        {detail}
      </p>
      {notes.length > 0 && (
        <ul className="mt-2 list-disc pl-4 text-sm text-muted">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Background" index="01">
      <div className="max-w-prose space-y-4 text-muted">
        <p className="text-lg text-fg">{profile.bio}</p>
      </div>

      {(education.length > 0 || roles.length > 0) && (
        <div className="mt-12">
          <h3 className="eyebrow mb-6">Education &amp; roles</h3>
          <ul>
            {education.map((e: Education) => (
              <TimelineEntry
                key={`${e.degree}-${e.institution}`}
                title={e.degree}
                place={[e.institution, e.location].filter(Boolean).join(" · ")}
                when={[e.start, e.end].filter(Boolean).join(" – ")}
                detail={e.detail}
                notes={e.notes}
              />
            ))}
            {roles.map((r: Role) => (
              <TimelineEntry
                key={`${r.title}-${r.organisation}`}
                title={r.title}
                place={[r.organisation, r.location].filter(Boolean).join(" · ")}
                when={[r.start, r.end].filter(Boolean).join(" – ")}
                detail={r.detail}
                notes={r.notes}
              />
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
