import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import '@fortawesome/fontawesome-free/css/all.css';

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href =
      'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/external-login/google';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const loginUrl = rememberme
      ? 'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/login?useCookies=true&useSessionCookies=false'
      : 'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/login?useSessionCookies=true&useCookies=false';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      navigate('/movies');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
      console.error('Fetch attempt failed:', error);
    }
  };

  return (
    <div className="login-background">
      {/* 
        Override Bootstrap container and row constraints in CSS
        to prevent horizontal scrolling.
      */}
      <div className="container login-page">
        <div className="row justify-content-center">
          <div className="auth-card">
            <div className="container">
              <div className="text-center mb-5">
                <h5 className="form-check-label fw-light fs-5">
                  Sign in to{' '}
                  <img
                    src="/newlogo.png"
                    alt="CineNiche Logo"
                    className="login-logo"
                  />
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3 text-start">
                  <label htmlFor="email" className="form-label">
                    Email address:
                  </label>
                  <input
                    className="form-control input-aligned"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <br></br>
                <div className="form-group mb-3 text-start">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    className="form-control input-aligned"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <br></br>
                <div className="form-check mb-3 text-start">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberme"
                    name="rememberme"
                    checked={rememberme}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberme">
                    Remember password
                  </label>
                </div>
                <br></br>
                <div className="d-grid mb-2">
                  <button
                    className="btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
                <div className="d-grid mb-2">
                  <button
                    className="btn-register text-uppercase fw-bold"
                    onClick={handleRegisterClick}
                    type="button"
                  >
                    Register
                  </button>
                </div>
              </form>

              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
