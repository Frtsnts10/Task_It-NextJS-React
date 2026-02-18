"use client";
import React from "react";
import { useGlobalState } from  "@/context/globalProvider";
import Tasks from  "@/components/Tasks/Tasks";

function page() {
  const { incompleteTasks } = useGlobalState();
  return <Tasks title="Not Completed Tasks" tasks={incompleteTasks} />;
}

export default page;
