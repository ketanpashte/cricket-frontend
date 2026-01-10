import { Route, Routes } from 'react-router-dom';
import CommentaryDashboard from './CommentaryDashboard';
import CommentaryDetails from './CommentaryDetails';

const CommentaryRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CommentaryDashboard />} />
            <Route path="match/:matchId" element={<CommentaryDetails />} />
        </Routes>
    );
};

export default CommentaryRoutes;
