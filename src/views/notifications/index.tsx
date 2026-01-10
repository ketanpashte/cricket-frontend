
import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import NotificationView from './NotificationView';

const NotificationRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<NotificationView />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};
export default NotificationRoutes;
