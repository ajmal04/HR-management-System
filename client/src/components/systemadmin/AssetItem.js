import React from 'react';
import { Badge } from 'react-bootstrap';

const AssetItem = ({ asset }) => (
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <strong>{asset.assetName}</strong>
      <div className="text-muted small">
        {asset.assetType} • {asset.assetSerialNumber || 'No serial'}
      </div>
    </div>
    <Badge bg={asset.status === 'active' ? 'success' : 'secondary'}>
      {asset.status}
    </Badge>
  </div>
);

export default AssetItem;