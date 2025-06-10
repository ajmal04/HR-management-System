import React, { useState } from 'react';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const DocumentUpload = ({ requestId, onUpdate }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      if (!selectedFile) {
        setError('Please select a file');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', documentType);
      formData.append('description', description);

      await axios.post(
        `/api/onboarding/requests/${requestId}/documents`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );

      setSuccess('Document uploaded successfully!');
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      
      if (onUpdate) {
        onUpdate(); // Notify parent component of the update
      }
    } catch (error) {
      let errorMsg = 'Upload failed';
      if (error.response) {
        errorMsg = error.response.data.message || 
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg = 'No response from server';
      } else {
        errorMsg = error.message;
      }
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const getDocumentTypeOptions = () => {
    return [
      { value: 'ID_PROOF', label: 'ID Proof' },
      { value: 'EDUCATION_CERTIFICATE', label: 'Education Certificate' },
      { value: 'EXPERIENCE_LETTER', label: 'Experience Letter' },
      { value: 'ADDRESS_PROOF', label: 'Address Proof' },
      { value: 'MEDICAL_CERTIFICATE', label: 'Medical Certificate' },
      { value: 'OTHER', label: 'Other' }
    ];
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Document Upload</h5>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default DocumentUpload;