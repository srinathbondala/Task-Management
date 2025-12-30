import axios from 'axios';
import { AdminRequest, TaskStatus, Task } from "../Types/Task";

export const updateTaskStatus = async (taskId: string, newStatus: TaskStatus, token: string) => {
    try {
        const response = await axios.put(
            'http://localhost:8080/admin/task/status',
            { taskId, status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.statusText };
        }
    } catch (error: any) {
        console.error('Error updating task status:', error);
        return { success: false, error: error.message };
    }
};

export const RequestAdmin = async (requestData: AdminRequest) => {
    try{
        const response = await axios.post('http://localhost:8080/api/contact-admin', requestData);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.statusText };
        }
    } catch(error: any) {
        console.error('Error failed to Request Admin', error);
        return { success: false, error: error.message };
    }
}

export const deleteTaskApi = async (taskId: string, token : string) => {
    const response = await axios.delete(`http://localhost:8080/admin/task/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.status;
};
