import { TaskInput } from "../Types/Task";

export function isFormDetailsValid(data : TaskInput): boolean {
    if (!data.title.trim()) return false;
    if (!data.description.trim()) return false;
    if (!data.status) return false;

    if (data.category !== undefined && !data.category) return false;
    if (data.priority !== undefined && !data.priority) return false;
    if (data.due_date !== undefined && data.due_date.trim() === '') return false;

  return true;
}

export function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}