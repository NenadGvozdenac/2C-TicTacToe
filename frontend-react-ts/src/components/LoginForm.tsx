import { useState } from "react";
import axios from "axios";
import React from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const loginUser = (event: React.MouseEvent) => {
        event.preventDefault();

        axios.post('http://localhost:3000/users/login', {
            username: username,
            password: password
        }).then(response => {
            localStorage.setItem('jwtToken', response.data.token);
            navigate('/overview');
        }).catch(error => {
            setError(error.response.data.message);
        });
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
                        <button type="submit" className="btn btn-primary" onClick={event => loginUser(event)}>Login</button>
                    </form>
                    <div className="mt-3">
                        <a href="/register">Create an account</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
