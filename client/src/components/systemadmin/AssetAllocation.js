import React, { useState, useEffect } from 'react';
import { 
  Card, Alert, Spinner, Table,
  Button, Badge, Modal, ListGroup, Form
} from 'react-bootstrap';
import axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';

const AssetAllocation = ({ userId: propUserId, onBack }) => {
  const { userId: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [redirectToList, setRedirectToList] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Authentication required');
    }
    return {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const authConfig = getAuthConfig();
        const [userRes, assetsRes, availableRes] = await Promise.all([
          axios.get(`/api/users/${userId}`, authConfig),
          axios.get(`/api/assets/user/${userId}`, authConfig),
          axios.get('/api/assets/available', authConfig)
        ]);
        
        setUser(userRes.data);
        setAssets(assetsRes.data || []);
        setAvailableAssets(availableRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 403) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAssetSelect = (assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId) 
        : [...prev, assetId]
    );
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError('User ID is required for asset assignment');
      return;
    }

    try {
      const authConfig = getAuthConfig();
      await axios.post('/api/assets/assign/bulk', {
        userId: userId,
        assetIds: selectedAssets
      }, authConfig);
      
      setShowConfirmModal(false);
      setRedirectToList(true);
    } catch (err) {
      console.error('Error assigning assets:', err);
      if (err.response?.status === 403) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Assignment failed');
      }
      setShowConfirmModal(false);
    }
  };

  const onBackToList = () => {
    if (onBack) {
      onBack();
    } else {
      setRedirectToList(true);
    }
  };

  if (redirectToList) {
    return <Redirect to="/onboarding/list" />;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    );
  }

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4>Assign Assets to {user?.fullName}</h4>
              <small className="text-muted">
                {user?.department?.departmentName || 'No Department'} • {user?.email || 'No Email'}
              </small>
            </div>
            <Button 
              size="sm" 
              variant="outline-secondary" 
              onClick={onBackToList}
            >
              Back to List
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <h5 className="mb-3">Currently Assigned</h5>
              {assets.length > 0 ? (
                <ListGroup variant="flush">
                  {assets.map(asset => (
                    <ListGroup.Item key={asset.id} className="py-2 px-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{asset.assetName}</div>
                          <small className="text-muted">
                            {asset.assetType} • {asset.assetSerialNumber || 'No Serial'}
                          </small>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            Assigned on: {new Date(asset.allocatedOn).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge bg={asset.status === 'active' ? 'success' : 'secondary'}>
                          {asset.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="info" className="mt-3">
                  No assets currently assigned
                </Alert>
              )}
            </div>

            <div className="col-md-6">
              <h5 className="mb-3">Available Assets</h5>
              {availableAssets.length > 0 ? (
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th width="50px"></th>
                      <th>Asset</th>
                      <th>Type</th>
                      <th>Serial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableAssets.map(asset => (
                      <tr key={asset.id}>
                        <td>
                          <Form.Check 
                            type="checkbox"
                            checked={selectedAssets.includes(asset.id)}
                            onChange={() => handleAssetSelect(asset.id)}
                          />
                        </td>
                        <td>{asset.assetName}</td>
                        <td>{asset.assetType}</td>
                        <td>{asset.assetSerialNumber || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="mt-3">
                  No available assets found
                </Alert>
              )}
            </div>
          </div>

          {selectedAssets.length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{selectedAssets.length}</strong> asset(s) selected
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Confirm Assignment
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal 
        show={showConfirmModal} 
        onHide={() => setShowConfirmModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Asset Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Assign these assets to {user?.fullName}?</p>
          <ListGroup variant="flush">
            {selectedAssets.map(assetId => {
              const asset = availableAssets.find(a => a.id === assetId);
              return asset ? (
                <ListGroup.Item key={assetId} className="py-2 px-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{asset.assetName}</div>
                      <small className="text-muted">
                        {asset.assetType} • {asset.assetSerialNumber || 'No Serial'}
                      </small>
                    </div>
                  </div>
                </ListGroup.Item>
              ) : null;
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
          >
            Confirm Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssetAllocation;