"use client";
import React, { createContext, useState, useContext } from "react";
import themes from "./theme";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export const GlobalContext = createContext({} as any);
export const GlobalUpdateContext = createContext({} as any);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  const [selectedTheme, setSelectedTheme] = useState(0);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("taskit-theme");
    if (savedTheme !== null) {
      setSelectedTheme(Number(savedTheme));
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [settings, setSettings] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const theme = themes[selectedTheme];

  const toggleTheme = () => {
    setSelectedTheme((prev) => {
      const newTheme = prev === 0 ? 1 : 0;
      localStorage.setItem("taskit-theme", newTheme.toString());
      return newTheme;
    });
  };

  const openModal  = () => setModal(true);
  const closeModal = () => setModal(false);
  const openSettings  = () => setSettings(true);
  const closeSettings = () => setSettings(false);
  const collapseMenu  = () => setCollapsed((c) => !c);
  const openDeleteModal  = (id: string) => setDeleteModalId(id);
  const closeDeleteModal = () => setDeleteModalId(null);

  const allTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    const prev = tasks;
    // Optimistic removal
    setTasks((t) => t.filter((task) => task.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Task deleted");
    } catch {
      setTasks(prev);
      toast.error("Failed to delete task");
    }
  };

  const updateTask = async (task: {
    id: string;
    isCompleted?: boolean;
    isImportant?: boolean;
    isUrgent?: boolean;
  }) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              ...(task.isCompleted !== undefined && { is_completed: task.isCompleted }),
              ...(task.isImportant !== undefined && { is_important: task.isImportant }),
              ...(task.isUrgent !== undefined && { is_urgent: task.isUrgent }),
            }
          : t
      )
    );
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      // Revert on failure
      allTasks();
      toast.error("Failed to update task");
    }
  };

  // Filtered views
  const completedTasks    = tasks.filter((t) => t.is_completed === true);
  const incompleteTasks   = tasks.filter((t) => t.is_completed === false);
  const importantTasks    = tasks.filter((t) => t.is_important === true);
  const minorTasks        = tasks.filter((t) => t.is_important === false);
  const highPriorityTasks = tasks.filter((t) => t.is_urgent === true);
  const lowPriorityTasks  = tasks.filter((t) => t.is_urgent === false);

  React.useEffect(() => {
    if (user) allTasks();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        selectedTheme,
        toggleTheme,
        tasks,
        deleteTask,
        isLoading,
        completedTasks,
        incompleteTasks,
        importantTasks,
        minorTasks,
        highPriorityTasks,
        lowPriorityTasks,
        updateTask,
        modal,
        openModal,
        closeModal,
        settings,
        openSettings,
        closeSettings,
        allTasks,
        collapsed,
        collapseMenu,
        deleteModalId,
        openDeleteModal,
        closeDeleteModal,
      }}
    >
      <GlobalUpdateContext.Provider value={{}}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState  = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
