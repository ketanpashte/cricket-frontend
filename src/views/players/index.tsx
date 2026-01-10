
import { Route, Routes } from 'react-router-dom';
import ManagePlayersPage from './PlayersView'
import NotFoundView from '../NotFoundView';
import CreatePlayerPage from './CreatePlayerView';
import EditPlayerView from './EditPlayerView';
import PlayerInfoPage from './PlayerInfoPage';


const ManagePlayersRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ManagePlayersPage />} />
            <Route path="new" element={<CreatePlayerPage />} />
            <Route path="edit/:id" element={<EditPlayerView />} />
            <Route path="/:id" element={<PlayerInfoPage />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};
export default ManagePlayersRoutes;