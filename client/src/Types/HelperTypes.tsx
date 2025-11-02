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
