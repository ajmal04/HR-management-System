import React from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';

const OnboardingStageProgress = ({ request }) => {
  const stages = [
    { id: 'HR_VERIFIED', label: 'HR Verification', color: 'primary' },
    { id: 'IT_SETUP', label: 'IT Setup', color: 'info' },
    { id: 'HOD_REVIEW', label: 'HOD Review', color: 'warning' },
    { id: 'PRINCIPAL_APPROVAL', label: 'Principal Approval', color: 'danger' },
    { id: 'COMPLETED', label: 'Completed', color: 'success' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === request.currentStage);
  };

  const calculateProgress = () => {
    const currentIndex = getCurrentStageIndex();
    if (currentIndex === -1) return 0;
    
    // Calculate progress based on current stage
    // Each stage represents 25% of the total progress
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getStageStatus = (stageId) => {
    const currentIndex = getCurrentStageIndex();
    const stageIndex = stages.findIndex(stage => stage.id === stageId);
    
    if (stageIndex < currentIndex) {
      return 'completed';
    } else if (stageIndex === currentIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Onboarding Progress</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <ProgressBar 
            now={calculateProgress()} 
            variant="success" 
            className="mb-2"
            style={{ height: '10px' }}
          />
          <div className="d-flex justify-content-between">
            <small className="text-muted">Started</small>
            <small className="text-muted">{Math.round(calculateProgress())}% Complete</small>
          </div>
        </div>

        <div className="d-flex justify-content-between position-relative">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            return (
              <div 
                key={stage.id} 
                className="text-center"
                style={{ 
                  flex: 1,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: status === 'completed' 
                      ? 'var(--bs-success)' 
                      : status === 'current' 
                        ? `var(--bs-${stage.color})` 
                        : 'var(--bs-light)',
                    color: status === 'pending' ? 'var(--bs-gray)' : 'white',
                    border: status === 'pending' ? '2px solid var(--bs-gray)' : 'none'
                  }}
                >
                  {index + 1}
                </div>
                <div className="small">
                  <Badge 
                    bg={status === 'completed' 
                      ? 'success' 
                      : status === 'current' 
                        ? stage.color 
                        : 'secondary'}
                  >
                    {stage.label}
                  </Badge>
                </div>
              </div>
            );
          })}
          
          {/* Progress line */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px', 
              right: '20px', 
              height: '2px', 
              backgroundColor: 'var(--bs-gray-300)',
              zIndex: 0
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default OnboardingStageProgress; 