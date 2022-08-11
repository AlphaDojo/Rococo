import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

class RestoreReturnModal extends Component {
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
                        <Modal.Title>Restore Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure to restore this record?</p>
                    </Modal.Body>
                    <Modal.Footer>
						<Form onSubmit = {this.props.restoreSubmit}>
							<Button variant="secondary" onClick={this.handleClose}>
								Close
							</Button>
							&nbsp;
							<Button variant="primary" onClick={this.handleClose} type="submit">
								Restore Record
							</Button>
						</Form>
                    </Modal.Footer>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default RestoreReturnModal;