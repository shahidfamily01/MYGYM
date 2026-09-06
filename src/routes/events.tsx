import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/site/PageShell";
import { SectionHeading } from "@/components/site/SectionHeading";
import { RegistrationForm } from "@/components/site/RegistrationForm";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Competitions | Apex Fit Club Rawalpindi" },
      {
        name: "description",
        content:
          "Upcoming Apex Fit Club events, challenges and competitions in Rawalpindi. Register your spot in advance.",
      },
      { property: "og:title", content: "Apex Fit Club Events" },
      { property: "og:description", content: "Challenges, competitions and member events." },
    ],
  }),
  component: Events,
});

function Events() {
  return (
    <PageShell>
      <SectionHeading
        as="h1"
        eyebrow="Events"
        title="What's coming up"
        subtitle="No events scheduled right now — check back soon! You can still leave your details and we'll invite you first."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="surface-card flex items-center justify-center rounded-sm p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No events scheduled right now — check back soon!
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xl">Event Registration</h2>
          <RegistrationForm kind="event" showPlan={false} />
        </div>
      </div>
    </PageShell>
  );
}
