import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import InventoryDescModal from './inventoryDescModal';
import RestoreInventoryModal from './inventoryRestoreModal';
import DeleteInventoryModal from './inventoryDeleteModal';
import axios from 'axios';
import { withAlert } from 'react-alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  } from "react-router-dom";

class InventoryArchive extends Component {
    state = {
        inventory: [],
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
            axios.get('/item/archived')
        ])
        .then(([itemResponse]) => {
            this.setState({inventory: itemResponse.data});
            console.log(itemResponse);
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
        this.props.alert.info("Processing..");
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        const arc = {
            id: restoreRow.inventoryDetails.id,
            inv_availability: "OK"
        }
        axios.put('/inventory/availability', arc, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            Promise.all([
                axios.get('/item/archived')
            ])
            .then(([itemResponse]) => {
                this.setState({inventory: itemResponse.data});
                console.log(itemResponse);
                this.props.alert.success("Item restored.");
            })
        });
        console.log("Data is restored.");
    }

    handleDeleteSubmit = (event, deleteRow) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        var d = deleteRow.inventoryDetails.id;
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        axios.delete("/borrowing/item/" + deleteRow.id, config);
        Promise.all([
            axios.delete("/item/" + deleteRow.id, config),
            axios.delete("/inventory/" + d, config)
        ])
        .then(response => {
            console.log(response);
            Promise.all([
                axios.get('/item/archived')
            ])
            .then(([itemResponse]) => {
                this.setState({inventory: itemResponse.data});
                console.log(itemResponse);
                this.props.alert.success("Item deleted.");
            })
        });
        console.log("Data is deleted.");
    }
    

    onSorting = (column) => (event) => {
        const newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.inventory.sort((a,b) => {
            if(column === 'supplier_name'){
                if(a['supplierDetails']['supplier_name'] < b['supplierDetails']['supplier_name']){
                    return -1;
                }
                if (a['supplierDetails']['supplier_name'] > b['supplierDetails']['supplier_name']){
                    return 1;
                }
                return 0;
            }
            if(column === 'inv_availability'){
                if(a['inventoryDetails']['inv_availability'] < b['inventoryDetails']['inv_availability']){
                    return -1;
                }
                if (a['inventoryDetails']['inv_availability'] > b['inventoryDetails']['inv_availability']){
                    return 1;
                }
                return 0;
            }
            if(column === 'inv_quantity'){
                if(a['inventoryDetails']['inv_quantity'] < b['inventoryDetails']['inv_quantity']){
                    return -1;
                }
                if (a['inventoryDetails']['inv_quantity'] > b['inventoryDetails']['inv_quantity']){
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
            inventory: sortedData,
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
        const dataList = this.state.inventory.filter((archivedInv) => {
            if(this.state.search == null){
                return archivedInv;
            }
            else if(archivedInv.itemTitle.toLowerCase().includes(this.state.search.toLowerCase()) || archivedInv.author.toLowerCase().includes(this.state.search.toLowerCase())){
                return archivedInv;
            }
        })
        return (
            <React.Fragment>
                <Row className="p-3">
                    <Col sm={6}><h3>Inventory Records / Archive</h3></Col>
                    <Col sm={6}>
                        <InputGroup>
                            <Form.Control type="text" placeholder="Search by supplier or item name.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                            <InputGroup.Append>
                                    <Link to='/inventory/'><Button variant="outline-dark" >Unarchived Items</Button></Link>
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
                                <Button variant="link" onClick={this.onSorting('item_name')} className="font-weight-bold text-dark">
                                Item Name
                                &nbsp;
                                {this.getDirection('item_name')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('supplier_name')} className="font-weight-bold text-dark">
                                Supplier
                                &nbsp;
                                {this.getDirection('supplier_name')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('inv_availability')} className="font-weight-bold text-dark">
                                Status
                                &nbsp;
                                {this.getDirection('inv_availability')}
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" onClick={this.onSorting('inv_quantity')} className="font-weight-bold text-dark">
                                No. Available
                                &nbsp;
                                {this.getDirection('inv_quantity')}
                                </Button>
                            </th>
                            <th><Button variant="link" className="font-weight-bold text-dark">Item Description</Button></th>
                            <th>
                                <Button variant="link" className="font-weight-bold text-dark">Options</Button>
                            </th>
                        </tr>
                        </thead>
                        <tbody id="InventoryTable">
                            {dataList.map(inventory => (
                                <tr key={inventory.id}>
                                    <td>{inventory.id}</td>
                                    <td>{inventory.item_name}</td>
                                    <td>{inventory.supplierDetails.supplier_name}</td>
                                    <td className="font-weight-bold text-danger">{inventory.inventoryDetails.inv_availability}</td>
                                    <td>{inventory.inventoryDetails.inv_quantity}</td>
                                    <td><InventoryDescModal design="outline-info" designName="More" itemDescription={inventory.item_description}/></td>
                                    <td>
                                        <RestoreInventoryModal design="outline-success" designName="Restore" restoreSubmit={(e) => {this.handleRestoreSubmit(e, inventory)}}/>
                                        &nbsp;
                                        &nbsp;
                                        <DeleteInventoryModal design="outline-danger" designName="Delete" deleteSubmit={(e) => {this.handleDeleteSubmit(e, inventory)}}/>
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
 
export default withAlert()(InventoryArchive);