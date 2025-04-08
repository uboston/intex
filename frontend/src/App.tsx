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
import MoviesPage from './pages/MoviesPage';
import Home from './pages/Home';



function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/detail" element={<MovieDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/signin-google" element={<Navigate to="/" />} />
        {/* <Route
              path="/product/:rootbeerName/:rootbeerId/:currentRetailPrice"
              element={<ProductPage />}
            /> */}
        </Routes>
        <CookieConsentBanner />
      </Router>
 </>
  );
}

export default App;
