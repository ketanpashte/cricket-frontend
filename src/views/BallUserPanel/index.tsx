

import { Route, Routes, useParams } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import MatchResultView from './components/MatchResultView';
import { MatchProvider } from './context/MatchContext';


const LiveMatchRoute = () => {
    const { id: matchId } = useParams<{ id: string }>();
    if (!matchId) {
        return <p>Invalid match ID</p>;
    }
    return (
        <MatchProvider matchId={matchId}>
            <Routes >
                <Route path="/" element={<MatchResultView />} />
                <Route path="*" element={<NotFoundView />} />
            </Routes>
        </MatchProvider>
    );
};
export default LiveMatchRoute;