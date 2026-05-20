import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const EMPTY = { name: '', description: '', price: '', quantity: '', category: '', image: '', isActive: true };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data.data || []);
    } catch { 
      toast.error('Failed to load products'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => { 
    setEditing(p._id); 
    setForm({ 
      name: p.name || '', 
      description: p.description || '', 
      price: p.price || '', 
      quantity: p.quantity || '', 
      category: p.category || '', 
      image: p.image || '', 
      isActive: p.isActive ?? true 
    }); 
    setShowModal(true); 
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/products/${editing}`, form);
        toast.success('Product updated!');
      } else {
        await API.post('/products', form);
        toast.success('Product created!');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted!');
      fetchProducts();
    } catch { 
      toast.error('Failed to delete'); 
    }
  };

  const filtered = products.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Manage your inventory products</p>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            className="search-bar"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.name}</strong>
                      <br />
                      <small style={{ color: 'var(--text-muted)' }}>
                        {p.description ? p.description.slice(0, 40) + '...' : '—'}
                      </small>
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <span className={`badge ${p.quantity < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {p.quantity} units
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Enter name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    placeholder="Enter category" 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Enter description" 
                  rows={3} 
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange} 
                    placeholder="0" 
                    min="0"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    value={form.quantity} 
                    onChange={handleChange} 
                    placeholder="0" 
                    min="0"
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input 
                  name="image" 
                  value={form.image} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange} 
                  id="isActive" 
                  style={{ width: 'auto' }} 
                />
                <label 
                  htmlFor="isActive" 
                  style={{ marginBottom: 0, textTransform: 'none', fontSize: '14px', color: 'var(--text)' }}
                >
                  Active Product
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;