"use client";
import { Button } from "@/components/ui/button";
import { PostMembership } from "@/lib/booking";

export default function Submit(input: any) {
  const submit = async () => {
    try {
      await PostMembership(input);
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };
  return (
    <Button className="w-full mt-4" onClick={submit}>
      Proceed to Purchase
    </Button>
  );
}
