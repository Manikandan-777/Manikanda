import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { profile, settings, socials } from "@/lib/content";

function ChannelRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="flex items-center gap-2.5 text-fg">
        <span className="text-accent">{icon}</span>
        {value}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
        {label}
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-accent-ink"
        >
          {inner}
        </a>
      ) : (
        <div className="flex items-center justify-between gap-4 py-3.5">{inner}</div>
      )}
    </li>
  );
}

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Get in touch" index="06" dividerTop>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="max-w-sm text-lg text-muted">
            <span className="text-fg">Have a project, a question, or an opportunity?</span>{" "}
            Send a message, or reach me on any channel below.
          </p>

          <ul className="mt-8 divide-y divide-border border-y border-border text-sm">
            <ChannelRow
              icon={<Mail size={15} />}
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
            />
            {profile.phone && (
              <ChannelRow
                icon={<Phone size={15} />}
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
              />
            )}
            {profile.location && (
              <ChannelRow
                icon={<MapPin size={15} />}
                label="Location"
                value={profile.location}
              />
            )}
          </ul>

          <SocialLinks items={socials} className="mt-8" />
        </div>

        <ContactForm
          provider={settings.contact.provider}
          accessKey={settings.contact.accessKey}
        />
      </div>
    </Section>
  );
}
