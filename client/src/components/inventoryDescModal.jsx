import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class InventoryDescModal extends Component {
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
                        <Modal.Title>Item Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.itemDescription}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default InventoryDescModal;