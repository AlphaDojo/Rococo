import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar';
import Borrowing from './components/borrowing';
import Inventory from './components/inventory';
import Returns from './components/returns';
import Dashboard from './components/dashboard';
import Container from 'react-bootstrap/Container';
import InventoryArchive from './components/inventoryArchive';
import borrowingArchive from './components/borrowingArchive';
import returnArchive from './components/returnArchive';
import Login from './components/Login';
import axios from 'axios';
import { withAlert } from 'react-alert';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

class App extends Component {

  state = {
    hasToken: false
  }

  componentDidMount() {
    var token = localStorage.getItem("token");
    if(token){
      console.log("Logged in already");
      this.setState({
        hasToken: true
      })
    }
  }

  handleLoginSubmit = (event) => {
    event.preventDefault();
    const user = {
        username: event.target.username.value,
        password: event.target.password.value
    }
    console.log(user);
    axios.post('/signin/login', user)
    .then(res => {
        localStorage.setItem('token', res.data.accessToken);
        console.log('you are signed in');
        this.props.alert.success("Logged in!");
        this.setState({
          hasToken: true
        });
    })
  }
  
  handleLogoutSubmit = (event) => {
    console.log("Sup!");
    localStorage.removeItem("token");
    this.setState({
      hasToken: false
    });
    this.props.alert.success("Logged out.");
  }

  render(){
    return (
      <Router>
        <NavBar logoutSubmit={this.handleLogoutSubmit} token={this.state.hasToken}/>
        <br/>
        <Container>
          <Switch>
            <Route exact path="/">
              {this.state.hasToken ? <Redirect to="/dashboard"/> : <Login loginSubmit={this.handleLoginSubmit}/>}
            </Route>
            <Route exact path="/logout">
              <Redirect to="/"/>
            </Route>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/inventory" component={Inventory}/>
            <Route exact path="/inventory/archive" component={InventoryArchive}/>
            <Route exact path="/borrowing" component={Borrowing}/>
            <Route exact path="/borrowing/archive" component={borrowingArchive}/>
            <Route exact path="/returns" component={Returns}/>
            <Route exact path="/returns/archive" component={returnArchive}/>
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default withAlert()(App);
