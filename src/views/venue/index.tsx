import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import VenueListPage from './venueListPage';
import VenueFormPage from './venueFrom';

const ManageVenues = () => {
    return (
        <Routes>
            {/* Venue List */}
            <Route path="/" element={<VenueListPage />} />

            {/* Add Venue */}
            <Route path="/add" element={<VenueFormPage />} />

            {/* Edit Venue */}
            <Route path="/edit/:id" element={<VenueFormPage />} />

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};

export default ManageVenues;
