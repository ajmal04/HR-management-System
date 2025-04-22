import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import axios from 'axios';

const OnboardingRequestDetail = ({ requestId, request: initialRequest, onUpdate, userRole }) => {
  const [request, setRequest] = useState(initialRequest || null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(!initialRequest);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialRequest) {
      setRequest(initialRequest);
      setLoading(false);
      return;
    }

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/onboarding/requests/${requestId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch request details');
        }
        const data = await response.json();
        console.log('Onboarding request data:', data);
        setRequest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, initialRequest]);

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'in_progress': 'info',
      'completed': 'success',
      'rejected': 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const getStageBadge = (stage) => {
    const stageColors = {
      'HR_VERIFIED': 'primary',
      'IT_SETUP': 'info',
      'HOD_REVIEW': 'warning',
      'PRINCIPAL_APPROVAL': 'danger',
      'COMPLETED': 'success'
    };
    return <Badge bg={stageColors[stage] || 'secondary'}>{stage.replace(/_/g, ' ')}</Badge>;
  };

  const handleStageTransition = async (action) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/onboarding/requests/${request.id}/transition`, {
        action,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      onUpdate(response.data);
      setShowCommentModal(false);
      setComment('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update request. Please try again.';
      setError(errorMessage);
      console.error('Error updating request:', err);
    } finally {
      setLoading(false);
    }
  };

  const canTransition = () => {
    const rolePermissions = {
      'ROLE_HR_ADMIN': ['HR_VERIFIED'],
      'ROLE_IT_ADMIN': ['IT_SETUP'],
      'ROLE_HOD': ['HOD_REVIEW'],
      'ROLE_PRINCIPAL': ['PRINCIPAL_APPROVAL']
    };

    return rolePermissions[userRole]?.includes(request.currentStage);
  };

  if (!request) {
    return (
      <div className="alert alert-info">
        No request selected. Please select a request from the list.
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Request Details</h5>
          <div>
            <Badge bg="secondary" className="me-2">ID: {request.id}</Badge>
            {getStatusBadge(request.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Employee Information</h6>
              <p><strong>Name:</strong> {request.employee?.fullName}</p>
              <p><strong>Role:</strong> {request.employee?.role?.replace('ROLE_', '').replace(/_/g, ' ') || 'N/A'}</p>
              <p><strong>Department:</strong> {request.department?.departmentName || 'N/A'}</p>
              <p><strong>College:</strong> {request.college?.replace(/_/g, ' ') || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h6>Request Information</h6>
              <p><strong>Current Stage:</strong> {getStageBadge(request.currentStage)}</p>
              <p><strong>Created Date:</strong> {format(new Date(request.createdAt), 'MMM dd, yyyy')}</p>
              <p><strong>Due Date:</strong> {request.dueDate ? format(new Date(request.dueDate), 'MMM dd, yyyy') : '-'}</p>
            </Col>
          </Row>

          {request.comments && request.comments.length > 0 && (
            <div className="mt-4">
              <h6>Comments</h6>
              <div className="border rounded p-3">
                {request.comments.map((comment, index) => (
                  <div key={index} className="mb-2">
                    <small className="text-muted">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')} - {comment.user?.fullName}
                    </small>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canTransition() && (
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => setShowCommentModal(true)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Approve & Move to Next Stage'}
              </Button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                disabled={loading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCommentModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleStageTransition('approve')}
            disabled={loading || !comment.trim()}
          >
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OnboardingRequestDetail; 