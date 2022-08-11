import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import RestoreReturnModal from './returnRestoreModal';
import DeleteReturnModal from './returnDeleteModal';
import ReturnBorrowingInfo from './returnBorrowingInfo';
import axios from 'axios';
import { withAlert } from 'react-alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class returnArchive extends Component {
    state = {
        archivedReturnData: [],
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
            axios.get('/returns/archived')
        ])
        .then(([returnResponse]) => {
            this.setState({archivedReturnData: returnResponse.data});
            console.log(returnResponse);
            this.props.alert.success("Data loaded.");
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.borrowingData !== this.state.borrowingData){
            console.log("State changed.");
        }
    }

    handleRestoreSubmit = (event, restoreRow) => {
        event.preventDefault();
        const arc = {
            id: restoreRow.id,
            return_status: "Restored",
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
                axios.get('/returns/archived')
            ])
            .then(([returnResponse]) => {
                this.setState({archivedReturnData: returnResponse.data});
                console.log(returnResponse);
                this.props.alert.success("Record restored.");
            })
        });
        console.log("Data is restored.");
    }

    handleDeleteSubmit = (event, deleteRow) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        axios.delete('/returns/' + deleteRow.id, config)
        .then(response => {
            console.log(response);
            Promise.all([
                axios.get('/returns/archived')
            ])
            .then(([returnResponse]) => {
                this.setState({archivedReturnData: returnResponse.data});
                console.log(returnResponse);
                this.props.alert.success("Record deleted.");
            })
        });
        console.log("Data is deleted.");
    }

    onSorting = (column) => (event) => {
        const newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.archivedReturnData.sort((a,b) => {
            if(column === 'borrowingDetails.itemDetails.item_name'){
                if(a['borrowingDetails']['itemDetails']['item_name'] < b['borrowingDetails']['itemDetails']['item_name']){
                    return -1;
                }
                if (a['borrowingDetails']['itemDetails']['item_name'] > b['borrowingDetails']['itemDetails']['item_name']){
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
            archivedReturnData: sortedData,
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
        const dataList = this.state.archivedReturnData.filter((returns) => {
            if(this.state.search == null){
                return returns;
            }
            else if(returns.borrowingDetails.itemDetails.item_name.toLowerCase().includes(this.state.search.toLowerCase())){
                return returns;
            }
        })
        return (  
            <React.Fragment>
            <Row className="p-3">
                <Col sm={6}><h3>Return Records / Archive</h3></Col>
                <Col sm={6}>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search by item.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                        <InputGroup.Append>
                                <Link to='/returns/'><Button variant="outline-dark" className="ml-1">Unarchived Records</Button></Link>
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
                            <Button variant="link" onClick={this.onSorting('borrowingDetails.itemDetails.item_name')} className="font-weight-bold text-dark">
                                Borrowed Item 
                                &nbsp;
                                {this.getDirection('borrowingDetails.itemDetails.item_name')}
                            </Button>
                        </th>
                        <th>
                            <Button variant="link" className="font-weight-bold text-dark">
                               User
                                &nbsp;
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
                            <Button variant="link" className="font-weight-bold text-dark">
                                Status
                                &nbsp;
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
                    <tbody id="ArchivedReturnTable">
                        {dataList.map(returns => (
                            <tr key={returns.id}>
                                <td>{returns.id}</td>
                                <td className="font-weight-bold">{returns.borrowingDetails.itemDetails.item_name}</td>
                                <td>{returns.borrowingDetails.userDetails.usr_lname + ", " + returns.borrowingDetails.userDetails.usr_fname[0]+"."}</td>
                                <td>{new Date(returns.return_date_real).toLocaleDateString()}</td>
                                <td className="font-weight-bold text-danger">{returns.return_status}</td>
                                <td className="font-weight-bold text-success">{returns.return_dmgstatus}</td>
                                <td>
                                    <ReturnBorrowingInfo design="outline-secondary" designName="Details" borrow={returns.borrowingDetails}/>
                                    &nbsp;
                                    <RestoreReturnModal design="outline-success" designName="Restore" restoreSubmit={(e) => {this.handleRestoreSubmit(e, returns)}}/>
                                    &nbsp;
                                    <DeleteReturnModal design="outline-danger" designName="Delete" deleteSubmit={(e) => {this.handleDeleteSubmit(e, returns)}}/>
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
 
export default withAlert()(returnArchive);