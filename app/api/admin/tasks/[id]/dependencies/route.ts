import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
} from "@/app/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }
  const auth = await getAuthenticatedUser();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = z.object({ depends_on_task_id: z.string().uuid() }).safeParse(body);
  if (!z.string().uuid().safeParse(id).success || !parsed.success || id === parsed.data.depends_on_task_id) {
    return NextResponse.json({ error: "Task dependency is invalid." }, { status: 400 });
  }

  const taskIds = [id, parsed.data.depends_on_task_id];
  const { data: taskRows, error: taskError } = await auth.supabase
    .from("workflow_tasks")
    .select("id, workflow_id, project_id")
    .in("id", taskIds);
  if (taskError || taskRows?.length !== 2) {
    return NextResponse.json({ error: "Both tasks must be accessible." }, { status: 404 });
  }
  const [task, dependency] = taskRows.sort((left, right) => taskIds.indexOf(left.id) - taskIds.indexOf(right.id));
  const sharesWorkflow = Boolean(task.workflow_id && task.workflow_id === dependency.workflow_id);
  const sharesProject = Boolean(task.project_id && task.project_id === dependency.project_id);
  if (!sharesWorkflow && !sharesProject) {
    return NextResponse.json({ error: "Dependencies must belong to the same workflow or project." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("workflow_task_dependencies")
    .insert({ task_id: id, depends_on_task_id: parsed.data.depends_on_task_id })
    .select()
    .single();
  if (error) {
    console.error("Could not add task dependency:", error.message);
    return NextResponse.json({ error: "Task dependency could not be added." }, { status: error.code === "42501" ? 403 : 400 });
  }
  return NextResponse.json({ dependency: data }, { status: 201 });
}
