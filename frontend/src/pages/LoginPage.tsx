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
    window.location.href = 'https://localhost:5000/external-login/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://localhost:5000/external-login/facebook';
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
      ? 'https://localhost:5000/login?useCookies=true&useSessionCookies=false'
      : 'https://localhost:5000/login?useSessionCookies=true&useCookies=false';

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
          <div className="card border-0 shadow rounded-3">
            <div className="card-body p-4 p-sm-5">
              <h5 className="form-check-label text-center mb-5 fw-light fs-5">
                Sign In to CineNiche
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-check mb-3">
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
                <div className="d-grid mb-2">
                  <button
                    className="btn-login btn-primary text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
                <div className="d-grid mb-2">
                  <button
                    className="btn-login btn-primary text-uppercase fw-bold"
                    onClick={handleRegisterClick}
                    type="button"
                  >
                    Register
                  </button>
                </div>
                <hr className="my-4" />
                <div className="d-grid mb-2">
                  <button
                    className="btn btn-google btn-login text-uppercase fw-bold"
                    onClick={handleGoogleLogin}
                    type="button"
                  >
                    Sign in with Google
                  </button>
                </div>
                <div className="d-grid mb-2">
                  <button
                    className="btn btn-facebook btn-login text-uppercase fw-bold"
                    onClick={handleFacebookLogin}
                    type="button"
                  >
                    <i className="fa-brands fa-facebook-f me-2"></i>
                    Sign in with Facebook
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
