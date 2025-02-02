import PrivateRoute from './hooks/PrivateRoute';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Overview from './pages/Overview';
import GameHistory from './pages/GameHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import SingleplayerGame from './pages/SingleplayerGame';
import MultiplayerGame from './pages/MultiplayerGame';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<PrivateRoute />}>
          <Route path="/overview" element={<Overview />} />
        </Route>
        <Route path="/history" element={<PrivateRoute />}>
          <Route path="/history" element={<GameHistory />} />
        </Route>
        <Route path="/singleplayer" element={<PrivateRoute />}>
          <Route path="/singleplayer" element={<SingleplayerGame />} />
        </Route>
        <Route path="/multiplayer" element={<PrivateRoute />}>
          <Route path="/multiplayer" element={<MultiplayerGame />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
