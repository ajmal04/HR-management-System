import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const DocumentUpload = ({ requestId, onUpdate, userRole }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [requestId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/onboarding/requests/${requestId}/documents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDocuments(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again later.');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', documentType);
      formData.append('description', description);

      await axios.post(`/api/onboarding/requests/${requestId}/documents`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      
      // Refresh documents
      fetchDocuments();
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/onboarding/requests/${requestId}/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Refresh documents
      fetchDocuments();
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeOptions = () => {
    const options = [
      { value: 'ID_PROOF', label: 'ID Proof' },
      { value: 'EDUCATION_CERTIFICATE', label: 'Education Certificate' },
      { value: 'EXPERIENCE_LETTER', label: 'Experience Letter' },
      { value: 'ADDRESS_PROOF', label: 'Address Proof' },
      { value: 'MEDICAL_CERTIFICATE', label: 'Medical Certificate' },
      { value: 'OTHER', label: 'Other' }
    ];
    return options;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Document Upload</h5>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                as="select"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={uploading}
                required
              >
                <option value="">Select Document Type</option>
                {getDocumentTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description (optional)"
                disabled={uploading}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={uploading || !selectedFile || !documentType}
            >
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading...
                </>
              ) : 'Upload Document'}
            </Button>
          </Form>
          
          <h6>Uploaded Documents</h6>
          {loading ? (
            <div className="text-center p-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : documents.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Description</th>
                  <th>Uploaded By</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      {getDocumentTypeOptions().find(opt => opt.value === doc.documentType)?.label || doc.documentType}
                    </td>
                    <td>{doc.description || '-'}</td>
                    <td>{doc.uploadedBy?.fullName || '-'}</td>
                    <td>{formatDate(doc.uploadedAt)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        href={`/onboarding/documents/${doc.id}/download`}
                        target="_blank"
                      >
                        Download
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No documents have been uploaded yet.</Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DocumentUpload; 