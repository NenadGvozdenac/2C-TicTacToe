import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import REGISTER_QUERY from "../queries/register_queries";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const [register, { loading }] = useMutation(REGISTER_QUERY, {
        onCompleted: (data) => {
            if(data.register) {
                navigate('/');
            }
        },
        onError: (error) => {
            setError(error.message);
        }
    })

    const Register = (event: React.MouseEvent) => {
        event.preventDefault();

        // TODO: Implement register functionality
        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        register({ variables: { username, password, confirmPassword } });
    }

    return (
        <div className='container'>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-md-4">
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
                        <button type='submit' 
                            className='btn btn-primary' 
                            onClick={Register} 
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <div className='mt-3'>
                        Already have an account? <a href='/'>Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}