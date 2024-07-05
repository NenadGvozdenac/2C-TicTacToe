import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";
import JWT_QUERY from "../queries/jwt_queries";

const PrivateRoute = ({ redirectPath = '/' }) => {
    useQuery(JWT_QUERY, {
        variables: { token: localStorage.getItem('token') },
        onCompleted: data => {
            localStorage.setItem('username', data.decodeJwt.username);
            localStorage.setItem('userId', data.decodeJwt.userid);
            setIsAuthenticated(true);
        },
        onError: _ => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            setIsAuthenticated(false);
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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