import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollectionSchemaService } from '../services/collectionSchemaService';
import { ICollectionSchemaDto, FieldDefinitionDto } from 'pakt-sdk';

const CollectionSchemaManager: React.FC = () => {
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState<ICollectionSchemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FieldDefinitionDto[]>([]);
  
  // New field state
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('string');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldUnique, setFieldUnique] = useState(false);
  const [fieldDefault, setFieldDefault] = useState('');

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const result = await CollectionSchemaService.getAll();
      setSchemas(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch schemas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    if (!fieldName) return;
    
    const newField: FieldDefinitionDto = {
      name: fieldName,
      type: fieldType,
      required: fieldRequired,
      unique: fieldUnique,
      default: fieldDefault
    };

    setFields([...fields, newField]);
    
    // Reset field inputs
    setFieldName('');
    setFieldType('string');
    setFieldRequired(false);
    setFieldUnique(false);
    setFieldDefault('');
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleCreateSchema = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await CollectionSchemaService.create({
        name,
        description,
        schema: fields
      });
      
      // Reset form
      setName('');
      setDescription('');
      setFields([]);
      
      // Refresh list
      await fetchSchemas();
    } catch (err: any) {
      setError(err.message || 'Failed to create schema');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchema = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schema?')) return;
    
    try {
      await CollectionSchemaService.delete(id);
      await fetchSchemas();
    } catch (err: any) {
      setError(err.message || 'Failed to delete schema');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <h2>Collection Schemas</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div style={{ marginBottom: '30px' }}>
          <h3>Create New Schema</h3>
          <form onSubmit={handleCreateSchema} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. UserProfile"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Schema description"
              />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
              <h4>Add Fields</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Field Name</label>
                  <input
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="field_name"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '2px solid #e1e1e1' }}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row" style={{ marginTop: '10px' }}>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={fieldRequired}
                    onChange={(e) => setFieldRequired(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <label style={{ marginBottom: 0 }}>Required</label>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={fieldUnique}
                    onChange={(e) => setFieldUnique(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <label style={{ marginBottom: 0 }}>Unique</label>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleAddField}
                className="auth-button"
                style={{ marginTop: '10px', width: 'auto' }}
                disabled={!fieldName}
              >
                Add Field
              </button>

              {fields.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h5>Current Fields:</h5>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {fields.map((field, index) => (
                      <li key={index} style={{ background: '#f5f5f5', padding: '8px', marginBottom: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          <strong>{field.name}</strong> ({field.type}) 
                          {field.required ? ' [Req]' : ''} 
                          {field.unique ? ' [Unq]' : ''}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveField(index)}
                          style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Schema'}
            </button>
          </form>
        </div>

        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <h3>Existing Schemas</h3>
        {loading && !schemas.length ? (
          <p>Loading schemas...</p>
        ) : schemas.length === 0 ? (
          <p>No schemas found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {schemas.map((schema) => (
              <div key={schema._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{schema.name}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>{schema.description}</p>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      Fields: {schema.schema.map(f => f.name).join(', ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => navigate(`/schemas/${schema._id}/data`)}
                      style={{ background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      View Data
                    </button>
                    <button
                      onClick={() => handleDeleteSchema(schema._id)}
                      style={{ background: '#fee', color: '#c53030', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionSchemaManager;
