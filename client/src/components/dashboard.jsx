import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import invPic from '../manufacturing-inventory.jpg';
import CardDeck from 'react-bootstrap/CardDeck';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            inventory: []
        }
    }

      componentDidMount() {
      }

    render() { 
        return (
            <div>
                <h1>Welcome back!</h1>
                <br></br>
                <CardDeck>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={invPic} />
                        <Card.Body>
                            <Card.Title>Inventory System</Card.Title>
                            <Card.Text>
                            Manange inventory and items contained.
                            </Card.Text>
                            <Link to='/inventory/'><Button variant="primary">Go to Inventory</Button></Link>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={invPic} />
                        <Card.Body>
                            <Card.Title>Borrowing System</Card.Title>
                            <Card.Text>
                            Manange borrowing transactions.
                            </Card.Text>
                            <Link to='/borrowing/'><Button variant="primary">Go to Borrowing</Button></Link>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={invPic} />
                        <Card.Body>
                            <Card.Title>Returns System</Card.Title>
                            <Card.Text>
                            Manange return transactions.
                            </Card.Text>
                            <Link to='/returns/'><Button variant="primary">Go to Returns</Button></Link>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </div>
        );
    }
}
 
export default Dashboard;