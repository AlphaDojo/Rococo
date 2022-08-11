import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Autocomplete from './Autocomplete';
import inventory from './inventory';

class NewBorrowingModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
            show: false,
            borrower: '',
            item: '',
            borrow_date: '',
            return_date: '',
            inventory: []
		};
	}

	handleClose() {
        this.setState({ show: false });
	}

	handleShow() {
        this.setState({ 
            show: true,
            borrower: '',
            borrow_date: '',
            return_date: ''
         });
         Promise.all([
            axios.get('/item/available')
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
                        <Modal.Title>New Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.props.addSubmit}>
                            <Form.Group controlId="new_borrower_name">
                                <Form.Label>Borrower Name</Form.Label>
                                <Form.Control type="text" name="new_borrower_name" onChange={(e) => this.setState({borrower: e.target.value})}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="new_item_borrowed">
                                <Form.Label>Available Item List (Press Space to see all available items)</Form.Label>
                                <Autocomplete suggestions={this.state.inventory}></Autocomplete>
                            </Form.Group>
                            <Form.Group controlId="new_borrow">
                                <Form.Label>Borrow Date</Form.Label>
                                <Form.Control type="date" name="new_borrow_date" onChange={(e) => this.setState({borrow_date: e.target.value})}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="returnDate">
                                <Form.Label>Return Date</Form.Label>
                                <Form.Control type="date" name="new_return_date" onChange={(e) => this.setState({return_date: e.target.value})}></Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.handleClose} type='submit' disabled={!this.state.borrower || !this.state.borrow_date || !this.state.return_date}>
                                Add Record
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default NewBorrowingModal;