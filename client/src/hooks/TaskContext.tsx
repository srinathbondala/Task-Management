import { TaskContextType, taskPriority } from '../Types/Task'
import React, {createContext, ReactNode, useEffect, useState} from "react";
import { TaskStatus, Task } from '../Types/Task';
import axios from 'axios';
import useToken from '../hooks/useToken';

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
export const TaskProvider: React.FC<{children : ReactNode}> = ({children}) : ReactNode => {
    const { token } = useToken();
    const [tasks, setTasks] = useState<Task[]>([
        // {
        //     id: '1',
        //     title: "Plan Project Launch",
        //     description: "Outline the key milestones and deliverables for the upcoming project launch. Include timelines and responsibilities.",
        //     status: TaskStatus.Backlog,
        //     created_at: "2023-09-01",
        //     updated_at: "2023-09-01",
        //     category: taskType.Work,
        //     priority: taskPriority.Medium,
        // },
        // {
        //     id: '2',
        //     title: "Create Marketing Materials",
        //     description: "Design and develop marketing materials, including brochures and social media posts, to support the launch campaign.",
        //     status: TaskStatus.InProgress,
        //     created_at: "2023-09-05",
        //     updated_at: "2023-09-12",
        //     category: taskType.Work,
        //     priority: taskPriority.High
        // },
        // {
        //     id: '3',
        //     title: "Weekly Study Group",
        //     description: "Attend the weekly study group to review topics covered in class and prepare for upcoming exams.",
        //     status: TaskStatus.Completed,
        //     created_at: "2023-09-10",
        //     updated_at: "2023-09-10",
        //     category: taskType.Study,
        //     priority: taskPriority.Medium,
        // },
        // {
        //     id: '4',
        //     title: "Grocery Shopping",
        //     description: "Make a shopping list and purchase groceries for the week. Focus on healthy and fresh ingredients.",
        //     status: TaskStatus.Backlog,
        //     created_at: "2023-09-15",
        //     updated_at: "2023-09-15",
        //     category: taskType.Personal,
        //     priority: taskPriority.Low,
        // },
        // {
        //     id: '5',
        //     title: "Exercise Routine",
        //     description: "Develop a weekly exercise routine that includes cardio, strength training, and flexibility workouts.",
        //     status: TaskStatus.Backlog,
        //     created_at: "2023-09-18",
        //     updated_at: "2023-09-18",
        //     category: taskType.Personal,
        //     priority: taskPriority.Medium,
        // },
        // {
        //     id: '6',
        //     title: "Finalize Research Paper",
        //     description: "Complete the final draft of the research paper, ensuring all references are correctly cited and formatting is consistent.",
        //     status: TaskStatus.InProgress,
        //     created_at: "2023-09-20",
        //     updated_at: "2023-09-25",
        //     category: taskType.Study,
        //     priority: taskPriority.High,
        // },
        // {
        //     id: '7',
        //     title: "Team Meeting",
        //     description: "Participate in the weekly team meeting to discuss project updates and address any challenges.",
        //     status: TaskStatus.Completed,
        //     created_at: "2023-09-22",
        //     updated_at: "2023-09-22",
        //     category: taskType.Work,
        //     priority: taskPriority.Medium,
        // },
        // {
        //     id: '8',
        //     title: "Volunteer at Local Shelter",
        //     description: "Help organize the annual fundraising event at the local shelter and assist with on-site operations.",
        //     status: TaskStatus.Backlog,
        //     created_at: "2023-09-25",
        //     updated_at: "2023-09-25",
        //     category: taskType.Personal,
        //     priority: taskPriority.Low,
        // }
    ]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        };
        if (token) fetchTasks();
    },[token]);

    const addTask = (task: Task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const updateTask = (updatedTask: Task) => {
        try{
            axios.put(`http://localhost:8080/user/tasks/${updatedTask._id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status == 204){
                    setTasks((prevTasks) =>
                        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
                    );
                }
            })
            .catch((error) => {
                console.error("Error updating task: ", error);
                alert("Error updating task. Please try again.");
            });
        }
        catch(error){
            console.error("Error updating task: ", error);
            alert("Error updating task. Please try again.");
        }
    };

    const deleteTask = (id: string) => {
        try{
            axios.delete(`http://localhost:8080/user/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status == 204){
                    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
                }
            })
            .catch((error) => {
                console.error("Error deleting task: ", error);
                alert("Error deleting task. Please try again.");
            });
        }
        catch(error){
            console.error("Error deleting task: ", error);
            alert("Error deleting task. Please try again.");
        }
    };

    const updateStatus = (taskId: string, newStatus: TaskStatus) => {

        try{
            axios.put(`http://localhost:8080/user/tasks/${taskId}/status`, {status: newStatus}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if(response.status == 200){
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task._id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString().split('T')[0] } : task
                        )
                    );
                }
            })
            .catch((error) => {
                console.error("Error updating task status: ", error);
                alert("Error updating task status. Please try again.");
            });
        }
        catch(error){
            console.error("Error updating task status: ", error);
            alert("Error updating task status. Please try again.");
        }
    }

    const updatePriority = (taskId: string, newPriority: taskPriority) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, priority: newPriority ,updated_at: new Date().toISOString().split('T')[0]} : task
            )
        );
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask , updateStatus, updatePriority}}>
            {children}
        </TaskContext.Provider>
    );
};