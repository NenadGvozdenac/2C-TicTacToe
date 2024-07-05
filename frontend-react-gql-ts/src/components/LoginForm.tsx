import { useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import LOGIN_QUERY from "../queries/login_queries";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const [login, { loading }] = useMutation(LOGIN_QUERY, {
        onCompleted: (data) => {
            if (data.login.token) {
                localStorage.setItem('token', data.login.token);
                localStorage.setItem('userId', data.login.user.id);
                localStorage.setItem('username', data.login.user.username);
                navigate('/overview');
            }
        },
        onError: (err) => {
            setError(err.message);
        }
    });

    const loginUser = (event: React.MouseEvent) => {
        event.preventDefault();
        login({ variables: { username, password } });
    }

    return (
        <div className="container">
            <div className="row d-flex align-items-center justify-content-center">
                <div className="col-md-4 col-8">
                    <h1 className="text-center">Login</h1>
                    <p className="text-danger">{error}</p>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                pattern="[a-zA-Z0-9]+"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                pattern="[a-zA-Z0-9]+"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={loginUser} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-3">
                        <a href="/register">Create an account</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
