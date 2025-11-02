import { Navigate, Outlet } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { roleType as UserRole } from '../Types/Task';

const ProtectedRoute:React.FC<{allowedRoles : UserRole[]}> = ({ allowedRoles }) => {
    const { checkToken, checkAdmin, checkUser  } = useToken();

    if (!checkToken()) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles.includes(UserRole.ADMIN) && !checkAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }
    if (allowedRoles.includes(UserRole.USER) && !checkUser()) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;