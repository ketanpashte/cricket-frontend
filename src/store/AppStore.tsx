import {
  createContext,
  useReducer,
  useContext,
  FunctionComponent,
  Dispatch,
  ComponentType,
  PropsWithChildren,
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppReducer, { AppAction } from './AppReducer';
import { localStorageGet } from '../utils/localStorage';

export interface GlobalAlert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface GlobalModal {
  title: string;
  content: React.ReactNode;
  onClose?: () => void;
}

export interface AppStoreState {
  darkMode: boolean;
  isAuthenticated: boolean;
  currentUser?: object;
  globalAlert?: GlobalAlert | null;
  globalModal?: GlobalModal | null;
}

const INITIAL_APP_STATE: AppStoreState = {
  darkMode: false,
  isAuthenticated: true,
  currentUser: []
};

type AppContextReturningType = [AppStoreState, Dispatch<AppAction>];
const AppContext = createContext<AppContextReturningType>([INITIAL_APP_STATE, () => null]);

const AppStoreProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const previousDarkMode = Boolean(localStorageGet('darkMode'));

  const initialState: AppStoreState = {
    ...INITIAL_APP_STATE,
    darkMode: previousDarkMode || prefersDarkMode,
  };

  const value: AppContextReturningType = useReducer(AppReducer, initialState);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppStore = (): AppContextReturningType => useContext(AppContext);

interface WithAppStoreProps {
  store: object;
}
const withAppStore =
  (Component: ComponentType<WithAppStoreProps>): FunctionComponent =>
    (props) => {
      return <Component {...props} store={useAppStore()} />;
    };

export { AppStoreProvider as AppStore, AppContext, useAppStore, withAppStore };
