import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const STORAGE_KEY = "apex-gate-done";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const schema = z.object({
  full_name: optionalText(100),
  phone: optionalText(20).refine(
    (v) => !v || /^[0-9+\-\s()]{7,20}$/.test(v),
    "Please enter a valid phone number",
  ),
  id_number: optionalText(20).refine(
    (v) => !v || /^[0-9-]{10,20}$/.test(v),
    "Please enter a valid CNIC number",
  ),
});

export function EntryGate() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      full_name: fd.get("full_name"),
      phone: fd.get("phone"),
      id_number: fd.get("id_number"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const { full_name, phone, id_number } = parsed.data;

    if (full_name || phone || id_number) {
      setLoading(true);
      await supabase.from("registrations").insert({
        full_name: full_name ?? "Guest",
        phone: phone ?? "",
        id_number: id_number ?? null,
        id_type: "cnic",
        address: "",
        gender,
        kind: "visitor",
      });
      setLoading(false);
    }

    close();
    if (gender === "female") navigate({ to: "/ladies" });
  }

  function enterAsGuest() {
    close();
    if (gender === "female") navigate({ to: "/ladies" });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/95 px-4 py-8 backdrop-blur">
      <div className="surface-card w-full max-w-lg rounded-sm p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="display text-lg font-black uppercase tracking-[0.18em] text-primary">
            AFC
          </span>
          <div>
            <h2 className="text-xl leading-none">Welcome to Apex Fit Club</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose gents or ladies — the rest is optional.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Select Gender <span className="text-primary">(required)</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["male", "female"] as const).map((g) => (
                <Button
                  key={g}
                  type="button"
                  variant={gender === g ? "default" : "secondary"}
                  onClick={() => setGender(g)}
                  aria-pressed={gender === g}
                >
                  {g === "male" ? "Male (Gents)" : "Female (Ladies)"}
                </Button>
              ))}
            </div>
          </div>

          <Row label="Name (optional)" error={errors["full_name"]}>
            <Input name="full_name" maxLength={100} placeholder="Your full name" />
          </Row>
          <Row label="Phone (optional)" error={errors["phone"]}>
            <Input name="phone" type="tel" maxLength={20} placeholder="0300-1234567" />
          </Row>
          <Row label="CNIC Number (optional)" error={errors["id_number"]}>
            <Input name="id_number" maxLength={20} placeholder="61101-1234567-1" />
          </Row>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Please wait…" : "Continue"}
            </Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={enterAsGuest}>
              Guest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Row({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
