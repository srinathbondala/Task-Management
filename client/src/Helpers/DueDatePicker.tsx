import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DueDatePickerProps } from '../Types/HelperTypes';

const DueDatePicker: React.FC<DueDatePickerProps> = ({ dueDate, setDueDate, isReadonly = false }) => {
    const handleChange = (newValue: Dayjs | null) => {
        if (newValue) {
            setDueDate(newValue.toISOString());
        } else {
            setDueDate('');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Due Date"
                value={dueDate ? dayjs(dueDate) : null}
                onChange={handleChange}
                disabled={isReadonly}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        required: true,
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default DueDatePicker;
