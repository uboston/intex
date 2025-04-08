import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Privacy from './pages/Privacy';
import MovieDetailPage from './pages/MovieDetailPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import AdminPage from './pages/AdminPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/detail" element={<MovieDetailPage />} />
        <Route path="/admin/page" element={<AdminPage />} />
        {/* For any undefined route, redirect to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        {/* <Route path="/competition" element={<CompetitionPage />} /> */}
        {/* <Route
              path="/product/:rootbeerName/:rootbeerId/:currentRetailPrice"
              element={<ProductPage />}
            /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin-google" element={<Navigate to="/" />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/detail" element={<MovieDetailPage />} />
        </Routes>
        <CookieConsentBanner />
      </Router>
  );
}

export default App;
