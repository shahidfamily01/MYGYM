import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  reviewer_name: z.string().trim().min(2, "Please enter your name").max(80),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().trim().min(10, "Please write at least 10 characters").max(800),
});

export function ReviewsSection() {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: reviews } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, reviewer_name, rating, review_text, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(24);
      if (error) throw error;
      return data;
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      reviewer_name: fd.get("reviewer_name"),
      rating,
      review_text: fd.get("review_text"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({ ...parsed.data, approved: false });
    setLoading(false);
    if (error) {
      toast.error("We couldn't send your review. Please try again.");
      return;
    }
    setSent(true);
    toast.success("Thanks! Your review will appear once it's approved.");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((r) => (
            <article key={r.id} className="surface-card rounded-sm p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg leading-tight">{r.reviewer_name}</h3>
                <Stars value={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.review_text}</p>
            </article>
          ))
        ) : (
          <div className="surface-card rounded-sm p-8 text-center text-sm text-muted-foreground">
            No reviews published yet — be the first to share your experience.
          </div>
        )}
      </div>

      {sent ? (
        <div className="surface-card rounded-sm p-8 text-center">
          <h3 className="text-xl">Thank you!</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Your review has been sent and will show here once it's approved.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="surface-card space-y-5 rounded-sm p-6 sm:p-8" noValidate>
          <h3 className="text-xl">Write a review</h3>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Your Name</Label>
            <Input name="reviewer_name" maxLength={80} placeholder="e.g. Ahmed Raza" />
            {errors["reviewer_name"] ? (
              <p className="text-xs text-destructive">{errors["reviewer_name"]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Your Review
            </Label>
            <Textarea name="review_text" maxLength={800} rows={5} placeholder="How was your experience at Apex Fit Club?" />
            {errors["review_text"] ? (
              <p className="text-xs text-destructive">{errors["review_text"]}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Submit Review"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Reviews appear publicly after the gym owner approves them.
          </p>
        </form>
      )}
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}
