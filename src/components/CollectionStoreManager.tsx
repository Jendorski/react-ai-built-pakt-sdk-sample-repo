import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CollectionStoreService } from '../services/collectionStoreService';
import { CollectionSchemaService } from '../services/collectionSchemaService';
import { ICollectionSchemaDto, ICollectionStoreDto } from 'pakt-sdk';

const CollectionStoreManager: React.FC = () => {
  const { schemaId } = useParams<{ schemaId: string }>();
  const navigate = useNavigate();
  
  const [schema, setSchema] = useState<ICollectionSchemaDto | null>(null);
  const [items, setItems] = useState<ICollectionStoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (schemaId) {
      fetchData();
    }
  }, [schemaId]);

  const fetchData = async () => {
    if (!schemaId) return;
    
    try {
      setLoading(true);
      // 1. Fetch Schema to know fields
      const schemaResult = await CollectionSchemaService.getById(schemaId);
      setSchema(schemaResult);
      
      // 2. Fetch Store Items using schema name (reference)
      // Note: The SDK requires schemaReference, which is usually the schema name
      const itemsResult = await CollectionStoreService.getAll(schemaResult.name);
      setItems(itemsResult.data || []);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schema) return;

    setError('');
    setLoading(true);

    try {
      await CollectionStoreService.create(schema.name, formData);
      
      // Reset form
      setFormData({});
      
      // Refresh list
      const itemsResult = await CollectionStoreService.getAll(schema.name);
      setItems(itemsResult.data || []);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!schema || !window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await CollectionStoreService.delete(schema.name, id);
      
      // Refresh list
      const itemsResult = await CollectionStoreService.getAll(schema.name);
      setItems(itemsResult.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  if (loading && !schema) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!schema) {
    return <div className="dashboard-container">Schema not found</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="auth-card" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{schema.name} Data</h2>
          <button onClick={() => navigate('/schemas')} className="auth-button" style={{ width: 'auto', margin: 0, padding: '8px 16px', fontSize: '0.9rem' }}>
            Back to Schemas
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div style={{ marginBottom: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
          <h3>Add New Item</h3>
          <form onSubmit={handleCreateItem} className="auth-form">
            <div className="form-row" style={{ flexWrap: 'wrap' }}>
              {schema.schema.map((field) => (
                <div key={field.name} className="form-group" style={{ minWidth: '45%' }}>
                  <label>
                    {field.name} 
                    {field.required && <span style={{ color: 'red' }}> *</span>}
                    <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'normal' }}> ({field.type})</span>
                  </label>
                  
                  {field.type === 'boolean' ? (
                    <select
                      value={formData[field.name] === undefined ? '' : formData[field.name].toString()}
                      onChange={(e) => handleInputChange(field.name, e.target.value === 'true')}
                      required={field.required}
                      style={{ padding: '12px', borderRadius: '8px', border: '2px solid #e1e1e1' }}
                    >
                      <option value="">Select...</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
                      required={field.required}
                      placeholder={`Enter ${field.name}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder={`Enter ${field.name}`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <button type="submit" className="auth-button" disabled={loading} style={{ marginTop: '15px' }}>
              {loading ? 'Creating...' : 'Add Item'}
            </button>
          </form>
        </div>

        <h3>Existing Items</h3>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  {schema.schema.map(field => (
                    <th key={field.name} style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>{field.name}</th>
                  ))}
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                    {schema.schema.map(field => (
                      <td key={field.name} style={{ padding: '10px' }}>
                        {item[field.name] !== undefined ? String(item[field.name]) : '-'}
                      </td>
                    ))}
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        style={{ background: '#fee', color: '#c53030', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionStoreManager;
