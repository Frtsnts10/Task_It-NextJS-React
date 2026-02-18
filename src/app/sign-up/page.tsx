"use client";

import { SignUp } from "@clerk/nextjs";
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
      <SignUp />
    </div>
  );
}

export default page;
