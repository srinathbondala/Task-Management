export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    readonly created_at: string;
    updated_at: string;
    category ?: taskType;
    priority ?: taskPriority;
}

export enum TaskStatus {
    Backlog = "backlog",
    InProgress = "in progress",
    Completed = "completed"
}

export interface TaskContextType{
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: number) => void;
    updateStatus: (taskId: number, newStatus: TaskStatus) => void;
    updatePriority: (taskId: number, newPriority: taskPriority) => void;
}

export enum taskType {
    Personal = "personal",
    Work = "work",
    Study = "study"
}

export enum taskPriority {
    Low = "low",
    Medium = "medium",
    High = "high"
}
