import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontSize: 14,
  },

  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          fontSize: "0.875rem",
          padding: "8.5px 12px",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "0.875rem",
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.8rem",
        },
      },
    },
    
  },
});

export default theme;