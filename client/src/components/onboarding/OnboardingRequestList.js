import React, { useState } from 'react';
import { Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const OnboardingRequestList = ({ requests, onSelectRequest, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.employee?.fullName?.toLowerCase().includes(searchLower) ||
        request.college?.toLowerCase().includes(searchLower) ||
        request.currentStage?.toLowerCase().includes(searchLower) ||
        request.status?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt' || sortField === 'dueDate') {
        comparison = new Date(a[sortField]) - new Date(b[sortField]);
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: '300px' }}>
          <Form.Control
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text>
            <i className="fas fa-search"></i>
          </InputGroup.Text>
        </InputGroup>
      </div>

      <Table responsive hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('employee.fullName')} style={{ cursor: 'pointer' }}>
              Employee Name {sortField === 'employee.fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('college')} style={{ cursor: 'pointer' }}>
              College {sortField === 'college' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('currentStage')} style={{ cursor: 'pointer' }}>
              Current Stage {sortField === 'currentStage' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
              Created Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>
              Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRequests.map(request => (
            <tr key={request.id}>
              <td>{request.employee?.fullName}</td>
              <td>{request.college}</td>
              <td>{getStageBadge(request.currentStage)}</td>
              <td>{getStatusBadge(request.status)}</td>
              <td>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</td>
              <td>{request.dueDate ? format(new Date(request.dueDate), 'MMM dd, yyyy') : '-'}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onSelectRequest(request)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
          {filteredAndSortedRequests.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OnboardingRequestList; 