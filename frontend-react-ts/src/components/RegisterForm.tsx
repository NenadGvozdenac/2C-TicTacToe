import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const Register = (event: React.MouseEvent) => {
        event.preventDefault();

        // Send a POST request to the backend
        axios.post('http://localhost:3000/users/register', {
            username: username,
            password: password,
            confirmPassword: confirmPassword
        }).then(response => {
            console.log(response);
            // Redirect to the login page
            navigate('/');
        }).catch(error => {
            console.error(error);
            setError(error.response.data.message);
        });
    }

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-4 offset-md-3">
                    <h1 className='text-center'>Register</h1>
                    <p className='text-danger'>{error}</p>
                    <form>
                        <div className='mb-3'>
                            <label htmlFor='username' className='form-label'>Username</label>
                            <input type='text' 
                                className='form-control' 
                                id='username' 
                                pattern="[a-zA-Z0-9]+"
                                onChange={event => setUsername(event.target.value)} 
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input type='password' 
                                className='form-control' 
                                id='password' 
                                pattern="[a-zA-Z0-9]+"
                                onChange={event => setPassword(event.target.value)} 
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword' className='form-label'>Confirm Password</label>
                            <input type='password' 
                                className='form-control' 
                                id='confirmPassword' 
                                pattern="[a-zA-Z0-9]+"
                                onChange={event => setConfirmPassword(event.target.value)} 
                            />
                        </div>
                        <button type='submit' className='btn btn-primary' onClick={event => Register(event)}>Register</button>
                    </form>
                    <div className='mt-3'>
                        Already have an account? <a href='/'>Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}