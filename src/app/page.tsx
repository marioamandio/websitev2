"use client";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Jobs from "@/components/sections/Jobs";
import React from "react";

export default function Home() {
  return (
    <main className="fillHeight">
      <Hero />
      {/* <About /> */}
      <Jobs />
      {/*<Featured />
    <Projects />*/}
      <Contact />
    </main>
  );
}
