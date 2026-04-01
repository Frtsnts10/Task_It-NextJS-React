import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date, completed, important, highPriority } =
      await req.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 }
      );
    }

    if (title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters long!" },
        { status: 400 }
      );
    }

    const { data: task, error } = await supabaseAdmin
      .from("todo_tasks")
      .insert({
        user_id: userId,
        title,
        description: description || "",
        date,
        is_completed: completed ?? false,
        is_important: important ?? false,
        is_urgent: highPriority ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json(
        { error: error.message || "Error creating task!" },
        { status: 500 }
      );
    }

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: error.message || "Error creating task!" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tasks, error } = await supabaseAdmin
      .from("todo_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: error.message || "Error fetching tasks!" },
        { status: 500 }
      );
    }

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: error.message || "Error fetching tasks!" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isCompleted, isImportant, isUrgent } = await req.json();

    const updateData: Record<string, any> = {};
    if (isCompleted !== undefined) updateData.is_completed = isCompleted;
    if (isImportant !== undefined) updateData.is_important = isImportant;
    if (isUrgent !== undefined) updateData.is_urgent = isUrgent;

    const { data: task, error } = await supabaseAdmin
      .from("todo_tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: error.message || "Error updating task!" },
        { status: 500 }
      );
    }

    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: error.message || "Error updating task!" }, { status: 500 });
  }
}
