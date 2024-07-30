"use client";
import { Button } from "@/components/ui/button";
import { PostSubscription } from "@/app/lib/booking";

export default function Submit(input: any) {
  const submit = async () => {
    try {
      await PostSubscription(input);
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };
  return (
    <>
      <Button className="w-full mt-4" onClick={submit}>
        Proceed to Purchase
      </Button>
    </>
  );
}
