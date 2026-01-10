import { Route, Routes } from 'react-router-dom';
import NotFoundView from '../NotFoundView';
import NewsList from './NewsList';
import NewsForm from './NewsForm';

const ManageNewsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<NewsList />} />
            <Route path="new" element={<NewsForm />} />
            <Route path="/edit/:id" element={<NewsForm />} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};
export default ManageNewsRoutes;
