import { TaskContextType, taskPriority } from '../Types/Task'
import React, {createContext, ReactNode, useEffect, useState} from "react";
import { TaskStatus, Task } from '../Types/Task';
import axios from 'axios';
import useToken from '../hooks/useToken';

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
export const TaskProvider: React.FC<{children : ReactNode}> = ({children}) : ReactNode => {
    const { token } = useToken();
    const [tasks, setTasks] = useState<Task[]>([]);

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
                if(response.status == 200){
                    setTasks((prevTasks) =>
                        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
                    );
                }
                console.log(response.status);
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
                            task._id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task
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
                task._id === taskId ? { ...task, priority: newPriority ,updated_at: new Date().toISOString()} : task
            )
        );
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask , updateStatus, updatePriority}}>
            {children}
        </TaskContext.Provider>
    );
};