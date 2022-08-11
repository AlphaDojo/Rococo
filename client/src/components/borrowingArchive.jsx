import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import RestoreBorrowingModal from './borrowingRestoreModal';
import DeleteBorrowingModal from './borrowingDeleteModal';
import axios from 'axios';
import { withAlert } from 'react-alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  } from "react-router-dom";

class borrowingArchive extends Component {
    state = {
        /*borrowingArchivedData:[
            {id: 1, borrowingId: 12, borrower: "Villar Luarez, J.", item:"Oregairu Volume 1", borrowDate:"11-22-2019", returnDate:"11-29-2019", borrowStatus:"Archived"},
        ],*/
        borrowingArchivedData: [],
        sortConfig:{
            column: null,
            direction: null,
        },
        search: null
    };

    constructor() {
        super();
    }

    componentDidMount() {
        Promise.all([
            axios.get('/borrowing/archived')
        ])
        .then(([borrowingResponse]) => {
            this.setState({borrowingArchivedData: borrowingResponse.data});
            console.log(borrowingResponse);
            this.props.alert.success("Data loaded.");
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.inventory !== this.state.inventory){
            console.log("State changed.");
        }
    }

    handleRestoreSubmit = (event, restoreRow) => {
        event.preventDefault();
        const arc = {
            id: restoreRow.id,
            borrow_status: "Restored"
        }
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        axios.put('/borrowing/availability', arc, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            Promise.all([
                axios.get('/borrowing/archived')
            ])
            .then(([borrowingResponse]) => {
                this.setState({borrowingArchivedData: borrowingResponse.data});
                console.log(borrowingResponse);
                this.props.alert.success("Record restored.");
            })
        });
    }

    handleDeleteSubmit = (event, deleteRow) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        axios.delete('/borrowing/' + deleteRow.id, config)
        .then(response => {
            console.log(response);
            Promise.all([
                axios.get('/borrowing/archived')
            ])
            .then(([borrowingResponse]) => {
                this.setState({borrowingArchivedData: borrowingResponse.data});
                console.log(borrowingResponse);
                this.props.alert.success("Record deleted.");
            })
        });
    }
    
    onSorting = (column) => (event) => {
        const newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.borrowingArchivedData.sort((a,b) => {
            if(column === 'userDetails.usr_lname'){
                if(a['userDetails']['usr_lname'] < b['userDetails']['usr_lname']){
                    return -1;
                }
                if (a['userDetails']['usr_lname'] > b['userDetails']['usr_lname']){
                    return 1;
                }
                return 0;
            }
            if(column === 'itemDetails.item_name'){
                if(a['itemDetails']['item_name'] < b['itemDetails']['item_name']){
                    return -1;
                }
                if (a['itemDetails']['item_name'] > b['itemDetails']['item_name']){
                    return 1;
                }
                return 0;
            }
            if(a[column] < b[column]){
                return -1;
            }
            if (a[column] > b[column]){
                return 1;
            }
            return 0;
        });
        if(newDirection === 'desc'){
            sortedData.reverse();
        }
        this.setState({
            borrowingArchivedData: sortedData,
            sortConfig:{
               column: column, 
               direction: newDirection
            }
        })
    }

    getDirection(colName){
        let directionArrow = String.fromCharCode(160);
        if(this.state.sortConfig.column === colName){
            switch(this.state.sortConfig.direction){
                case 'asc':
                    directionArrow = String.fromCharCode(9650);
                    break;
                case 'desc':
                    directionArrow = String.fromCharCode(9660);
                    break;
                default:
                    break;
            }
        }
        return directionArrow;
    }

    searchTerm = (event) =>{
        let searchWord = event.target.value;
        this.setState({
            search: searchWord
        });
    }
    
    render() {
        const dataList = this.state.borrowingArchivedData.filter((borrowing) => {
            if(this.state.search == null){
                return borrowing;
            }
            else if(borrowing.borrowingArchivedData.userDetails.usr_lname.toLowerCase().includes(this.state.search.toLowerCase()) || borrowing.borrowingArchivedData.itemDetails.item_name.toLowerCase().includes(this.state.search.toLowerCase())){
                return borrowing;
            }
        })

        return (
            <React.Fragment>
                <Row className="p-3">
                    <Col sm={6}><h3>Borrowing Records / Archive</h3></Col>
                    <Col sm={6}>
                        <InputGroup>
                            <Form.Control type="text" placeholder="Search by borrower or item.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                            <InputGroup.Append>
                                    <Link to='/borrowing/'><Button variant="outline-dark" >Unarchived Records</Button></Link>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <div>
                    <Table>
                        <thead className="thead-light">
                        <tr>
                            <th>
                                <Button variant="link" onClick={this.onSorting('id')} className="font-weight-bold text-dark">
                                    ID
                                    &nbsp;
                                    {this.getDirection('id')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('userDetails.usr_lname')} className="font-weight-bold text-dark">
                                    Borrower
                                    &nbsp;
                                    {this.getDirection('userDetails.usr_lname')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('itemDetails.item_name')} className="font-weight-bold text-dark">
                                    Item Name
                                    &nbsp;
                                    {this.getDirection('itemDetails.item_name')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('borrow_date')} className="font-weight-bold text-dark">
                                    Borrow Date
                                    &nbsp;
                                    {this.getDirection('borrow_date')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('return_date')} className="font-weight-bold text-dark">
                                    Return Date
                                    &nbsp;
                                    {this.getDirection('return_date')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" className="font-weight-bold text-dark">
                                    Status
                                    &nbsp;
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" className="font-weight-bold text-dark">Options</Button>
                            </th>
                        </tr>
                        </thead>
                        <tbody id="BorrowingArchiveTable">
                            {dataList.map(borrowingArchivedData => (
                                <tr key={borrowingArchivedData.id}>
                                    <td>{borrowingArchivedData.id}</td>
                                    <td>{borrowingArchivedData.userDetails.usr_lname + ", " + borrowingArchivedData.userDetails.usr_fname}</td>
                                    <td>{borrowingArchivedData.itemDetails.item_name}</td>
                                    <td>{new Date(borrowingArchivedData.borrow_date).toLocaleDateString()}</td>
                                    <td>{new Date(borrowingArchivedData.return_date).toLocaleDateString()}</td>
                                    <td className="text-danger font-weight-bold ">{borrowingArchivedData.borrow_status}</td>
                                    <td>
                                        <RestoreBorrowingModal design="outline-success" designName="Restore" restoreSubmit={(e) => {this.handleRestoreSubmit(e, borrowingArchivedData)}}></RestoreBorrowingModal>
                                        &nbsp;
                                        &nbsp;
                                        <DeleteBorrowingModal design="outline-danger" designName="Delete" deleteSubmit={(e) => {this.handleDeleteSubmit(e, borrowingArchivedData)}}/>
                                    </td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}
 
export default withAlert()(borrowingArchive);