import './Orders.css';
import API from '../../api/axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Orders = () => {
    const [Orders, setOrderds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders');
            setOrderds(data.data);
        } catch { toast.error('Failed to load products'); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchOrders(); }, []);

    const filtered = Orders.filter(p =>
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Orders</h1>
                <p className="page-subtitle">Track and manage customer orders</p>
            </div>
            <div className="table-toolbar">
                <input
                    className="search-bar"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {/* <button className="btn-primary" onClick={openAdd}>+ Add Product</button> */}
            </div>
            <div className="card">
                <div className="table-toolbar">
                    <input className="search-bar" placeholder="Search orders..." />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select className="search-bar" style={{ width: 'auto' }}>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="empty-orders">
                                            <span className="empty-icon">◎</span>
                                            <p>No orders yet</p>
                                            <small>Orders will appear here once customers start placing them</small>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(p => (
                                <tr key={p._id}>

                                    <td>{p.user._id}</td>
                                    <td>{p.user.name}</td>

                                    <td>{p.productName}</td>
                                    <td>
                                        <span className={`badge ${p.quantity < 10 ? 'badge-warning' : 'badge-success'}`}>
                                            {p.quantity} units
                                        </span>
                                    </td>
                                    <td>
                                        <span >
                                            ₹{p.totalAmount}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                                            {p.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                   
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;