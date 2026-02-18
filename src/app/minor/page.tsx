"use client";
import React from "react";
import { useGlobalState } from  "@/context/globalProvider";
import Tasks from  "@/components/Tasks/Tasks";

function page() {
  const { minorTasks } = useGlobalState();
  return <Tasks title="Minor Tasks" tasks={minorTasks} />;
}

export default page;
