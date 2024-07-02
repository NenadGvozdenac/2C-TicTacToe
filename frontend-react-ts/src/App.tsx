import PrivateRoute from './hooks/PrivateRoute';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Overview from './pages/Overview';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
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
        <Route path="/history" element={<PrivateRoute />}>
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="/singleplayer" element={<PrivateRoute />}>
          <Route path="/singleplayer" element={<SingleplayerGame />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
