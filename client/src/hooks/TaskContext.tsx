import { TaskContextType, taskPriority } from '../Types/Task'
import React, {createContext, ReactNode, useState} from "react";
import { TaskStatus, taskType, Task } from '../Types/Task';

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
export const TaskProvider: React.FC<{children : ReactNode}> = ({children}) : ReactNode => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Plan Project Launch",
            description: "Outline the key milestones and deliverables for the upcoming project launch. Include timelines and responsibilities.",
            status: TaskStatus.Backlog,
            created_at: "2023-09-01",
            updated_at: "2023-09-01",
            category: taskType.Work,
            priority: taskPriority.Medium,
        },
        {
            id: 2,
            title: "Create Marketing Materials",
            description: "Design and develop marketing materials, including brochures and social media posts, to support the launch campaign.",
            status: TaskStatus.InProgress,
            created_at: "2023-09-05",
            updated_at: "2023-09-12",
            category: taskType.Work,
            priority: taskPriority.High
        },
        {
            id: 3,
            title: "Weekly Study Group",
            description: "Attend the weekly study group to review topics covered in class and prepare for upcoming exams.",
            status: TaskStatus.Completed,
            created_at: "2023-09-10",
            updated_at: "2023-09-10",
            category: taskType.Study,
            priority: taskPriority.Medium,
        },
        {
            id: 4,
            title: "Grocery Shopping",
            description: "Make a shopping list and purchase groceries for the week. Focus on healthy and fresh ingredients.",
            status: TaskStatus.Backlog,
            created_at: "2023-09-15",
            updated_at: "2023-09-15",
            category: taskType.Personal,
            priority: taskPriority.Low,
        },
        {
            id: 5,
            title: "Exercise Routine",
            description: "Develop a weekly exercise routine that includes cardio, strength training, and flexibility workouts.",
            status: TaskStatus.Backlog,
            created_at: "2023-09-18",
            updated_at: "2023-09-18",
            category: taskType.Personal,
            priority: taskPriority.Medium,
        },
        {
            id: 6,
            title: "Finalize Research Paper",
            description: "Complete the final draft of the research paper, ensuring all references are correctly cited and formatting is consistent.",
            status: TaskStatus.InProgress,
            created_at: "2023-09-20",
            updated_at: "2023-09-25",
            category: taskType.Study,
            priority: taskPriority.High,
        },
        {
            id: 7,
            title: "Team Meeting",
            description: "Participate in the weekly team meeting to discuss project updates and address any challenges.",
            status: TaskStatus.Completed,
            created_at: "2023-09-22",
            updated_at: "2023-09-22",
            category: taskType.Work,
            priority: taskPriority.Medium,
        },
        {
            id: 8,
            title: "Volunteer at Local Shelter",
            description: "Help organize the annual fundraising event at the local shelter and assist with on-site operations.",
            status: TaskStatus.Backlog,
            created_at: "2023-09-25",
            updated_at: "2023-09-25",
            category: taskType.Personal,
            priority: taskPriority.Low,
        }
    ]);
    const addTask = (task: Task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const updateTask = (updatedTask: Task) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    const deleteTask = (id: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const updateStatus = (taskId: number, newStatus: TaskStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString().split('T')[0] } : task
            )
        );
    }

    const updatePriority = (taskId: number, newPriority: taskPriority) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, priority: newPriority ,updated_at: new Date().toISOString().split('T')[0]} : task
            )
        );
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask , updateStatus, updatePriority}}>
            {children}
        </TaskContext.Provider>
    );
};