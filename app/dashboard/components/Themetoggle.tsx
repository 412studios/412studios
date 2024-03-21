"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Themetoggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="outline" size="icon" className="border">
          <SunIcon className="h-full w-auto rotate-0 scale-100 border transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="m-auto h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button> */}
        <Button
          variant="outline"
          size="icon"
          className="relative mx-2 inline-flex h-10 h-full w-10 items-center justify-center overflow-hidden rounded-md border bg-transparent p-2 transition-all"
        >
          <SunIcon className="absolute inset-0 m-auto h-5 w-5 rotate-0 scale-100 text-current transition-transform duration-300 ease-in-out dark:rotate-90 dark:scale-0" />
          <MoonIcon className="absolute inset-0 m-auto h-5 w-5 rotate-90 scale-0 text-current transition-transform duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
