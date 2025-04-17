import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeleteConfirmationModal = ({ 
    show, 
    onHide, 
    onConfirm, 
    isProcessing, 
    itemName 
}) => {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isProcessing}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={isProcessing}>
                    {isProcessing ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span className="ml-2">Deleting...</span>
                        </>
                    ) : 'Delete'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DeleteConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool,
    itemName: PropTypes.string
};

DeleteConfirmationModal.defaultProps = {
    isProcessing: false,
    itemName: 'this item'
};

export default DeleteConfirmationModal;