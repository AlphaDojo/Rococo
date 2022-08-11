import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

class Login extends Component {
    constructor(){
        super();

    }
    state = {
        username: '',
        password: '',
    }


    render() { 
        return (
            <React.Fragment>
            <br/>
            <br/>
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={6}><h3>Staff Login</h3></Col>
                    <Col></Col>
                </Row>
                <br/>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <Form onSubmit={this.props.loginSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="username" autoComplete="off" onChange={(e) => this.setState({username: e.target.value})}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" autoComplete="off" onChange={(e) => this.setState({password: e.target.value})}></Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={!this.state.username || !this.state.password}>Log in</Button>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            </React.Fragment>
        );
    }
}
 
export default Login;