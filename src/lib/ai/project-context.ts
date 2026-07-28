import type { Project } from "@/types/project";
import { computeBaseScore } from "@/lib/utils/task-scoring";

export function buildProjectContext(project: Project) {
  const allTasks = project.phases.flatMap(p => p.tasks);
  const scored = allTasks.map(computeBaseScore);

  return {
    project: { title: project.title, deadline: project.deadline ?? null },
    stats: {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.done).length,
      overdueTasks: scored.filter(t => t.isOverdue).length,
      completionRate: project.progress,
    },
    phases: project.phases.map(p => ({
      title: p.title,
      status: p.status,
      progress: p.progress,
    })),
    tasks: scored
      .filter(t => !t.done)
      .map(t => ({
        id: t.id,
        label: t.label,
        priority: t.priority,
        dueDate: t.dueDate ?? null,
        baseScore: t.baseScore,
      })),
  };
}