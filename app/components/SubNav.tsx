import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
export function SubNav() {
  return (
    <div className="w-full border-b p-2">
      <div className="container">
        <div>
          <Link href="/about" className="mr-4">
            About
          </Link>
          <Link href="/contact" className="mr-4">
            Contact
          </Link>
          {/* <LoginLink>Book Now</LoginLink> */}
        </div>
      </div>
    </div>
  );
}
