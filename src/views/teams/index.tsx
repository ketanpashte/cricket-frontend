import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import ManageTeamsPage from './TeamsView';
import CreateTeamPage from './CreateTeam';
import EditTeamView from './EditTeamView';
import TeamInfoPage from './TeamInfoView';
import TeamPlayerManagementPage from './playerManegment';

const ManageTeamsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ManageTeamsPage />} />
            <Route path="new" element={<CreateTeamPage />} />
            <Route path="edit/:id" element={<EditTeamView />} />
            <Route path="players/:id" element={<TeamPlayerManagementPage />} />
            <Route path=":id" element={<TeamInfoPage />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};

export default ManageTeamsRoutes;
