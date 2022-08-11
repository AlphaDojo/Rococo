import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

class ArchiveItemModal extends Component {
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
                        <Modal.Title>Archive Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you wish to archive this item?</p>
                    </Modal.Body>
                    <Modal.Footer>
						<Form onSubmit={this.props.archiveSubmit}>
							<Button variant="secondary" onClick={this.handleClose}>
								Close
							</Button>
							&nbsp;
							<Button variant="primary" onClick={this.handleClose} type="submit">
								Archive Item
							</Button>
						</Form>  
                    </Modal.Footer>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default ArchiveItemModal;