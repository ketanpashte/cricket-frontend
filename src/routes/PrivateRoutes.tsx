import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateLayout } from '../layout';
import { NotFoundView } from '../views';
import WelcomeView from '../views/Welcome';
import ManageMatchRouts from '../views/matches';
import ManagePlayersRoutes from '../views/players';
import ManageTeamsRoutes from '../views/teams';
import ManageTournamentRoutes from '../views/tournaments';
import LiveMatchRoute from '../views/BallUserPanel';
import ManageVenues from '../views/venue';
import ManageNewsRoutes from '../views/news';
import CommentaryRoutes from '../views/commentary';
import NotificationRoutes from '../views/notifications';

/**
 * List of routes available  for authenticated users
 * Also renders the "Private Layout" composition
 * @routes PrivateRoutes
 */
const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<WelcomeView />} />
        <Route
          path="auth/*"
          element={<Navigate to="/" replace />}
        />
        <Route path="tournaments/*" element={<ManageTournamentRoutes />} />
        <Route path="matches/*" element={<ManageMatchRouts />} />
        <Route path="teams/*" element={<ManageTeamsRoutes />} />
        <Route path="players/*" element={<ManagePlayersRoutes />} />
        <Route path="news/*" element={<ManageNewsRoutes />} />
        <Route path="notifications/*" element={<NotificationRoutes />} />
        <Route path="venues/*" element={<ManageVenues />} />
        <Route path="commentary/*" element={<CommentaryRoutes />} />
        <Route path="live/:id" element={<LiveMatchRoute />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
