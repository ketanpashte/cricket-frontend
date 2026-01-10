import { AppThemeProvider } from './theme';
import { AppStore } from './store';
import { ErrorBoundary } from './components';
import Routes from './routes';
import GlobalUI from './store/GlobalUI';

/**
 * Root Application Component
 * @component MainApp
 */
const MainApp = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppThemeProvider>
          <Routes />
        </AppThemeProvider>
        <GlobalUI />
      </AppStore>
    </ErrorBoundary>
  );
};

export default MainApp;
