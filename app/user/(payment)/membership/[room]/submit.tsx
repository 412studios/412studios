"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PostMembership } from "@/lib/booking";

interface SubmitProps {
  id: string;
  price16: number;
  price8: number;
}

const bundles = [
  { hours: 16 as const, label: "16-Hour Membership", sessions: "4 × 4-hour sessions" },
  { hours: 8 as const, label: "8-Hour Membership", sessions: "2 × 4-hour sessions" },
];

export default function Submit({ id, price16, price8 }: SubmitProps) {
  const [hours, setHours] = useState<8 | 16>(16);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priceFor = (h: 8 | 16): number => (h === 16 ? price16 : price8);

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      // Only the chosen bundle size is sent — PostMembership recomputes the
      // price on the server from the Pricing table.
      await PostMembership({ id, hours });
    } catch (err) {
      console.error("Failed to start membership purchase:", err);
      setError("Sorry — this membership option isn't available right now.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {bundles.map((bundle) => {
          const selected = hours === bundle.hours;
          return (
            <button
              key={bundle.hours}
              type="button"
              onClick={() => setHours(bundle.hours)}
              aria-pressed={selected}
              className={`rounded-lg border p-3 text-left transition ${
                selected
                  ? "border-primary ring-2 ring-primary"
                  : "border-input hover:border-primary"
              }`}
            >
              <div className="font-semibold">{bundle.label}</div>
              <div className="text-sm text-muted-foreground">{bundle.sessions}</div>
              <div className="mt-1 font-bold">${priceFor(bundle.hours)}.00</div>
            </button>
          );
        })}
      </div>
      <Button className="w-full" onClick={submit} disabled={loading}>
        {loading ? "Redirecting..." : `Proceed to Purchase — $${priceFor(hours)}.00`}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
