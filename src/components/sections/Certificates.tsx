import { Reveal } from "@/components/Reveal";
import { CertificateStack } from "@/components/ui/certificate-stack";
import { certificates } from "@/lib/content";

export function Certificates() {
  return (
    <section id="certificates" className="relative scroll-mt-24 py-20 md:py-28">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-fg"
        style={{
          boxShadow: "0 0 14px 1px color-mix(in srgb, var(--accent) 65%, transparent)",
        }}
      />

      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#080d0b] p-5 ring-1 ring-white/10 sm:p-10 md:p-14">
            {/* faint green atmosphere */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%)",
              }}
            />

            {/* top row: 04 / 3D Perspective  ·  DRAG TO EXPLORE */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-sm text-white/35">04</span>
                  <span className="text-sm font-semibold text-white">3D Perspective</span>
                </p>
                <p className="mt-1 text-sm text-white/50">Interactive 3D card stack.</p>
              </div>
              <p className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                Drag to explore
              </p>
            </div>

            {/* main: left copy (~42%) + right 3D stack (~58%) */}
            <div className="mt-10 grid items-center gap-10 md:mt-12 md:grid-cols-[42%_58%] md:gap-8">
              <div>
                <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.2rem)] leading-[1.08] text-white">
                  Certificates
                  <br />
                  That Build
                  <br />
                  My Journey.
                </h2>
                <p className="mt-6 text-white/55">
                  Each certificate
                  <br />
                  represents a new skill,
                  <br />
                  a new opportunity.
                </p>
              </div>

              <CertificateStack items={certificates} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
