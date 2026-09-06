import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { PageShell } from "@/components/site/PageShell";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { trainers, waLink } from "@/lib/gym";

export const Route = createFileRoute("/trainers")({
  head: () => ({
    meta: [
      { title: "Our Trainers — Najam, Adeel & Fasih | Apex Fit Club" },
      {
        name: "description",
        content:
          "Meet the Apex Fit Club coaching team: owner Najam Ali Tariq, Adeel and Fasih. Message any trainer directly on WhatsApp.",
      },
      { property: "og:title", content: "Apex Fit Club Trainers" },
      {
        property: "og:description",
        content: "Coaching team with 5–10 years of experience each.",
      },
    ],
  }),
  component: Trainers,
});

function Trainers() {
  return (
    <PageShell>
      <SectionHeading
        as="h1"
        eyebrow="Trainers"
        title="Coaches who train with you"
        subtitle="Tap any coach to message them directly on WhatsApp and plan your first session."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {trainers.map((t) => (
          <article key={t.name} className="surface-card overflow-hidden rounded-sm">
            <div className="relative">
              <img
                src={t.photo}
                alt={`${t.name}, ${t.role} at Apex Fit Club`}
                className="h-80 w-full object-cover object-top"
                loading="lazy"
              />
              {t.owner ? (
                <span className="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  Owner
                </span>
              ) : null}
            </div>
            <div className="p-6">
              <h2 className="text-xl leading-tight">{t.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{t.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.experience}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.bio}</p>
              <Button asChild className="mt-6 w-full">
                <a
                  href={waLink(t.whatsapp, `Hi ${t.name}, I'd like to train at Apex Fit Club.`)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp {t.phoneDisplay}
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
