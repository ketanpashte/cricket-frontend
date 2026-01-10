
import ManageMatchesPage from './MatchView'

// import React from 'react';

import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import CreateMatchPage from './matchForm';
import EditMatchView from './EditMatch';
import MatchInfoPage from './MatchInfoPage';
import MatchSessionPage from './MatchSessionPage';


const ManageMatchRouts = () => {
    return (
        <Routes>
            <Route path="/" element={<ManageMatchesPage />} />
            <Route path="new" element={<CreateMatchPage />} />
            <Route path="/:id" element={<MatchInfoPage />} />
            <Route path="/:id" element={<MatchInfoPage />} />
            <Route path="/edit/:id" element={<EditMatchView />} />
            <Route path="/session/:id" element={<MatchSessionPage />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};
export default ManageMatchRouts;