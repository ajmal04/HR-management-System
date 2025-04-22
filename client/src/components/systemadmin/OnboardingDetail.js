import React, { useState, useEffect } from 'react';
import { 
  Card, Alert, Spinner, Tab, Tabs, 
  Badge, ListGroup, Button, Modal 
} from 'react-bootstrap';
import axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';
import moment from 'moment';

const OnboardingDetail = ({ onBack }) => {
  const { id } = useParams();
  const [request, setRequest] = useState({
    status: 'pending',
    requestDate: new Date(),
    employee: {},
    requestedByUser: {},
    userId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [redirectToAssetAllocation, setRedirectToAssetAllocation] = useState(false);
  const [redirectToList, setRedirectToList] = useState(false);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(`/api/onboarding/requests/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Get the first request from the requests array
      const requestData = Array.isArray(res.data.requests) ? res.data.requests[0] : res.data;
      
      // Ensure critical fields exist and normalize the data structure
      const responseData = {
        status: requestData.status || 'pending',
        requestDate: requestData.requestDate || new Date(),
        employee: {
          ...requestData.employee,
          fullName: requestData.employee?.fullName || 'N/A',
          department: requestData.employee?.department || {}
        },
        requester: {
          ...requestData.requester,
          fullName: requestData.requester?.fullName || 'System'
        },
        userId: requestData.userId || '',
        ...requestData
      };
      
      setRequest(responseData);
      setError(null);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError(err.response?.data?.message || 'Failed to load request details');
      setRequest({
        status: 'error',
        requestDate: new Date(),
        employee: { fullName: 'Error loading data' },
        requester: { fullName: 'System' },
        userId: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.patch(`/api/onboarding/requests/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchRequest(); // Refresh data
      setShowCompleteModal(false);
    } catch (err) {
      console.error('Error completing request:', err);
      setError(err.response?.data?.message || 'Failed to complete request');
    }
  };

  const onAssignAssets = (e) => {
    e.preventDefault();
    if (request.userId) {
      setRedirectToAssetAllocation(true);
    } else {
      setError('Cannot assign assets - missing user ID');
    }
  };

  const onBackToList = (e) => {
    e.preventDefault();
    setRedirectToList(true);
  };

  useEffect(() => { 
    fetchRequest(); 
  }, [id]);

  if (redirectToAssetAllocation) {
    return <Redirect to={`/asset-allocation/${request.userId}`} />;
  }

  if (redirectToList) {
    return <Redirect to="/onboarding" />;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
        <span className="ms-2">Loading request details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3" onClose={() => setError(null)} dismissible>
        {error}
        <div className="mt-2">
          <Button variant="outline-primary" size="sm" onClick={fetchRequest}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="container-fluid pt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Onboarding Details</h4>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={onBackToList}
          >
            Back to List
          </Button>
        </Card.Header>

        <Card.Body>
          <div className="mb-3">
            <Badge pill bg={request.status === 'completed' ? 'success' : 'warning'}>
              {(request.status || 'pending').toUpperCase()}
            </Badge>
            <span className="text-muted ms-2">
              Requested {moment(request.requestDate).fromNow()}
            </span>
          </div>

          <Tabs defaultActiveKey="details" className="mb-4">
            <Tab eventKey="details" title="Basic Info">
              <div className="row mt-3">
                <div className="col-md-6">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Employee:</strong> {request.employee?.fullName || 'N/A'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Requested By:</strong> {request.requester?.fullName || 'System'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Request Date:</strong> {moment(request.requestDate).format('LLL')}
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                <div className="col-md-6">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Department:</strong> {request.employee?.department?.departmentName || 'N/A'}
                    </ListGroup.Item>
                    {request.completedByUser && (
                      <ListGroup.Item>
                        <strong>Completed By:</strong> {request.completedByUser.full_name}
                      </ListGroup.Item>
                    )}
                    {request.completionDate && (
                      <ListGroup.Item>
                        <strong>Completion Date:</strong> {moment(request.completionDate).format('LLL')}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </div>
            </Tab>

            <Tab eventKey="assets" title="Assigned Assets">
              {request.userId ? (
                <AssetList userId={request.userId} />
              ) : (
                <Alert variant="warning">No user ID available to load assets</Alert>
              )}
            </Tab>
          </Tabs>

          {request.status === 'pending' && (
            <div className="d-flex justify-content-end">
              <Button 
                variant="info" 
                className="me-2" 
                size="sm"
                onClick={onAssignAssets}
                disabled={!request.userId}
              >
                Assign Assets
              </Button>
              <Button 
                variant="success" 
                size="sm"
                onClick={() => setShowCompleteModal(true)}
              >
                Mark Complete
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this onboarding as complete?
          <div className="mt-3">
            <strong>Employee:</strong> {request.employee?.full_name || 'Unknown employee'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowCompleteModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleComplete}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AssetList = ({ userId }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`/api/assets/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setAssets(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load assets');
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAssets();
    }
  }, [userId]);

  if (!userId) return <Alert variant="danger">Invalid user ID</Alert>;
  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <ListGroup variant="flush">
      {assets.length > 0 ? (
        assets.map(asset => (
          <ListGroup.Item key={asset.id}>
            <div className="d-flex justify-content-between">
              <div>
                <strong>{asset.assetName}</strong> ({asset.assetType})
                {asset.assetSerialNumber && (
                  <div className="text-muted small">Serial: {asset.assetSerialNumber}</div>
                )}
              </div>
              <Badge pill bg={asset.status === 'active' ? 'success' : 'secondary'}>
                {asset.status}
              </Badge>
            </div>
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item className="text-center text-muted">
          No assets assigned yet
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default OnboardingDetail;