import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EntryGate } from "@/components/site/EntryGate";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  AboutBlock,
  LocationBlock,
  PlansTable,
  ServicesGrid,
  TimingsBlock,
} from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { GYM, logoUrl, najamUrl, waLink } from "@/lib/gym";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apex Fit Club — Gym in Range Road, Rawalpindi" },
      {
        name: "description",
        content:
          "Apex Fit Club: strength, cardio and CrossFit gym on Range Road, Rawalpindi. Owned and led by Najam Ali Tariq. Separate gents and ladies timings.",
      },
      { property: "og:title", content: "Apex Fit Club — Rawalpindi" },
      {
        property: "og:description",
        content: "Strength, cardio and coaching on Range Road, Rawalpindi.",
      },
      { property: "og:image", content: najamUrl.startsWith("http") ? najamUrl : "" },
    ].filter((m) => !("content" in m && m.content === "")),
  }),
  component: Home,
});

function Home() {
  const { data: memberCount } = useQuery({
    queryKey: ["member-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("member_count");
      if (error) throw error;
      return data as number;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <EntryGate />
      <SiteHeader />

      <section className="relative isolate min-h-[86vh] overflow-hidden">
        <img
          src={najamUrl}
          alt="Najam Ali Tariq, owner of Apex Fit Club, standing in the gym"
          className="absolute inset-0 h-full w-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-between px-4 py-10">
          <img
            src={logoUrl}
            alt="Apex Fit Club logo"
            className="h-24 w-24 object-contain sm:h-28 sm:w-28"
          />
          <div className="max-w-3xl pb-6">
            <h1 className="text-5xl leading-[0.95] sm:text-7xl md:text-8xl">Apex Fit Club</h1>
            <p className="mt-4 text-base font-semibold uppercase tracking-[0.25em] text-primary sm:text-lg">
              Owned &amp; Led by Najam Ali Tariq.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Strength. Cardio. CrossFit. A coached training floor in Madina Tower, Range Road,
              Rawalpindi — with separate gents and ladies hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/register">Join Now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a
                  href={waLink(GYM.whatsapp, "Hi Apex Fit Club, I want to join the gym.")}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
            <p className="mt-8 font-display text-2xl tracking-wide sm:text-3xl">
              {(memberCount ?? 126).toLocaleString()}{" "}
              <span className="text-primary">Members and Counting</span>
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="About" title="Train where it counts" />
        <AboutBlock />

        <section className="mt-20">
          <SectionHeading eyebrow="Services" title="What we offer" />
          <ServicesGrid />
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Membership" title="Plans & pricing" />
          <PlansTable />
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Timings" title="Opening hours" />
          <TimingsBlock />
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow="Location" title="Madina Tower, Range Road" />
          <LocationBlock />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
