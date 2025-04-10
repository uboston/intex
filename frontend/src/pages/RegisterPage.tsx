import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';

function Register() {
  // state variables for email and passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // state variable for error messages
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // handle submit event for the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate email and passwords
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      // clear error message
      setError('');
      // post data to the /register api
      fetch(
        'https://cinenicheee-c0fqg8b9hscqe7bk.eastus-01.azurewebsites.net/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      ).then(async (response) => {
        let data = null;
        try {
          // Only try to parse JSON if there's content
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (err) {
          console.warn('Response is not valid JSON:', err);
        }

        if (response.ok) {
          setError('');
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
      <div className="row justify-content-center">
        <div className="container">
          <div className="row">
            <div className="card border-0 shadow rounded-3 ">
              <div className="card-body p-4 p-sm-5">
                <h5 className="card-title text-center mb-5 fw-light fs-5">
                  Register
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
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>

                  <div className="d-grid mb-2">
                    <button
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                  <div className="d-grid mb-2">
                    <button
                      className="btn btn-primary btn-login text-uppercase fw-bold"
                      onClick={handleLoginClick}
                    >
                      Go to Login
                    </button>
                  </div>
                </form>
                <strong>{error && <p className="error">{error}</p>}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
