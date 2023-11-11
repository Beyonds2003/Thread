"use client";
import React, { experimental_useOptimistic as useOptimistic } from "react";
import { Button } from "../ui/button";

const RightSideBar = () => {
  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6"></div>
    </section>
  );
};

export default RightSideBar;
