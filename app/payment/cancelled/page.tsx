import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function CancelledRoute() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center ">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex w-full justify-center">
            <XIcon className="h-12 w-12 rounded-full bg-red-500/30 p-2 text-red-500" />
          </div>
          <div className="mt-3 w-full text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6">Payment Failed</h3>
            <div className="mt-2">
              <p className="text-muted-foreground text-sm">
                No worries. You wont be charged. Please try again.
              </p>
            </div>

            <div className="mt-5 w-full sm:mt-6">
              <Button className="w-full" asChild>
                <Link href="/">Go to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
