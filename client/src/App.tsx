import AppProviders from './hooks/AppProviders';
import AppRoutes from './Helpers/AppRoutes';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
    return (
      <ThemeProvider theme={theme}>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </ThemeProvider>
    );
}

export default App;
