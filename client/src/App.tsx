import AppProviders from './hooks/AppProviders';
import AppRoutes from './Helpers/AppRoutes';

function App() {
    return (
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    );
}

export default App;
