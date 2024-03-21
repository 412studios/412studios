"use client";
import React, { useRef, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VerificationForm(user: any) {
  const nameRef: any = useRef("");
  const emailRef: any = useRef("");
  const bioRef: any = useRef("");
  const termsRef: any = useRef("");
  const categorySelectRef: any = useRef("");

  // const phoneRef = useRef<HTMLInputElement>("");
  const phoneRef = useRef(user.data?.phone ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.data?.phone ?? "");

  const [bioClass, setBioClass] = useState("spac-y-1 mt-2 p-2");
  const [bioWarning, setBioWarning] = useState("hidden");

  const [termsClass, setTermsClass] = useState("spac-y-1 mt-2 p-2");
  const [termsWarning, setTermsWarning] = useState("hidden");

  useEffect(() => {
    if (phoneRef.current) {
      const phoneInput = phoneRef.current;
      const handleInput = (e: any) => {
        const formattedInput = e.target.value.replace(/[^\d]/g, "").slice(0, 9); // Remove non-digits and limit length to 9
        setPhoneNumber(formattedInput);
      };
      phoneInput.addEventListener("input", handleInput);
      return () => phoneInput.removeEventListener("input", handleInput);
    }
  }, []);

  function handleSubmit() {
    let bio: any = bioRef.current.value;
    let terms: any = termsRef.current.checked;

    if (bio.length <= 0) {
      setBioClass("spac-y-1 mt-2 border border-rose-600 p-2 rounded-lg");
      setBioWarning("inline-block");
    } else {
      setBioClass("spac-y-1 mt-2 p-2");
      setBioWarning("hidden");
    }

    if (terms === true) {
      setTermsClass("spac-y-1 mt-2 p-2");
      setTermsWarning("hidden");
    } else {
      setTermsClass("spac-y-1 mt-2 border border-rose-600 p-2 rounded-lg");
      setTermsWarning("inline-block");
    }
  }

  const { pending } = useFormStatus();

  return (
    <div>
      <CardHeader>
        <CardTitle>412 Studios Verification Form</CardTitle>
        <CardDescription>
          Before booking, we would love to learn more about your musical. Please
          provide any relevant details. Upon receiving your information, we will
          verify your account, enabling you to start booking sessions or
          purchasing a subscription.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="spac-y-1 p-2">
          <Label className="px-3">Name</Label>
          <Input
            ref={nameRef}
            name="name"
            type="text"
            id="name"
            className="mt-2"
            placeholder="Your Name"
            defaultValue={user.data?.name ?? undefined}
            disabled
          />
        </div>
        <div className="spac-y-1 mt-2 p-2">
          <Label className="px-3">Email</Label>
          <Input
            ref={emailRef}
            name="email"
            type="text"
            id="email"
            className="mt-2"
            placeholder="Your Email"
            defaultValue={user.data?.email ?? undefined}
            disabled
          />
        </div>
        <div className="mt-2 space-y-1 p-2">
          <Label className="px-3">Phone Number</Label>
          <input
            ref={phoneRef}
            name="phone"
            type="text"
            id="phone"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex  w-full w-full rounded-lg rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder=""
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mt-2 space-y-1 p-2">
          <Label className="px-3">Please select an area of interest</Label>
          <Select name="categorySelect">
            <SelectTrigger className="">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent ref={categorySelectRef} id="categorySelect">
              <SelectItem value="corporate gatherings">
                corporate gatherings
              </SelectItem>
              <SelectItem value="listening and release parties">
                listening and release parties
              </SelectItem>
              <SelectItem value="photo and film studio">
                photo and film studio
              </SelectItem>
              <SelectItem value="brand activations">
                brand activations
              </SelectItem>
              <SelectItem value="writing camps">writing camps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={bioClass}>
          <Label className="px-3">
            Additional Details
            <span className={bioWarning}>
              <span className="mx-2 text-rose-500">* Required Field</span>
            </span>
          </Label>
          <Textarea
            ref={bioRef}
            name="bio"
            id="bio"
            className="mt-2"
            placeholder="Please provide any additional details or requirements."
            defaultValue={user.data?.bio ?? undefined}
          />
        </div>
        <div className={termsClass}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span>
                  View Terms and Conditions{" "}
                  <span className={termsWarning}>
                    <span className="mx-2 text-rose-500">* Required Field</span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[600px]">
                  By accessing this website, we assume you accept these terms
                  and conditions. Do not continue to use 412 Studios if you do
                  not agree to take all of the terms and conditions stated on
                  this page.
                </p>
              </AccordionContent>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tnc"
                  name="tnc"
                  value="off"
                  ref={termsRef}
                />
                <label
                  htmlFor="tnc"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter>
        {pending ? (
          <Button disabled className="w-fit">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-fit" onClick={handleSubmit}>
            Save Now
          </Button>
        )}
      </CardFooter>
    </div>
  );
}
