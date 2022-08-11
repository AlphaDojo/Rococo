import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

class NewItemModal extends Component {


	constructor() {
      super()
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }
    state = {
        show: false,
        name: '',
        desc: '',
        quantity: '',
        supplier: ''
      }



	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
        this.setState({ 
            show: true,
            name: '',
            desc: '',
            quantity: '',
            supplier: ''
         });
	}

    
	render() {
		return (
			<React.Fragment>
				<Button variant={this.props.design} onClick={this.handleShow}>
					{this.props.designName}
                </Button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate onSubmit={this.props.addSubmit}>
                            <Form.Group controlId="itemName">   
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control type="text" name="new_item" onChange={(e) => this.setState({name: e.target.value})} required="required"/>
                            </Form.Group>
                            <Form.Group controlId="newItemDescription">
                                <Form.Label>Item Description</Form.Label>
                                <Form.Control as="textarea" rows="3" name="new_item_description" onChange={(e) => this.setState({desc: e.target.value})} required/>
                            </Form.Group>
                            <Form.Group controlId="newQty">
                                <Form.Label>Number of Specified Item Available</Form.Label>
                                <Form.Control type="number" name="new_inv_quantity" onChange={(e) => this.setState({quantity: e.target.value})} required/>
                            </Form.Group>
                            <Form.Group controlId="newItemSupplier">
                                <Form.Label>Item Supplier/Author</Form.Label>
                                <Form.Control type="text" name="new_supplier" onChange={(e) => this.setState({supplier: e.target.value})} required/>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.handleClose} type="submit" disabled={!this.state.name || !this.state.desc || !this.state.quantity || !this.state.supplier}>
                                Add Item
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default NewItemModal;