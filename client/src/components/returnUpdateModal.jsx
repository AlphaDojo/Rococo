import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

class UpdateReturnModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
            show: false,
            ret_date: '',
            ret_status: '',
            dmg_status: ''
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
    }
    
    getRetStatus = (e) =>{
        this.setState({ret_date: e.target.value})
        if(this.props.returns.return_date_real >= e.target.value){
            this.setState({ret_status: 'On Time'});
        }
        else{
            this.setState({ret_status: 'Late'});
        }
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
                            <Form.Group controlId="new_borrowID">
                                <Form.Label>Borrow ID</Form.Label>
                                <Form.Control type="number" name="new_borrowID" value={this.props.returns.borrowingDetails.id} disabled={true}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Borrow Date</Form.Label>
                                <Form.Control type="text" name="borrow_date" disabled={true} value={this.props.returns.borrowingDetails.borrow_date}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="place_return_date_real">
                                <Form.Label>Actual Return Date</Form.Label>
                                <Form.Control type="text" name="place_return_date_real" value={this.props.returns.return_date_real} disabled={true}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="new_return_date_real">
                                <Form.Label>Updated Return Date</Form.Label>
                                <Form.Control type="date" name="new_return_date_real" onChange={this.getRetStatus}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="new_return_status">
                                <Form.Label>Return Status</Form.Label>
                                <Form.Control type="text" name="new_return_status" placeholder={this.props.returns.return_status} value={this.state.ret_status} onChange={(e) => this.setState({ret_status: e.target.value})} disabled={true}/>
                            </Form.Group>
                            <Form.Group controlId="new_return_dmgstatus">
                                <Form.Label>Item Condition</Form.Label>
                                <Form.Control as="select" name="new_return_dmgstatus" defaultValue="" onChange={(e) => this.setState({dmg_status: e.target.value})}>
                                    <option value="">{this.props.returns.return_dmgstatus} - Default</option>
                                    <option value="Good">Good</option>
                                    <option value="Damaged">Damaged</option>
                                    <option value="Lost/Stolen">Lost/Stolen</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" onClick={this.handleClose} type="submit" disabled={!this.state.ret_date && !this.state.ret_status && !this.state.dmg_status}> 
                                Update Record
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default UpdateReturnModal;