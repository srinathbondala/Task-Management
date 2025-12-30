import { Task } from "./Task";

export interface DueDatePickerProps {
    dueDate: string;
    setDueDate: (date: string) => void;
    isReadonly?: boolean;
}

export type SuccessSnackbarProps = {
  open: boolean;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message?: string;
  autoHideDuration?: number;
};

export interface TaskSelectDialogProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  title?: string;
  onSelect: (taskId: string) => void;
}

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}
export interface CustomSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  label: string;
  options: SelectOption<T>[];
  required?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  minWidth?: {
    xs?: number;
    sm?: number;
    md?: number;
  };
}
export interface NoTaskProps {
  message?: string;
  showAddButton?: boolean;
  addTaskPath?: string;
}
