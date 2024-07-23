import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userDetails = useSelector(state => state.user);

  const isDataComplete =
    userDetails.age &&
    userDetails.weight &&
    userDetails.height &&
    userDetails.gender &&
    userDetails.activityLevel &&
    userDetails.numberOfMealsPerDay &&
    userDetails.bmi &&
    userDetails.tdee;

  if (!isDataComplete) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
