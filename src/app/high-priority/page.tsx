"use client";
import React from "react";
import { useGlobalState } from  "@/context/globalProvider";
import Tasks from  "@/components/Tasks/Tasks";

function page() {
  const { highPriorityTasks } = useGlobalState();
  return <Tasks title="Urgent Tasks" tasks={highPriorityTasks} />;
}

export default page;
