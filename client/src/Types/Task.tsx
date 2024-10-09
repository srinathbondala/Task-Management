export interface Task {
    _id: string;
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
    deleteTask: (id: string) => void;
    updateStatus: (taskId: string, newStatus: TaskStatus) => void;
    updatePriority: (taskId: string, newPriority: taskPriority) => void;
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

export interface register {
    username: string;
    email: string;
    password: string;
    firstName : string;
    lastName : string;
}

export interface pieChartData {
    backlog: number;
    inProgress: number;
    completed: number;
}

export interface BordProps {
    tasks: Task[];
    updateStatus: (taskId: string, newStatus: TaskStatus) => void;
}
