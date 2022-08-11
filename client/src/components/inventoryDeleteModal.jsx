import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

class DeleteInventoryModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
			show: false,
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	render() {
		return (
			<React.Fragment>
				<Button variant={this.props.design} onClick={this.handleShow}>
					{this.props.designName}
                </Button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to delete this item? This action cannot be undone!</p>
						<h5 className="text-danger">All records linked to this item will be deleted.</h5>
                    </Modal.Body>
                    <Modal.Footer>
						<Form onSubmit={this.props.deleteSubmit}>
							<Button variant="secondary" onClick={this.handleClose}>
								Close
							</Button>
							&nbsp;
							<Button variant="danger" onClick={this.handleClose} type="submit">
								Delete Item
							</Button>
						</Form>
                    </Modal.Footer>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default DeleteInventoryModal;