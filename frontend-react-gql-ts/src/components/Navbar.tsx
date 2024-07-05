import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">TicTacToe</span>
                    {localStorage.getItem('username') ? (
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                {localStorage.getItem('username')}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><button className="dropdown-item" onClick={() => {
                                    navigate('/overview');
                                }}>Overview</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={() => {
                                    localStorage.removeItem('jwtToken');
                                    localStorage.removeItem('username');
                                    navigate('/');
                                }}>Logout</button></li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            </nav>
        </>
    )
}