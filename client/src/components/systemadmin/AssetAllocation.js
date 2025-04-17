import React, { useState, useEffect } from 'react';
import { 
  Card, Alert, Spinner, Table,
  Button, Badge, Modal, ListGroup, Form
} from 'react-bootstrap';
import axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';
import AssetItem from './AssetItem';

const authConfig = {
  headers: { 
    Authorization: `Bearer ${localStorage.getItem("token")}` 
  }
};

const AssetAllocation = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [redirectToOnboarding, setRedirectToOnboarding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, assetsRes, availableRes] = await Promise.all([
          axios.get(`/api/users/${userId}/summary`, authConfig()),
          axios.get(`/api/assets/user/${userId}`, authConfig()),
          axios.get('/api/assets/available', authConfig())
        ]);
        
        setUser(userRes.data);
        setAssets(assetsRes.data);
        setAvailableAssets(availableRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
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
    try {
      await axios.post('/api/assets/assign/bulk', {
        userId,
        assetIds: selectedAssets
      }, authConfig());
      setRedirectToOnboarding(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed');
      setShowConfirmModal(false);
    }
  };

  if (redirectToOnboarding && user?.currentOnboardingId) {
    return <Redirect to={`/onboarding/${user.currentOnboardingId}`} />;
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
              <h4>Assign Assets to {user?.full_name}</h4>
              <small className="text-muted">
                {user?.department} • {user?.email}
              </small>
            </div>
            <Button 
              size="sm" 
              variant="outline-secondary" 
              onClick={() => setRedirectToOnboarding(true)}
              disabled={!user?.currentOnboardingId}
            >
              Back to Onboarding
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
                      <AssetItem asset={asset} />
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
          <p>Assign these assets to {user?.full_name}?</p>
          <ListGroup variant="flush">
            {selectedAssets.map(assetId => {
              const asset = availableAssets.find(a => a.id === assetId);
              return asset ? (
                <ListGroup.Item key={assetId} className="py-2 px-3">
                  <AssetItem asset={asset} />
                </ListGroup.Item>
              ) : null;
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssetAllocation;