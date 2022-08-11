import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import NewReturnModal from './newReturnModal';
import returnArchive from './returnArchive';
import UpdateReturnModal from './returnUpdateModal';
import ArchiveReturnModal from './returnArchiveModal';
import ReturnBorrowingInfo from './returnBorrowingInfo';
import axios from 'axios';
import { withAlert } from 'react-alert';
import Alert from 'react-bootstrap/Alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Returns extends Component {
    state = {
        returnData: [],
        sortConfig:{
            column: null,
            direction: null,
        },
        search: null
    }

    constructor() {
        super();
    }

    componentDidMount() {
        Promise.all([
            axios.get('/returns/main')
        ])
        .then(([returnResponse]) => {
            this.setState({returnData: returnResponse.data});
            console.log(returnResponse);
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
        this.props.alert.info("Processing..");
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
            if(event.target.return_dmgstatus.value === 'Good'){
                axios.put('/inventory/increment', {
                    id: borrowIDInput[1] //Uses itemId
                }, config)
            }
            axios.put('/borrowing/availability', arc, config);
            axios.post(`/returns`, returnVar, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    Promise.all([
                        axios.get('/returns/main')
                    ])
                    .then(([returnResponse]) => {
                        this.setState({returnData: returnResponse.data});
                        console.log(returnResponse);
                        this.props.alert.success("Record added.")
                    })
                })
                .catch((e) =>{
                    console.log(e);
                })
        }
    }

    handleUpdateSubmit = (event, updateInfo) => {
        event.preventDefault();
        var borrow_date = updateInfo.borrowingDetails.borrow_date;
        var new_ret_date = event.target.new_return_date_real.value;
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        if(new_ret_date === ''){
            new_ret_date = updateInfo.return_date_real;
        }
        var new_ret_stat = event.target.new_return_status.value;
        var new_dmg_stat = event.target.new_return_dmgstatus.value;
        var compare_borrow_date = new Date(borrow_date);
        var compare_ret_date = new Date(new_ret_date);
        this.props.alert.info("Processing..");
        if(compare_borrow_date > compare_ret_date){
            this.props.alert.error('Invalid return date.');
            return;
        }
        else{
            if(new_ret_stat === ''){
                new_ret_stat = updateInfo.return_status;
            }
            if(new_dmg_stat === ''){
                new_dmg_stat = updateInfo.return_dmgstatus;
            }
            const returnVar = {
                id: updateInfo.id,
                return_date_real: new_ret_date,
                return_dmgstatus: new_dmg_stat,
                return_status: new_ret_stat,
                borrowingId: event.target.new_borrowID.value
            }
            axios.put(`/returns`, returnVar, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    Promise.all([
                        axios.get('/returns/main')
                    ])
                    .then(([returnResponse]) => {
                        this.setState({returnData: returnResponse.data});
                        console.log(returnResponse);
                        this.props.alert.success("Record updated.");
                    })
                })
            console.log("Data is updated.");
        }
    }

    handleArchiveSubmit = (event, retArchive) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        const arc = {
            id: retArchive.id,
            return_status: "archived"
        }
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        axios.put('/returns/availability', arc, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            Promise.all([
                axios.get('/returns/main')
            ])
            .then(([returnResponse]) => {
                this.setState({returnData: returnResponse.data});
                console.log(returnResponse);
                this.props.alert.success("Record archived.")
            })
        });
        console.log("Data is archived.")
    }

    onSorting = (column) => (event) => {
        const newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.returnData.sort((a,b) => {
            if(column === 'borrowingDetails.itemDetails.item_name'){
                if(a['borrowingDetails']['itemDetails']['item_name'] < b['borrowingDetails']['itemDetails']['item_name']){
                    return -1;
                }
                if (a['borrowingDetails']['itemDetails']['item_name'] > b['borrowingDetails']['itemDetails']['item_name']){
                    return 1;
                }
                return 0;
            }
            if(column === 'borrowingDetails.userDetails.usr_lname'){
                if(a['borrowingDetails']['userDetails']['usr_lname'] < b['borrowingDetails']['userDetails']['usr_lname']){
                    return -1;
                }
                if (a['borrowingDetails']['userDetails']['usr_lname'] > b['borrowingDetails']['userDetails']['usr_lname']){
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
            returnData: sortedData,
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
        const dataList = this.state.returnData.filter((returns) => {
            if(this.state.search == null){
                return returns;
            }
            else if(returns.borrowingDetails.itemDetails.item_name.toLowerCase().includes(this.state.search.toLowerCase()) || returns.borrowingDetails.userDetails.usr_lname.toLowerCase().includes(this.state.search.toLowerCase())){
                return returns;
            }
        })
        return (  
            <React.Fragment>
            <Row className="p-3">
                <Col sm={6}><h3>Return Records</h3></Col>
                <Col sm={6}>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search by item or last name.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                        <InputGroup.Append>
                                <NewReturnModal design='outline-success' designName="New Record" addSubmit={this.handleAddSubmit}></NewReturnModal>
                                <Link to='/returns/archive'><Button variant="outline-dark" className="ml-1">Archived Records</Button></Link>
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
                            <Button variant="link" onClick={this.onSorting('borrowingDetails.itemDetails.item_name')} className="font-weight-bold text-dark">
                                Borrowed Item 
                                &nbsp;
                                {this.getDirection('borrowingDetails.itemDetails.item_name')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" className="font-weight-bold text-dark" onClick={this.onSorting('borrowingDetails.userDetails.usr_lname')} >
                               User
                                &nbsp;
                                {this.getDirection('borrowingDetails.userDetails.usr_lname')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" onClick={this.onSorting('return_date_real')} className="font-weight-bold text-dark">
                                Date Returned
                                &nbsp;
                                {this.getDirection('return_date_real')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" onClick={this.onSorting('return_status')} className="font-weight-bold text-dark">
                                Status
                                &nbsp;
                                {this.getDirection('return_status')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" onClick={this.onSorting('return_dmgstatus')} className="font-weight-bold text-dark">
                                Item Condition
                                &nbsp;
                                {this.getDirection('return_dmgstatus')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" className="font-weight-bold text-dark">Options</Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody id="ReturnTable">
                        {dataList.map(returns => (
                            <tr key={returns.id}>
                                <td>{returns.id}</td>
                                <td className="font-weight-bold">{returns.borrowingDetails.itemDetails.item_name}</td>
                                <td>{returns.borrowingDetails.userDetails.usr_lname + ", " + returns.borrowingDetails.userDetails.usr_fname[0]+"."}</td>
                                <td>{new Date(returns.return_date_real).toLocaleDateString()}</td>
                                <td className={this.getStatusClass(returns.return_status)}>{returns.return_status}</td>
                                <td className={this.getDmgStatusClass(returns.return_dmgstatus)}>{returns.return_dmgstatus}</td>
                                <td>
                                    <ReturnBorrowingInfo design="outline-secondary" designName="Details" borrow={returns.borrowingDetails}></ReturnBorrowingInfo>
                                    &nbsp;
                                    <UpdateReturnModal design="outline-info" designName="Update" returns={returns} updateSubmit={(e) => {this.handleUpdateSubmit(e, returns)}}/>
                                    &nbsp;
                                    <ArchiveReturnModal design="outline-danger" designName="Archive" archiveSubmit={(e) => {this.handleArchiveSubmit(e, returns)}}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Switch>
                <Route path='/returns/archive' component={returnArchive}/>
            </Switch>
        </React.Fragment>
        );
    }

    getStatusClass(status){
        let classes = "font-weight-bold ";
        switch(status){
            case "Late":
                classes += "text-warning";
                break;
            case "On Time":
                classes += "text-success";
                break;
            case "Restored":
                classes += "text-info";
                break;     
        }
        return classes;
    }

    getDmgStatusClass(status){
        let classes = "font-weight-bold ";
        switch(status){
            case "Damaged":
                classes += "text-warning";
                break;
            case "Good":
                classes += "text-success";
                break;
            case "Lost/Stolen":
                classes += "text-danger";
                break;     
        }
        return classes;
    }
}
 
export default withAlert()(Returns);