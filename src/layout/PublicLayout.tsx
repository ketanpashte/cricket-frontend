import { FunctionComponent, PropsWithChildren, useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useAppStore } from '../store/AppStore';
import { ErrorBoundary } from '../components';
import { LinkToPage } from '../utils/type';
import { useOnMobile } from '../hooks/layout';
import { BOTTOM_BAR_DESKTOP_VISIBLE, TOP_BAR_DESKTOP_HEIGHT, TOP_BAR_MOBILE_HEIGHT } from './config';
import BottomBar from './BottomBar';

const TITLE_PUBLIC = '_TITLE_ app';

const SIDE_BAR_ITEMS: Array<LinkToPage> = [
  { title: 'Log In', path: '/auth/login', icon: 'login' },
  { title: 'Sign Up', path: '/auth/signup', icon: 'signup' },
  { title: 'About', path: '/about', icon: 'info' },
];

if (process.env.REACT_APP_DEBUG === 'true') {
  SIDE_BAR_ITEMS.push({ title: '[Debug Tools]', path: '/dev', icon: 'settings' });
}

const BOTTOM_BAR_ITEMS: Array<LinkToPage> = [...SIDE_BAR_ITEMS];

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [, dispatch] = useAppStore();

  
  const bottomBarVisible = onMobile || BOTTOM_BAR_DESKTOP_VISIBLE;
  document.title = TITLE_PUBLIC;

  const onSideBarOpen = useCallback(() => {
    if (!sideBarVisible) setSideBarVisible(true);
  }, [sideBarVisible]);

  const onSideBarClose = useCallback(() => {
    if (sideBarVisible) setSideBarVisible(false);
  }, [sideBarVisible]);

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        paddingTop: onMobile ? TOP_BAR_MOBILE_HEIGHT : TOP_BAR_DESKTOP_HEIGHT,
      }}
    >
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>

      <Stack component="footer">
        {bottomBarVisible && <BottomBar items={BOTTOM_BAR_ITEMS} />}
      </Stack>
    </Stack>
  );
};

export default PublicLayout;
