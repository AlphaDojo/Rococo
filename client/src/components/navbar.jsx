import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '../logo2.png'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";


function NavBar(props){
    return (  
        <Navbar bg="dark" variant="dark" expand="lg">
            <Link to='/'>
                <Navbar.Brand>
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top mr-1"
                    />
                    Rococo Inventory Management
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                {props.token &&
                    <React.Fragment>
                        <Nav.Link as={Link} to="/borrowing">Borrowing</Nav.Link>
                        <Nav.Link as={Link} to="/returns">Returns</Nav.Link>
                        <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
                    </React.Fragment>
                }
                </Nav>
                <Nav className="ml-auto">
                {props.token &&
                    <React.Fragment>
                    <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/logout" onClick={props.logoutSubmit}>Logout</Nav.Link>
                    </React.Fragment>
                }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
 
export default NavBar;