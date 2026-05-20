import { useEffect, useState } from 'react';
import API from '../../api/axios';
import './Dashboard.css';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    lowStock: 0,
    activeProducts: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/products');
        const products = data.data;
        setStats({
          totalProducts: products.length,
          activeProducts: products.filter(p => p.isActive).length,
          lowStock: products.filter(p => p.quantity < 10).length,
          totalOrders: 0,
        });
        setRecentProducts(products.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Products" value={stats.totalProducts} icon="◈" color="#00ff88" sub="In inventory" />
        <StatCard label="Active Products" value={stats.activeProducts} icon="◉" color="#7c3aed" sub="Currently listed" />
        <StatCard label="Low Stock" value={stats.lowStock} icon="▲" color="#ffc107" sub="Below 10 units" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon="◎" color="#00b4d8" sub="All time" />
      </div>

      <div className="dashboard-bottom">
        <div className="card recent-card">
          <div className="card-header">
            <h3 className="card-title">Recent Products</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products yet</td></tr>
                ) : (
                  recentProducts.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>{p.quantity}</td>
                      <td>
                        <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card info-card">
          <h3 className="card-title">Quick Stats</h3>
          <div className="quick-stats">
            <div className="qs-item">
              <span className="qs-label">Total Stock Value</span>
              <span className="qs-value accent">
                ₹{recentProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0).toLocaleString()}
              </span>
            </div>
            <div className="qs-item">
              <span className="qs-label">Avg Product Price</span>
              <span className="qs-value">
                ₹{recentProducts.length ? Math.round(recentProducts.reduce((a, p) => a + p.price, 0) / recentProducts.length) : 0}
              </span>
            </div>
            <div className="qs-item">
              <span className="qs-label">Categories</span>
              <span className="qs-value">
                {new Set(recentProducts.map(p => p.category)).size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;