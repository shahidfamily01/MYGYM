import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { logoUrl } from "@/lib/gym";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Registrations | Apex Fit Club Admin" },
      { name: "description", content: "Private list of Apex Fit Club registrations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Apex Fit Club logo" className="h-10 w-10 object-contain" />
            <h1 className="text-lg leading-none">Registrations</h1>
          </div>
          <Button variant="secondary" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {error ? (
          <p className="text-sm text-destructive">
            You don't have permission to view registrations. Ask the owner to grant admin access.
          </p>
        ) : null}
        {data && data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No registrations yet.</p>
        ) : null}
        {data && data.length > 0 ? (
          <div className="surface-card overflow-x-auto rounded-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {["Date", "Name", "Phone", "ID", "Address", "Gender", "Plan", "Type"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-b border-border/60">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{r.full_name}</td>
                    <td className="whitespace-nowrap px-4 py-3">{r.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {r.id_number} <span className="text-muted-foreground">({r.id_type})</span>
                    </td>
                    <td className="px-4 py-3">{r.address}</td>
                    <td className="px-4 py-3">{r.gender}</td>
                    <td className="px-4 py-3">{r.plan ?? "—"}</td>
                    <td className="px-4 py-3">{r.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
