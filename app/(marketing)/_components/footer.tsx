"use client";
import React from "react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="flex dark:bg-[#1F1F1F] items-center w-full p-6 bg-background z-50">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center  gap-x-2 text-muted-foreground">
        <Button className="cursor-pointer" variant={"ghost"} size={"sm"}>
          Privacy Policy
        </Button>
        <Button className="cursor-pointer" variant={"ghost"} size={"sm"}>
          Terms and Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
