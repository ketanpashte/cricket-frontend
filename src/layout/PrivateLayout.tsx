import { useState, useCallback, FunctionComponent, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, useTheme } from '@mui/material';
import { AppIconButton, ErrorBoundary } from '../components';
import { LinkToPage } from '../utils/type';
import {
  SIDE_BAR_DESKTOP_ANCHOR,
  SIDE_BAR_WIDTH,
  TOP_BAR_DESKTOP_HEIGHT,
} from './config';
import TopBar from './TopBar';
import SideBar from './SideBar';

const TITLE_PRIVATE = 'Cricket Admin';

const SIDE_BAR_ITEMS: Array<LinkToPage> = [
  { title: 'Dashboard', path: '/', icon: 'dashboard' },
  { title: 'Matches', path: '/matches', icon: 'sports_cricket' },
  { title: 'Series', path: '/tournaments', icon: 'emoji_events' },
  { title: 'Teams', path: '/teams', icon: 'groups' },
  { title: 'Players', path: '/players', icon: 'login' },
  { title: 'News', path: '/news', icon: 'newspaper' },
  { title: 'Notifications', path: '/notifications', icon: 'campaign' },
  { title: 'Venues', path: '/venues', icon: 'location' },
  { title: 'Commentary', path: '/commentary', icon: 'comment' },
  { title: 'Reports', path: '/reports', icon: 'bar_chart' },
  { title: 'Settings', path: '/settings', icon: 'settings' },
];

if (process.env.REACT_APP_DEBUG === 'true') {
  SIDE_BAR_ITEMS.push({ title: '[Debug Tools]', path: '/dev', icon: 'build' });
}

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const navigation = useNavigate();
  const [sideBarVisible, setSideBarVisible] = useState(false);

  const sidebarOpen = sideBarVisible;
  const sidebarVariant = 'persistent';

  document.title = TITLE_PRIVATE;

  const onLogoClick = useCallback(() => {
    navigation(SIDE_BAR_ITEMS?.[0]?.path || '/');
  }, [navigation]);

  return (
    <Stack
      direction="column"
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        paddingTop: TOP_BAR_DESKTOP_HEIGHT,
        paddingLeft:
          sidebarOpen && SIDE_BAR_DESKTOP_ANCHOR.includes('left')
            ? SIDE_BAR_WIDTH
            : 0,
        paddingRight:
          sidebarOpen && SIDE_BAR_DESKTOP_ANCHOR.includes('right')
            ? SIDE_BAR_WIDTH
            : 0,
        transition: theme.transitions.create(['padding-left', 'padding-right'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {/* Top App Bar */}
      <Stack
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left:
            sidebarOpen && SIDE_BAR_DESKTOP_ANCHOR.includes('left')
              ? SIDE_BAR_WIDTH
              : 0,
          right:
            sidebarOpen && SIDE_BAR_DESKTOP_ANCHOR.includes('right')
              ? SIDE_BAR_WIDTH
              : 0,
          height: TOP_BAR_DESKTOP_HEIGHT,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          transition: theme.transitions.create(['left', 'right'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <TopBar
          startNode={
            <AppIconButton
              icon={sidebarOpen ? 'close' : 'menu'}
              onClick={() => setSideBarVisible(!sidebarOpen)}
              aria-label="Toggle Sidebar"
            />
          }
          title={TITLE_PRIVATE}
        />
      </Stack>

      {/* Sidebar */}
      <SideBar
        anchor={SIDE_BAR_DESKTOP_ANCHOR}
        open={sidebarOpen}
        variant={sidebarVariant}
        items={SIDE_BAR_ITEMS}
        onClose={() => setSideBarVisible(false)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 1,
          bgcolor: theme.palette.background.default,
          minHeight: `calc(100vh - ${TOP_BAR_DESKTOP_HEIGHT}px)`,
          overflowY: 'auto',
        }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Box>
    </Stack>
  );
};

export default PrivateLayout;
