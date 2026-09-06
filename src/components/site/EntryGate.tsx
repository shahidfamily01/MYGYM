import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logoUrl } from "@/lib/gym";

const STORAGE_KEY = "apex-gate-done";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Digits and + - ( ) only"),
  id_number: z.string().trim().min(10, "Enter CNIC or B-Form number").max(20).regex(/^[0-9-]+$/, "Digits and dashes only"),
  address: z.string().trim().min(5, "Please enter your home address").max(200),
});

export function EntryGate() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [idType, setIdType] = useState<"cnic" | "bform">("cnic");
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
      address: fd.get("address"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    await supabase
      .from("registrations")
      .insert({ ...parsed.data, id_type: idType, gender, kind: "visitor" });
    setLoading(false);
    close();
    if (gender === "female") navigate({ to: "/ladies" });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/95 px-4 py-8 backdrop-blur">
      <div className="surface-card w-full max-w-lg rounded-sm p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Apex Fit Club logo" className="h-12 w-12 object-contain" />
          <div>
            <h2 className="text-xl leading-none">Welcome to Apex Fit Club</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tell us who you are, or skip and browse freely.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Select Gender
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(["male", "female"] as const).map((g) => (
                <Button
                  key={g}
                  type="button"
                  variant={gender === g ? "default" : "secondary"}
                  onClick={() => setGender(g)}
                >
                  {g === "male" ? "Male (Gents)" : "Female (Ladies)"}
                </Button>
              ))}
            </div>
          </div>

          <Row label="Name" error={errors["full_name"]}>
            <Input name="full_name" maxLength={100} placeholder="Your full name" />
          </Row>
          <Row label="Phone Number" error={errors["phone"]}>
            <Input name="phone" type="tel" maxLength={20} placeholder="0300-1234567" />
          </Row>
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="ID Type">
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as "cnic" | "bform")}
                className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
              >
                <option value="cnic">CNIC</option>
                <option value="bform">B-Form</option>
              </select>
            </Row>
            <Row label={idType === "cnic" ? "CNIC Number" : "B-Form Number"} error={errors["id_number"]}>
              <Input name="id_number" maxLength={20} placeholder="61101-1234567-1" />
            </Row>
          </div>
          <Row label="Home Address" error={errors["address"]}>
            <Input name="address" maxLength={200} placeholder="Area, City" />
          </Row>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Please wait…" : "Continue"}
            </Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={close}>
              Skip / Continue as Guest
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
