import React, { Component } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import InventoryArchive from './inventoryArchive';
import NewItemModal from './newModal';
import UpdateInventoryModal from './inventoryUpdateModal';
import InventoryDescModal from './inventoryDescModal';
import ArchiveItemModal from './inventoryArchiveModal';
import { withAlert } from 'react-alert';
import Alert from 'react-bootstrap/Alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class Inventory extends Component {
    state = {
        inventory: [],
        sortConfig:{
            column: null,
            direction: null,
        },
        search: null,
    }
    constructor() {
        super();
    }
    componentDidMount() {
        Promise.all([
            axios.get('/item/main')
        ])
        .then(([itemResponse]) => {
            this.setState({inventory: itemResponse.data});
            console.log(itemResponse);
            this.props.alert.success("Data loaded.");
        })
        .catch((error) =>{
            console.log(error.response);
            this.props.alert.error(error.response.status + ' - ' + error.response.statusText)
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.inventory !== this.state.inventory){
            console.log("State changed.");
        }
    }
    handleAddSubmit = (event) =>{
        event.preventDefault();
        this.props.alert.info("Processing..");
        const datList = this.state.inventory;
        var i, s, n, d;
        var hasDuplicate = false;
        var dupQuantity;
        var duplicateID;
        var duplicateAvailability;

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };

        n = event.target.new_item.value;
        d = event.target.new_item_description.value;
        datList.forEach((inv, index) => {
            if(inv.supplierDetails.supplier_name === event.target.new_supplier.value && inv.item_name === n){
                hasDuplicate = true;
                duplicateID = inv.id;
                dupQuantity = inv.inventoryDetails.inv_quantity;
                duplicateAvailability = inv.inventoryDetails.inv_availability;
            }
        })
        const inv = {
            inv_quantity: event.target.new_inv_quantity.value,
            inv_availability: "OK"
            };
        if(event.target.new_inv_quantity.value == 0){
            this.props.alert.error("Item quantity must not be 0.");
            return;
        }
        else if(hasDuplicate){
            this.props.alert.info("Duplicate detected at Item ID # " + duplicateID + ".");
            const invUpdate = {
                id: duplicateID,
                inv_quantity: +event.target.new_inv_quantity.value + +dupQuantity,
                inv_availability: duplicateAvailability
            }
            axios.put('/inventory', invUpdate, config)
            .then((res) =>{
                Promise.all([
                    axios.get('/item/main')
                ])
                .then(([itemResponse]) => {
                    this.setState({inventory: itemResponse.data});
                    console.log(itemResponse);
                    this.props.alert.success("Quantity added to duplicate item.")
                })
            })
        }
        else{
            const supp = {supplier_name: event.target.new_supplier.value};
            Promise.all([
                axios.post('/inventory', inv, config),
                axios.post(`/supplier/findorcreate`, supp, config),
            ])
            .then(res => {
                console.log(res);
                s = res[1].data[0].id;
                i = res[0].data.id;
            })
            .catch((e) => {
                console.log(e);
            });

            setTimeout(() =>{
                const item = {
                    item_name: n,
                    item_description: d,
                    inventoryId: i,
                    supplierId: s
                };
                axios.post(`/item/create`, item, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    Promise.all([
                        axios.get('/item/main')
                    ])
                    .then(([itemResponse]) => {
                        this.setState({inventory: itemResponse.data});
                        console.log(itemResponse);
                        this.props.alert.success("Item added.")
                    })
                })
            }, 1000);
            console.log("Data is added.");
        }
    }

    handleUpdateSubmit = (event, updateinfo) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        var inv_q;
        var item_n;
        var item_d;
        var supp_n;

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };

        //Item Supplier
        if(event.target.itemAuth.value === ''){
            supp_n = updateinfo.supplierDetails.supplier_name;
        }
        else{
            supp_n = event.target.itemAuth.value;
        }
        //Item Title
        if(event.target.itemTitle.value === ''){
            item_n = updateinfo.item_name;
        }
        else{
            item_n = event.target.itemTitle.value;
        }
        //Item Quantity
        if(event.target.itemQuantity.value === ''){
            inv_q = updateinfo.inventoryDetails.inv_quantity;
        }
        else{
            inv_q = event.target.itemQuantity.value;
        }
        //Item Description
        if(event.target.itemDesc.value === ''){
            item_d = updateinfo.item_description;
        }
        else{
            item_d = event.target.itemDesc.value;
        }
        if(inv_q == 0){
            this.props.alert.error("Item quantity must not be 0.");
            return;
        }
        else{
            const suppUpdate = {
                id: updateinfo.supplierDetails.id,
                supplier_name: supp_n
            }

            const invUpdate = {
                id: updateinfo.inventoryDetails.id,
                inv_quantity: inv_q,
                inv_availability: event.target.itemAvailability.value
            }

            const itemUpdate = {
                id: updateinfo.id,
                item_name: item_n,
                item_description: item_d,
                inventoryId: updateinfo.inventoryDetails.id,
                supplierId: updateinfo.supplierDetails.id
            }

            //API Call
            axios.put('/supplier', suppUpdate, config);
            axios.put('/inventory', invUpdate, config);
            axios.put('/item', itemUpdate, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                Promise.all([
                    axios.get('/item/main')
                ])
                .then(([itemResponse]) => {
                    this.setState({inventory: itemResponse.data});
                    console.log(itemResponse);
                    this.props.alert.success("Item updated.")
                })
            })
            console.log("Data is updated.");
        }
    }

    handleArchiveSubmit = (event, invArchive) => {
        event.preventDefault();
        this.props.alert.info("Processing..");
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: '`Bearer ' + token }
        };
        const arc = {
            id: invArchive.inventoryDetails.id,
            inv_availability: "Archived"
        }
        axios.put('/inventory/availability', arc, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            Promise.all([
                axios.get('/item/main')
            ])
            .then(([itemResponse]) => {
                this.setState({inventory: itemResponse.data});
                console.log(itemResponse);
                this.props.alert.success("Item archived.")
            })
        });
        console.log("Data is archived.")
    }

    onSorting = (column) => (event) => {
        var newDirection;
        var sortedData;
        if(this.state.sortConfig.column === column){
            newDirection = this.state.sortConfig.column ? (this.state.sortConfig.direction === 'desc' ? 'asc' : 'desc') : 'asc';
        }
        else{
            newDirection = this.state.sortConfig.direction;
        }
        if(this.state.sortConfig.direction === null){
            newDirection = 'asc';
        }
        sortedData = this.state.inventory;
        sortedData.sort((a,b) => {
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
        const dataList = this.state.inventory.filter((inventory) => {
            if(this.state.search == null){
                return inventory;
            }
            else if(inventory.item_name.toLowerCase().includes(this.state.search.toLowerCase()) || inventory.supplierDetails.supplier_name.toLowerCase().includes(this.state.search.toLowerCase())){
                return inventory;
            }
        })
        return (
            <React.Fragment>
                <Row className="p-3">
                    <Col sm={6}><h3>Inventory Records</h3></Col>
                    <Col sm={6}>
                        <InputGroup>
                            <Form.Control type="text" placeholder="Search by supplier or item name.." onChange={(event) => this.searchTerm(event)}></Form.Control>
                            <InputGroup.Append>
                                    <NewItemModal design='outline-success' designName="New Item" addSubmit={this.handleAddSubmit}></NewItemModal>
                                    <Link to='/inventory/archive'><Button variant="outline-dark" className="ml-1">Archived Items</Button></Link>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                {dataList.length == 0 &&
                    <Alert variant='danger'>No items found!</Alert>
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
                                    <td className={this.getStatusClass(inventory.inventoryDetails.inv_availability)}>{inventory.inventoryDetails.inv_availability}</td>
                                    <td>{inventory.inventoryDetails.inv_quantity}</td>
                                    <td>
                                        <InventoryDescModal designName="More" design="outline-info" itemDescription={inventory.item_description}></InventoryDescModal>
                                    </td>
                                    <td>
                                        <UpdateInventoryModal design="outline-warning" designName="Update" inventory={inventory}  updateSubmit={(e) => {this.handleUpdateSubmit(e, inventory)}}></UpdateInventoryModal>
                                        &nbsp;
                                        &nbsp;
                                        <ArchiveItemModal design="outline-danger" designName="Archive" archiveSubmit={(e) => {this.handleArchiveSubmit(e, inventory)}}></ArchiveItemModal>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Switch>
                    <Route path='/inventory/archive' component={InventoryArchive}/>
                </Switch>
            </React.Fragment>

        );
    }

    getStatusClass(status){
        let classes = "font-weight-bold ";
        switch(status){
            case "OK":
                classes += "text-success";
                break;
            case "Borrowed":
                classes += "text-warning";
                break;
            case "Damaged/Lost":
                classes += "text-warning";
                break;    
        }
        return classes;
    }
}

export default withAlert()(Inventory);