import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

class UpdateInventoryModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
            show: false,
            name: this.props.inventory.item_name,
            desc: this.props.inventory.item_description,
            quantity: this.props.inventory.inventoryDetails.inv_quantity,
            supplier: this.props.inventory.supplierDetails.supplier_name,
            avail: this.props.inventory.inv_availability
		};
	}

/*     changeName = (e) => {
        this.setState({name: e.target.value});
        if(!this.state.name){
            this.setState({name: this.props.inventory.item_name});
        }
    }

    changeDesc = (e) => {
        this.setState({desc: e.target.value});
        if(!this.state.desc){
            this.setState({desc: this.props.inventory.item_description});
        }
    }

    changeQuantity = (e) => {
        this.setState({quantity: e.target.value});
        if(!this.state.quantity){
            this.setState({quantity: this.props.inventory.inv_quantity});
        }
    }

    changeSupplier = (e) => {
        this.setState({supplier: e.target.value});
        if(!this.state.supplier){
            this.setState({supplier: this.props.inventory.supplier_name});
        }
    }

    changeAvail = (e) => {
        this.setState({avail: e.target.value});
        if(!this.state.avail){
            this.setState({avail: this.props.inventory.inv_availability});
        }
    }
 */
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
                        <Modal.Title>Update Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.props.updateSubmit}>
                            <Form.Group controlId="itemTitle">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control type="text" name="itemTitle" placeholder={this.props.inventory.item_name} ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="itemAuth">
                                <Form.Label>Item Supplier/Author</Form.Label>
                                <Form.Control type="text" name="itemAuth" placeholder={this.props.inventory.supplierDetails.supplier_name}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="itemQuantity">
                                <Form.Label>Number of Specified Item Available</Form.Label>
                                <Form.Control type="number" name="itemQuantity" placeholder={this.props.inventory.inventoryDetails.inv_quantity}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="itemAvailability">
                                <Form.Label>Item Status</Form.Label>
                                <Form.Control as="select" name="itemAvailability" placeholder={this.props.inventory.inventoryDetails.inv_availability} disabled={true}>
                                    <option value="OK">Ok</option>
                                    <option value="Damaged/Lost">Damaged/Lost</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="itemDesc">
                                <Form.Label>Item Description</Form.Label>
                                <Form.Control as="textarea" rows="3" name="itemDesc" placeholder={this.props.inventory.item_description}></Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.handleClose} type="submit">
                                Update Item
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default UpdateInventoryModal;