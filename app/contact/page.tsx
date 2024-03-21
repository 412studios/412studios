import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Phone, Mail } from "lucide-react";

export default async function Main() {
  return (
    <main className="container flex h-[90vh] items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="mx-auto">412 Studios</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="hover:bg-accent hover:text-accent-forground group mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
              <Mail className="text-primary mr-2 h-4 w-4" />
              Email:{" "}
              <a href="mailto:Info@412studios.ca" className="text-primary">
                Info@412studios.ca
              </a>
            </li>
            <li className="hover:bg-accent hover:text-accent-forground group mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
              <Phone className="text-primary mr-2 h-4 w-4" />
              Phone:{" "}
              <a href="tel:647-540-2321" className="text-primary">
                647-540-2321
              </a>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <LoginLink className="w-full">
            <Button className="w-full">Book Now</Button>
          </LoginLink>
        </CardFooter>
      </Card>
    </main>
  );
}
