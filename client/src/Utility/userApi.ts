import axios from "axios";

const getTaskById = async (taskId: string, token: string) => {
    try{
        const task = await axios.get(`http://localhost:8080/user/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (task.status === 200) {
            return { success: true, data: task.data };
        } else {
            return { success: false, error: task.statusText };
        }
    } catch(e){
         return { success: false, error: e };
        alert("Error fetching task status. Please try again.");
    }
}

export { getTaskById };