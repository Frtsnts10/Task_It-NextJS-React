"use client";
import React from "react";
import { useGlobalState } from  "@/context/globalProvider";
import Tasks from  "@/components/Tasks/Tasks";

function page() {
  const { lowPriorityTasks } = useGlobalState();
  return <Tasks title="Important Tasks" tasks={lowPriorityTasks} />;
}

export default page;
