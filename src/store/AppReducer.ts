import { AppStoreState, GlobalAlert, GlobalModal } from './AppStore';

export type AppAction =
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'SET_USER'; payload: object }
  | { type: 'SHOW_ALERT'; payload: GlobalAlert }
  | { type: 'CLEAR_ALERT' }
  | { type: 'SHOW_MODAL'; payload: GlobalModal }
  | { type: 'CLOSE_MODAL' };

const AppReducer = (state: AppStoreState, action: AppAction): AppStoreState => {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SHOW_ALERT':
      return { ...state, globalAlert: action.payload };
    case 'CLEAR_ALERT':
      return { ...state, globalAlert: null };
    case 'SHOW_MODAL':
      return { ...state, globalModal: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, globalModal: null };
    default:
      return state;
  }
};

export default AppReducer;
