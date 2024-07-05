import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './hooks/PrivateRoute';
import Overview from './pages/Overview';
import GameHistory from './pages/GameHistory';
import SingleplayerGame from './pages/SingleplayerGame';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<PrivateRoute />}>
          <Route path="/overview" element={<Overview />} />
        </Route>
        <Route path="/singleplayer" element={<PrivateRoute />}>
          <Route path="/singleplayer" element={<SingleplayerGame />} />
        </Route>
        <Route path="/history" element={<PrivateRoute />}>
          <Route path="/history" element={<GameHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
