import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import axios from 'axios';

class UpdateBorrowingModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
            show: false,
            inventory: [],
            borrower: '',
            item: '',
            return_date: ''
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
        this.setState({ show: true });
        Promise.all([
            axios.get('/item/main')
        ])
        .then(([itemResponse]) => {
            this.setState({inventory: itemResponse.data});
        })
	}

	render() {
		return (
			<React.Fragment>
				<Button variant={this.props.design} onClick={this.handleShow}>
					{this.props.designName}
                </Button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.props.updateSubmit}>
                            <Form.Group controlId="updated_borrower_name">
                                <Form.Label>Borrower Name</Form.Label>
                                <Form.Control type="text" placeholder={this.props.borrowData.userDetails.usr_fname + ' ' + this.props.borrowData.userDetails.usr_lname } name="updated_borrower_name" disabled={true}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="updated_item_name">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control type="text" name="updated_item_name" placeholder={this.props.borrowData.itemDetails.item_name} disabled={true}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Borrow Date</Form.Label>
                                <Form.Control type="text" disabled={true} placeholder={this.props.borrowData.borrow_date}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="updated_return_date">
                                <Form.Label>New Return Date</Form.Label>
                                <Form.Control type="date" name="updated_return_date" onChange={(e) => this.setState({return_date: e.target.value})} disabled={this.props.borrowData.borrow_status === "Returned"}></Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.handleClose} type="submit" disabled={!this.state.borrower && !this.state.item && !this.state.return_date}>
                                Update Record
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default UpdateBorrowingModal;