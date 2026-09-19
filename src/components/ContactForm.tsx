"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "ok" | "error";

/** Underline field styled as a line in a code object. */
function Field({
  index,
  name,
  label,
  type = "text",
  autoComplete,
  textarea = false,
  rows,
}: {
  index: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const id = useId();
  const shared =
    "peer w-full border-0 border-b-2 border-border bg-transparent px-0 py-2 font-sans text-fg outline-none transition-colors placeholder:text-transparent focus:border-accent";
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
      >
        <span className="text-accent-ink">{index}</span> {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required
          rows={rows ?? 5}
          placeholder={label}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={label}
          className={shared}
        />
      )}
    </div>
  );
}

export function ContactForm({
  provider,
  accessKey,
}: {
  provider: "web3forms" | "formspree";
  accessKey: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const configured = !/^REPLACE/i.test(accessKey);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — real users never fill this.
    if (data.get("botcheck")) return;

    if (!configured) {
      setStatus("error");
      setError("The contact form isn’t connected yet. Email me directly for now.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const endpoint =
        provider === "web3forms"
          ? "https://api.web3forms.com/submit"
          : `https://formspree.io/f/${accessKey}`;

      const payload: Record<string, unknown> = {
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      };
      if (provider === "web3forms") payload.access_key = accessKey;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
      {/* code-object header */}
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4 font-mono text-xs">
        <span className="text-accent-ink">const</span>
        <span className="text-fg">message</span>
        <span className="text-faint">= {"{"}</span>
        <span className="ml-auto inline-flex gap-1" aria-hidden>
          <i className="h-2 w-2 rounded-full bg-accent/70" />
          <i className="h-2 w-2 rounded-full bg-border" />
          <i className="h-2 w-2 rounded-full bg-border" />
        </span>
      </div>

      {status === "ok" ? (
        <p className="rounded-xl border border-accent-line bg-accent-soft p-5 text-fg">
          Thanks — your message is on its way. I’ll reply soon.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          <div className="grid gap-6 pl-4 sm:grid-cols-2 sm:gap-x-8">
            <Field index="01" name="name" label="name" autoComplete="name" />
            <Field index="02" name="email" label="email" type="email" autoComplete="email" />
          </div>
          <div className="mt-6 pl-4">
            <Field index="03" name="message" label="message" textarea />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-faint">{"}"}</span>
            <button
              type="submit"
              disabled={status === "sending"}
              className="group ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-[color:var(--accent-contrast)] shadow-[0_8px_28px_rgba(18,161,80,0.28)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {status === "error" && (
            <p role="alert" className="mt-3 font-mono text-xs text-accent-ink">
              {"// "}
              {error}
            </p>
          )}
          {!configured && (
            <p className="mt-3 font-mono text-[11px] text-faint">
              {"// set "}
              <code>contact.accessKey</code> in <code>content/settings.json</code>
              {" to enable this form"}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
