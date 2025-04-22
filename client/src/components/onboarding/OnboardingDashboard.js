import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import OnboardingRequestList from './OnboardingRequestList';
import OnboardingRequestDetail from './OnboardingRequestDetail';
import OnboardingStageProgress from './OnboardingStageProgress';
import DocumentUpload from './DocumentUpload';

const OnboardingDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [userRole, setUserRole] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }

    // Fetch onboarding requests
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/onboarding/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(response.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load onboarding requests. Please try again later.');
      setLoading(false);
    }
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    setActiveTab('details');
  };

  const handleRequestUpdate = () => {
    fetchRequests();
    if (selectedRequest) {
      // Refresh the selected request
      const updatedRequest = requests.find(r => r.id === selectedRequest.id);
      setSelectedRequest(updatedRequest);
    }
  };

  const getRoleSpecificView = () => {
    switch (userRole) {
      case 'ROLE_SUPER_ADMIN':
        return (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="requests" title="All Requests">
              <OnboardingRequestList 
                requests={requests} 
                onSelectRequest={handleRequestSelect}
                userRole={userRole}
              />
            </Tab>
            <Tab eventKey="details" title="Request Details" disabled={!selectedRequest}>
              {selectedRequest && (
                <OnboardingRequestDetail 
                  request={selectedRequest} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              )}
            </Tab>
            <Tab eventKey="documents" title="Documents" disabled={!selectedRequest}>
              {selectedRequest && (
                <DocumentUpload 
                  requestId={selectedRequest.id} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              )}
            </Tab>
          </Tabs>
        );
      case 'ROLE_SYSTEM_ADMIN':
        return (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="requests" title="IT Setup Requests">
              <OnboardingRequestList 
                requests={requests.filter(r => r.currentStage === 'IT_SETUP')} 
                onSelectRequest={handleRequestSelect}
                userRole={userRole}
              />
            </Tab>
            <Tab eventKey="details" title="Request Details" disabled={!selectedRequest}>
              {selectedRequest && (
                <OnboardingRequestDetail 
                  request={selectedRequest} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              )}
            </Tab>
          </Tabs>
        );
      case 'ROLE_ADMIN':
        return (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="requests" title="Approval Requests">
              <OnboardingRequestList 
                requests={requests.filter(r => r.currentStage === 'PRINCIPAL_APPROVAL')} 
                onSelectRequest={handleRequestSelect}
                userRole={userRole}
              />
            </Tab>
            <Tab eventKey="details" title="Request Details" disabled={!selectedRequest}>
              {selectedRequest && (
                <OnboardingRequestDetail 
                  request={selectedRequest} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              )}
            </Tab>
          </Tabs>
        );
      case 'ROLE_HOD':
        return (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="requests" title="Department Requests">
              <OnboardingRequestList 
                requests={requests.filter(r => r.currentStage === 'HOD_REVIEW')} 
                onSelectRequest={handleRequestSelect}
                userRole={userRole}
              />
            </Tab>
            <Tab eventKey="details" title="Request Details" disabled={!selectedRequest}>
              {selectedRequest && (
                <OnboardingRequestDetail 
                  request={selectedRequest} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              )}
            </Tab>
          </Tabs>
        );
      case 'ROLE_FACULTY':
        return (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="myRequest" title="My Onboarding">
              {requests.find(r => r.userId === JSON.parse(localStorage.getItem('user')).id) ? (
                <OnboardingRequestDetail 
                  request={requests.find(r => r.userId === JSON.parse(localStorage.getItem('user')).id)} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              ) : (
                <Alert variant="info">You don't have an active onboarding request.</Alert>
              )}
            </Tab>
            <Tab eventKey="documents" title="My Documents">
              {requests.find(r => r.userId === JSON.parse(localStorage.getItem('user')).id) ? (
                <DocumentUpload 
                  requestId={requests.find(r => r.userId === JSON.parse(localStorage.getItem('user')).id).id} 
                  onUpdate={handleRequestUpdate}
                  userRole={userRole}
                />
              ) : (
                <Alert variant="info">You don't have an active onboarding request.</Alert>
              )}
            </Tab>
          </Tabs>
        );
      default:
        return <Alert variant="warning">You don't have permission to access the onboarding system.</Alert>;
    }
  };

  return (
    <Container fluid className="pt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Onboarding Dashboard</h4>
                {userRole === 'ROLE_SUPER_ADMIN' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => history.push('/employee-add')}
                  >
                    <i className="fas fa-plus mr-2"></i> Add New Employee
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading onboarding data...</p>
                </div>
              ) : (
                getRoleSpecificView()
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OnboardingDashboard; 