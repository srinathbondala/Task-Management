import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CustomSelectProps } from "../Types/HelperTypes";

const CustomSelect = <T extends string>({
  value,
  onChange,
  label,
  options,
  required = false,
  fullWidth = true,
  size = "medium",
  minWidth = { xs: 120, sm: 160, md: 200 },
}: CustomSelectProps<T>) => {
  const labelId = `${label.replace(/\s+/g, "-").toLowerCase()}-label`;

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as T);
  };

  return (
    <FormControl
      size={size}
      fullWidth={fullWidth}
      sx={{ minWidth }}
    >
      <InputLabel id={labelId}>
        {label}
        {required ? " *" : ""}
      </InputLabel>

      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
