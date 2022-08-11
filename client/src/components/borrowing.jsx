import React, { Component } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import borrowingArchive from './borrowingArchive';
import NewBorrowingModal from './newBorrowingModal';
import UpdateBorrowingModal from './borrowingUpdateModal';
import ArchiveBorrowingModal from './borrowingArchiveModal';
import { withAlert } from 'react-alert';
import Alert from 'react-bootstrap/Alert';
import BorrowingReturnModal from './BorrowingReturnModal';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class Borrowing extends Component {
    
    state = {
        borrowingData: [],
        sortConfig:{
            column: null,
            direction: null,
        },
        search: null
    };

    constructor(){
        super();
    };

    componentDidMount() {
        Promise.all([
            axios.get('/borrowing/main')
        ])
        .then(([borrowingResponse]) => {
            this.setState({borrowingData: borrowingResponse.data});
            console.log(borrowingResponse);
            this.props.alert.success("Data loaded.");
        })
        .catch((error) =>{
            console.log(error.response);
            this.props.alert.error(error.response.status + ' - ' + error.response.statusText)
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.borrowingData !== this.state.borrowingData){
            console.log("State changed.");
        }
    }

    handleAddSubmit = (event) =>{
        event.preventDefault();
        this.props.alert.info("Processing..");
        var nameId;
        var nameInput = event.target.new_borrower_name.value.split(" ");
        var itemInput = event.target.new_item_borrowed.value.split(" - ");
        var borrowInput = event.target.new_borrow_date.value;
        var returnInput = event.target.new_return_date.value;
        var borrow_date = new Date(borrowInput);
        var return_date = new Date(returnInput);
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        if(!itemInput){
            this.props.alert.error('Missing item.');
            return;
        }
        else if(borrow_date > return_date){
            this.props.alert.error('Invalid return date.');
            return;
        }
        else if(!nameInput[1]){
            this.props.alert.error('Missing last name.');
            return;
        }
        else{
        const name = {
            usr_fname: nameInput[0],
            usr_lname: nameInput[1]
        };
        axios.put('/inventory/decrement', {
            id: itemInput[0]
        }, config)
        .catch((error) =>{
            this.props.alert.error("Item out of stock.")
        })
        axios.post('/user/findorcreate', name, config)
        .then(res => {
            console.log(res.data);
            nameId = res.data[0].id;
            console.log(nameId);
        });
        setTimeout(() =>{
            console.log(nameId);
            const borrow = {
                borrow_date: borrowInput,
                return_date: returnInput,
                borrow_status: "Pending",
                userId: nameId,
                employeeI: 1,
                itemId: itemInput[0]
            }
            axios.post(`/borrowing`, borrow, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                Promise.all([
                    axios.get('/borrowing/main')
                ])
                .then(([borrowingResponse]) => {
                    this.setState({borrowingData: borrowingResponse.data});
                    console.log(borrowingResponse);
                    this.props.alert.success('Record Added.');
                })
            })
        }, 1000); 
        }
    }

    handleUpdateSubmit = (event, updateBorrow) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        var newName = event.target.updated_borrower_name.value;
        var updateName;
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        if(newName === ''){
            newName = updateBorrow.userDetails.usr_fname + ' ' + updateBorrow.userDetails.usr_lname;
        }
        var newItem = event.target.updated_item_name.value;
        if(newItem === ''){
            newItem = updateBorrow.itemDetails.id;
        }
        var newDate = event.target.updated_return_date.value;
        if(newDate === ''){
            newDate = updateBorrow.return_date;
        }
        var borrow_date = new Date(updateBorrow.borrow_date);
        var return_date = new Date(newDate);
        if(borrow_date > return_date){
            this.props.alert.error('Invalid return date.');
            return;
        }
        else{
            var nameInput = newName.split(" ");
            const name = {
                usr_fname: nameInput[0],
                usr_lname: nameInput[1]
            };
            axios.post('/user/findorcreate', name, config)
            .then(res => {
                console.log(res.data);
                updateName = res.data[0].id;
                console.log(updateName);
            });
            setTimeout(() =>{
                const borrow = {
                    id: updateBorrow.id,
                    borrow_date: updateBorrow.borrow_date,
                    return_date: newDate,
                    userId: updateName,
                    itemId: newItem,
                }
                console.log(borrow);
                axios.put('/borrowing', borrow, config)
                .then(res => {
                    console.log(res);
                    Promise.all([
                        axios.get('/borrowing/main')
                    ])
                    .then(([borrowingResponse]) => {
                        this.setState({borrowingData: borrowingResponse.data});
                        console.log(borrowingResponse);
                        this.props.alert.success('Record Updated.');
                    })
                })
            }, 1000);
        }
    }

    handleArchiveSubmit = (event, borrowingArchived) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        const arc = {
            id: borrowingArchived.id,
            borrow_status: "Archived"
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
                axios.get('/borrowing/main')
            ])
            .then(([borrowingResponse]) => {
                this.setState({borrowingData: borrowingResponse.data});
                console.log(borrowingResponse);
                this.props.alert.success("Record archived.")
            })
        });
        console.log("Data is archived.")
    }

    handleReturnSubmit = (event, returnBorrow) =>{
        event.preventDefault();
        var arc;
        var borrowInput = event.target.borrow_date.value;
        var borrowIDInput = event.target.borrow_ID.value.split(' - ');
        var actReturn = event.target.return_date_real.value;
        var borrow_date = new Date(borrowInput);
        var act_ret_date = new Date(actReturn);
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        this.props.alert.info("Processing..")
        if(borrow_date > act_ret_date){
            this.props.alert.error('Invalid return date.');
            return;
        }
        else{
            const returnVar = {
                return_date_real: event.target.return_date_real.value,
                return_dmgstatus: event.target.return_dmgstatus.value,
                return_status: event.target.return_status.value,
                borrowingId: borrowIDInput[0]
            }
            if(event.target.return_status.value === 'On Time'){
                arc = {
                    id: borrowIDInput[0],
                    borrow_status: "Returned"
                }
            }
            else{
                arc = {
                    id: borrowIDInput[0],
                    borrow_status: "Overdue"
                }
            }
            axios.put('/borrowing/availability', arc, config);
            if(event.target.return_dmgstatus.value === 'Good'){
                axios.put('/inventory/increment', {
                    id: borrowIDInput[1] //Uses itemId
                }, config)
            }
            axios.post(`/returns`, returnVar, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    Promise.all([
                        axios.get('/borrowing/main')
                    ])
                    .then(([borrowingResponse]) => {
                        this.setState({borrowingData: borrowingResponse.data});
                        console.log(borrowingResponse);
                        this.props.alert.success("Item returned.")
                    })
                })
                .catch((e) =>{
                    console.log(e);
                })
        }
    }

    onSorting = (column) => (event) => {
        const newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.borrowingData.sort((a,b) => {
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
            borrowingData: sortedData,
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
        const dataList = this.state.borrowingData.filter((borrowing) => {
            if(this.state.search == null){
                return borrowing;
            }
            else if(borrowing.userDetails.usr_lname.toLowerCase().includes(this.state.search.toLowerCase()) || borrowing.itemDetails.item_name.toLowerCase().includes(this.state.search.toLowerCase())){
                return borrowing;
            }
        })
        return (  
        <React.Fragment>
            <Row className="p-3">
                <Col sm={6}><h3>Borrowing Records</h3></Col>
                <Col sm={6}>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search by last name or item.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                        <InputGroup.Append>
                                <NewBorrowingModal design='outline-success' designName="New Record" addSubmit={this.handleAddSubmit}></NewBorrowingModal>
                                <Link to='/borrowing/archive'><Button variant="outline-dark" className="ml-1">Archived Records</Button></Link>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
            {dataList.length == 0 &&
                <Alert variant='danger'>No records found!</Alert>
            }
            <div>
                <Table responsive hover>
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
                    <tbody id="BorrowingTable">
                        {dataList.map(borrowingData => (
                            <tr key={borrowingData.id}>
                                <td>{borrowingData.id}</td>
                                <td>{borrowingData.userDetails.usr_lname + ", " + borrowingData.userDetails.usr_fname}</td>
                                <td>{borrowingData.itemDetails.item_name}</td>
                                <td>{new Date(borrowingData.borrow_date).toLocaleDateString()}</td>
                                <td>{new Date(borrowingData.return_date).toLocaleDateString()}</td>
                                <td className={this.getStatusClass(borrowingData.borrow_status)}>{borrowingData.borrow_status}</td>
                                <td>
                                    {(borrowingData.borrow_status === "Pending") &&
                                        <React.Fragment>
                                            <UpdateBorrowingModal designName="Update" design="outline-info" borrowData={borrowingData} updateSubmit={(e) => {this.handleUpdateSubmit(e, borrowingData)}}></UpdateBorrowingModal>
                                            <span> </span>
                                            <BorrowingReturnModal designName="Return" design="outline-secondary" borrowData={borrowingData} returnSubmit={(e) => {this.handleReturnSubmit(e, borrowingData)}}/>
                                        </React.Fragment>
                                    }
                                    {(borrowingData.borrow_status === "Returned" || borrowingData.borrow_status === "Overdue" || borrowingData.borrow_status === "Restored") && 
                                        <ArchiveBorrowingModal designName="Archive" design="outline-danger" archiveSubmit={(e) => {this.handleArchiveSubmit(e, borrowingData)}}></ArchiveBorrowingModal>
                                    }
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Switch>
                <Route path='/borrowing/archive' component={borrowingArchive}/>
            </Switch>
        </React.Fragment>
        );
    }

    getStatusClass(status){
        let classes = "font-weight-bold ";
        switch(status){
            case "Pending":
                classes += "text-warning";
                break;
            case "Returned":
                classes += "text-success";
                break;
            case "Overdue":
                classes += "text-danger";
                break;
            case "Restored":
                classes += "text-info";
                break;     
        }
        return classes;
    }
}
 
export default withAlert()(Borrowing)