import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

class ReturnBorrowingInfo extends Component {
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
                        <Modal.Title>Record Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive hover bordered>
                            <tbody>
                                <tr>
                                    <td className="font-weight-bold">ID</td>
                                    <td>{this.props.borrow.id}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Borrow Date</td>
                                    <td>{this.props.borrow.borrow_date}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Return Date</td>
                                    <td>{this.props.borrow.return_date}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold">Borrower</td>
                                    <td>{this.props.borrow.userDetails.usr_fname + " " + this.props.borrow.userDetails.usr_lname}</td>
                                </tr>
                            </tbody>
                        </Table>
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

export default ReturnBorrowingInfo;