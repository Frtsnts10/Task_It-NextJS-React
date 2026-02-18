"use client";

import { SignIn } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        height: "100%",
      }}
    >
      <SignIn />
    </div>
  );
}

export default page;
