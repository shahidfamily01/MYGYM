import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { plans } from "@/lib/gym";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )"),
  id_type: z.enum(["cnic", "bform"]),
  id_number: z
    .string()
    .trim()
    .min(10, "Please enter a valid CNIC / B-Form number")
    .max(20)
    .regex(/^[0-9-]+$/, "Only digits and dashes are allowed"),
  address: z.string().trim().min(5, "Please enter your home address").max(200),
  gender: z.enum(["male", "female"]),
  plan: z.string().trim().max(60).optional(),
});

export function RegistrationForm({
  kind = "membership",
  gender,
  showPlan = true,
}: {
  kind?: "membership" | "event";
  gender?: "male" | "female";
  showPlan?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      full_name: fd.get("full_name"),
      phone: fd.get("phone"),
      id_type: fd.get("id_type"),
      id_number: fd.get("id_number"),
      address: fd.get("address"),
      gender: gender ?? fd.get("gender"),
      plan: showPlan ? ((fd.get("plan") as string) || undefined) : undefined,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("registrations").insert({ ...parsed.data, plan: parsed.data.plan ?? null, kind });
    setLoading(false);

    if (error) {
      toast.error("We couldn't send your registration. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Registration received. Our team will contact you shortly.");
  }

  if (done) {
    return (
      <div className="surface-card rounded-sm p-8 text-center">
        <h3 className="text-2xl">You're on the list</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Thanks! Your details are with the Apex Fit Club team. We'll call or WhatsApp you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-5 rounded-sm p-6 sm:p-8" noValidate>
      <Field label="Full Name" error={errors["full_name"]}>
        <Input name="full_name" maxLength={100} placeholder="e.g. Ahmed Raza" required />
      </Field>

      <Field label="Phone Number" error={errors["phone"]}>
        <Input name="phone" type="tel" maxLength={20} placeholder="0300-1234567" required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="ID Type" error={errors["id_type"]}>
          <select
            name="id_type"
            defaultValue="cnic"
            className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
          >
            <option value="cnic">CNIC</option>
            <option value="bform">B-Form (no CNIC)</option>
          </select>
        </Field>
        <Field label="CNIC / B-Form Number" error={errors["id_number"]}>
          <Input name="id_number" maxLength={20} placeholder="61101-1234567-1" required />
        </Field>
      </div>

      <Field label="Home Address" error={errors["address"]}>
        <Input name="address" maxLength={200} placeholder="House / Street, Area, City" required />
      </Field>

      {gender ? null : (
        <Field label="Gender" error={errors["gender"]}>
          <select
            name="gender"
            defaultValue="male"
            className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
      )}

      {showPlan ? (
        <Field label="Membership Plan" error={errors["plan"]}>
          <select
            name="plan"
            defaultValue={plans[3]!.name}
            className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
          >
            {plans.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} — Rs. {p.price.toLocaleString()}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending…" : kind === "event" ? "Register for Event" : "Submit Registration"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Your details are stored privately and are visible only to the gym owner.
      </p>
    </form>
  );
}

function Field({
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
