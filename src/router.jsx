import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Onboarding from './pages/Onboarding.jsx';
import FavouriteFood from './pages/FavouriteFood.jsx';
import NotFound from './pages/NotFound.jsx';
import DietFood from './pages/DietFood.jsx';
import TimeToEat from './pages/TimeToEat.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';

function Router() {
  return (
    <div>
      <Sidebar>
        <Routes>
          <Route path='/' element={<Onboarding />} />
          <Route
            path='favourite-food'
            element={
              <ProtectedRoute>
                <FavouriteFood />
              </ProtectedRoute>
            }
          />
          <Route
            path='diet-food'
            element={
              <ProtectedRoute>
                <DietFood />
              </ProtectedRoute>
            }
          />
          <Route
            path='time-to-eat'
            element={
              <ProtectedRoute>
                <TimeToEat />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Sidebar>
    </div>
  );
}

export default Router;
