import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ValidateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://localhost:3000/users/verify', { token });
        localStorage.setItem('username', response.data.username);
        return true;
    } catch {
        return false;
    }
}

const PrivateRoute = ({ redirectPath = '/' }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                const isValid = await ValidateToken(token);
                setIsAuthenticated(isValid);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkToken();
    }, [token]);

    if (isAuthenticated === null) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;