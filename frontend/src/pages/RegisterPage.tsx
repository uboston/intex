import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      fetch(
        'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      ).then(async (response) => {
        let data = null;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (err) {
          console.warn('Response is not valid JSON:', err);
        }

        if (response.ok) {
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          navigate('/login');
        } else {
          const errors = data?.errors;
          if (errors) {
            const messages = Object.values(errors).flat().join(' ');
            setError(messages);
          } else {
            setError('Error registering.');
          }
        }
      });
    }
  };

  return (
    <div className="login-background">
  <div className="container login-page">
  <div className="auth-card">
      <div>
        <h2 className="card-title">Register For <img src="/newlogo.png" alt="CineNiche Logo" className="login-logo" /></h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label">Email address:</label>
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
          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label">Password:</label>
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
          <div className="mb-3 text-start">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
            <input
              className="form-control input-aligned"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
<br></br>
          <div className="d-grid mb-2">
            <button className="btn-login text-uppercase fw-bold" type="submit">
              Register
            </button>
          </div>
          <br></br>
          <div className="d-grid mb-2">
            <button className="btn-register text-uppercase fw-bold" type="button" onClick={handleLoginClick}>
              Go to Login
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  </div>
</div>

  );
}

export default Register;
