import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[100vh] w-screen flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <h1>404 - Page Not Found</h1>
        <p>We could not find the page you were looking for.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
