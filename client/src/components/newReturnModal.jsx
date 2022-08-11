import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import AutocompleteReturn from './AutocompleteReturn';

class NewReturnModal extends Component {
	constructor(props) {
		super(props);

        
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
        this.getDate = this.getDate.bind(this);

		this.state = {
            show: false,
            borrowing: [],
            id: '',
            ret_date: '',
            ret_status: '',
            dmg_status: '',
            borrow_date: '',
            hasData: false
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
        this.setState({ 
            show: true,
            id: '',
            ret_date: '',
            ret_status: '',
            dmg_status: '',
            borrow_date: '',
            supposed_ret_date: '',
            hasData: false,
        });
        Promise.all([
            axios.get('/borrowing/pending')
        ])
        .then(([borrowingResponse]) => {
            this.setState({borrowing: borrowingResponse.data});
            console.log(borrowingResponse);
        })
	}

    getDate(e){
        console.log(e);
        if(e !== ''){
            this.setState({
                hasData: true
            })
        }
        const filteredDat = this.state.borrowing.filter((borrow) => {
            if(borrow.id == e){
                return borrow;
            }
        })
        this.setState({
            id: e,
            borrow_date: filteredDat[0].borrow_date,
            supposed_ret_date: filteredDat[0].return_date
        });
    }

    getRetStatus = (e) =>{
        this.setState({ret_date: e.target.value})
        if(this.state.borrow_date > e.target.value){
            this.setState({ret_status: 'Invalid'})
        }
        else if(this.state.supposed_ret_date >= e.target.value){
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
                        <Modal.Title>New Record</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.props.addSubmit}>
                            <Form.Group controlId="borrow_ID">
                                <Form.Label>Borrow Record (Press Space to see all pending records)</Form.Label>
                                <AutocompleteReturn suggestions={this.state.borrowing} getDate={this.getDate}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Borrow Date</Form.Label>
                                <Form.Control type="text" name="borrow_date" disabled={true} value={this.state.borrow_date}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Recorded Return Date</Form.Label>
                                <Form.Control type="text" name="supposed_return_date" disabled={true} value={this.state.supposed_ret_date}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="return_date_real">
                                <Form.Label>Actual Return Date</Form.Label>
                                <Form.Control type="date" name="return_date_real" onChange={this.getRetStatus} disabled={!this.state.hasData}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="return_status">
                                <Form.Label>Return Status</Form.Label>
                                <Form.Control type="text" name="return_status" value={this.state.ret_status}  disabled={true}/>
                            </Form.Group>
                            <Form.Group controlId="return_dmgstatus">
                                <Form.Label>Item Condition</Form.Label>
                                <Form.Control as="select" name="return_dmgstatus" onChange={(e) => this.setState({dmg_status: e.target.value})} disabled={!this.state.hasData}>
                                    <option value=""></option>
                                    <option value="Good">Good</option>
                                    <option value="Damaged">Damaged</option>
                                    <option value="Lost/Stolen">Lost/Stolen</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            &nbsp;
                            <Button variant="primary" type="submit" onClick={this.handleClose} disabled={!this.state.id || !this.state.ret_date || this.state.ret_status === 'Invalid' || !this.state.dmg_status}>
                                Add Record
                            </Button>
                        </Form>
                    </Modal.Body>
				</Modal>
            </React.Fragment>
		);
    }
    
}

export default NewReturnModal;