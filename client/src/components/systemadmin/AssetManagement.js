import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    assetSerialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    supplier: '',
    warrantyExpiry: '',
    notes: ''
  });

  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get('/api/assets', authConfig);
      setAssets(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err.response?.data?.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/assets', formData, authConfig);
      setShowAddModal(false);
      setFormData({
        assetName: '',
        assetType: '',
        assetSerialNumber: '',
        purchaseDate: '',
        purchasePrice: '',
        supplier: '',
        warrantyExpiry: '',
        notes: ''
      });
      fetchAssets();
    } catch (err) {
      console.error('Error adding asset:', err);
      setError(err.response?.data?.message || 'Failed to add asset');
    }
  };

  const handleEditAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/assets/${selectedAsset.id}`, formData, authConfig);
      setShowEditModal(false);
      setSelectedAsset(null);
      setFormData({
        assetName: '',
        assetType: '',
        assetSerialNumber: '',
        purchaseDate: '',
        purchasePrice: '',
        supplier: '',
        warrantyExpiry: '',
        notes: ''
      });
      fetchAssets();
    } catch (err) {
      console.error('Error updating asset:', err);
      setError(err.response?.data?.message || 'Failed to update asset');
    }
  };

  const handleEditClick = (asset) => {
    setSelectedAsset(asset);
    setFormData({
      assetName: asset.assetName,
      assetType: asset.assetType,
      assetSerialNumber: asset.assetSerialNumber || '',
      purchaseDate: asset.purchaseDate ? moment(asset.purchaseDate).format('YYYY-MM-DD') : '',
      purchasePrice: asset.purchasePrice || '',
      supplier: asset.supplier || '',
      warrantyExpiry: asset.warrantyExpiry ? moment(asset.warrantyExpiry).format('YYYY-MM-DD') : '',
      notes: asset.notes || ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Asset Management</h4>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            Add New Asset
          </Button>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Table responsive hover>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.assetName}</td>
                  <td>{asset.assetType}</td>
                  <td>{asset.assetSerialNumber || '-'}</td>
                  <td>
                    <Badge bg={
                      asset.status === 'available' ? 'success' :
                      asset.status === 'assigned' ? 'primary' :
                      asset.status === 'maintenance' ? 'warning' : 'secondary'
                    }>
                      {asset.status}
                    </Badge>
                  </td>
                  <td>{asset.purchaseDate ? moment(asset.purchaseDate).format('MMM D, YYYY') : '-'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(asset)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Asset Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Asset</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAsset}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Asset Name</Form.Label>
              <Form.Control
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asset Type</Form.Label>
              <Form.Control
                type="text"
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="assetSerialNumber"
                value={formData.assetSerialNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Date</Form.Label>
              <Form.Control
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                step="0.01"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Warranty Expiry</Form.Label>
              <Form.Control
                type="date"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Asset
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Asset Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Asset</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditAsset}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Asset Name</Form.Label>
              <Form.Control
                type="text"
                name="assetName"
                value={formData.assetName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asset Type</Form.Label>
              <Form.Control
                type="text"
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="assetSerialNumber"
                value={formData.assetSerialNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Date</Form.Label>
              <Form.Control
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                step="0.01"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Warranty Expiry</Form.Label>
              <Form.Control
                type="date"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetManagement; 