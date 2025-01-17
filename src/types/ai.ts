export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  result?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIState {
  tasks: Task[];
  currentTask?: Task;
  thinking: boolean;
  context: string;
}