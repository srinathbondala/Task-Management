export interface Task {
    _id: string;
    user?: string | undefined;
    title: string;
    description: string;
    status: TaskStatus;
    readonly created_at: string;
    updated_at: string;
    category ?: taskType;
    priority ?: taskPriority;
    project ?: projectParms;
    assigned_to ?: string;
    due_date ?: string;
}

export interface Project {
    projectName: string;
    description: string;
    status: 'active' | 'inactive';
    created_by: string;
    created_at: Date;
    users: string[];
    tasks: Task[];
}

interface projectParms {
    projectId: string;
    name: string;
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

export interface ProjectContextType{
    projects: Project[];
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => void;
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
    role : roleType;
}

export interface pieChartData {
    backlog: number;
    inProgress: number;
    completed: number;
}

export interface BordProps {
    tasks: Task[];
    updateStatus: (taskId: string, newStatus: TaskStatus) => void;
    deleteTask?: (id: string) => void;
}

export enum roleType {
    USER = "user",
    ADMIN = "admin" 
}

export interface WelcomeComponentProps {
    setSelectedProject: (project: string) => void;
    setSelectedProjectId: (id: string) => void;
}