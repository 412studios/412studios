"use client";
import React, { useState } from "react";
import { Logo } from "../public/logo";
// import { Arrow } from "../public/icons/arrow";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="mx-auto max-w-screen-xl">
      {/* Desktop */}
      <div className="flex p-4">
        <div className="flex h-20 items-center justify-center">
          <a href="#">
            {/* <Logo className="icon max-h-12" /> */}
            <Logo className="icon" />
          </a>
        </div>
        <div className="ml-auto flex">
          <button className="m-2 rounded-md p-4">Book Now</button>
          <button className="m-2 mr-0 rounded-md p-4">Login</button>
        </div>
      </div>
      <div className="mx-4 border-t"></div>
      <div className="flex p-2 pl-4">
        <a href="#" className="mr-4">
          About
        </a>
        <a href="#" className="mr-4">
          Contact
        </a>
      </div>
    </header>
  );
}
