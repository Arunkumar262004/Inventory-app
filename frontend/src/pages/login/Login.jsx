import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">l̥
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">INVENTO</span>
        </div>
        <div className="login-tagline">
          <h1>Manage your<br /><span>inventory</span><br />with precision.</h1>
          <p>The admin panel built for speed and clarity.</p>
        </div>
        <div className="login-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Sign in</h2>
          <p className="login-sub">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;