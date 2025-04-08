import './App.css';
import CompetitionPage from './pages/CompetitionPage';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Privacy from './pages/Privacy'; // Import the Privacy page
import MovieDetailPage from './pages/MovieDetailPage';
import AdminPage from './pages/AdminPage'; // Import the AdminMovies page/component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CompetitionPage />} />
        <Route path="/competition" element={<CompetitionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signin-google" element={<Navigate to="/" />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/detail" element={<MovieDetailPage />} />
        <Route path="/signin-google" element={<Navigate to="/" />} />
        <Route path="/adminpage" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
