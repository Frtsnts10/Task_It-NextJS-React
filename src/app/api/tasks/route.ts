import prisma from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { title, description, date, completed, important, highPriority } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json({
        error: "Missing required fields !",
        status: 400,
      });
    }

    if (title.length < 3) {
      return NextResponse.json({
        error: "Title must be at least 3 characters long!",
        status: 400,
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        isUrgent: highPriority,
        userId,
      },
    });

    // console.log("Task Created:", task);

    return NextResponse.json(task);
  } catch (error) {
    console.log("Error Creating Task !", error);
    return NextResponse.json({ error: "Error Creating Task !", status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
    });

    // console.log("Tasks Fetched:", tasks);
    return NextResponse.json(tasks);
  } catch (error) {
    console.log("Error Fetching Tasks !", error);
    return NextResponse.json({ error: "Error Fetching Tasks !", status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    const { isCompleted, isUrgent, isImportant, id  } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        isCompleted,
        isImportant,
        isUrgent,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("Error Updating Task !", error);
    return NextResponse.json({ error: "Error Updating Task !", status: 500 });
  }
}
