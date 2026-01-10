
import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import ManageTournamentsPage from './TournamentView';
import CreateTournamentPage from './TournamentForm';
import TournamentInfoPage from './TournamentInfoView';
import EditTournamentView from './EditTournamentView';


const ManageTournamentRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ManageTournamentsPage />} />
            <Route path="new" element={<CreateTournamentPage />} />
            <Route path="/:id" element={<TournamentInfoPage />} />
            <Route path="/edit/:id" element={<EditTournamentView />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};
export default ManageTournamentRoutes;