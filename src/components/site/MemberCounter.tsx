import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

const BASE = 1000;

export function MemberCounter() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["member-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("member_count");
      if (error) throw error;
      return data as number;
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const target = data ?? BASE;
  const [shown, setShown] = useState(target);
  const [pulse, setPulse] = useState(false);
  const prev = useRef(target);

  useEffect(() => {
    function bump() {
      queryClient.invalidateQueries({ queryKey: ["member-count"] });
    }
    window.addEventListener("apex-registration", bump);
    return () => window.removeEventListener("apex-registration", bump);
  }, [queryClient]);

  useEffect(() => {
    if (target === prev.current) return;
    const from = prev.current;
    prev.current = target;
    setPulse(true);
    const steps = 24;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(Math.round(from + ((target - from) * i) / steps));
      if (i >= steps) {
        window.clearInterval(id);
        window.setTimeout(() => setPulse(false), 600);
      }
    }, 30);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <p
      className="mt-8 flex items-center gap-3 font-display text-2xl tracking-wide sm:text-3xl"
      aria-live="polite"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full bg-primary ${pulse ? "animate-ping" : "animate-pulse"}`}
        aria-hidden
      />
      <span className={pulse ? "text-primary transition-colors" : "transition-colors"}>
        {shown.toLocaleString()}
      </span>
      <span className="text-primary">Members and Counting</span>
    </p>
  );
}
