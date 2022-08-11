import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

class AutocompleteReturn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: '',
        }
    }
    static propTypes = {};
    onChange = (event) =>{
        const suggestions = this.props.suggestions;
        const userInput = event.currentTarget.value;

        const filteredSuggestions = suggestions.filter(
            (suggestion) => suggestion.itemDetails.item_name.toLowerCase().includes(userInput.toLowerCase()) || suggestion.userDetails.usr_lname.toLowerCase().includes(userInput.toLowerCase())
        );

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: event.currentTarget.value
        })
    }
    onKeyDown = (event) =>{
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (event.keyCode === 13) {
          this.setState({
            activeSuggestion: 0,
            showSuggestions: false,
            userInput: filteredSuggestions[activeSuggestion].id + ' - ' + filteredSuggestions[activeSuggestion].itemId + ' - ' + filteredSuggestions[activeSuggestion].itemDetails.item_name + ' - ' + filteredSuggestions[activeSuggestion].userDetails.usr_fname + " " + filteredSuggestions[activeSuggestion].userDetails.usr_lname
          });
          this.props.getDate(filteredSuggestions[activeSuggestion].id);
        }
        else if (event.keyCode === 38) {
          if (activeSuggestion === 0) {
            return;
          }
          else{
            this.setState({ activeSuggestion: activeSuggestion - 1 });
          }
        }
        else if (event.keyCode === 40) {
          if (activeSuggestion === filteredSuggestions.length - 1) {
            return;
          }
          else{
            this.setState({ activeSuggestion: activeSuggestion + 1 });
          }
        }
    }

    onClick = (event) => {
        const id = event.currentTarget.innerText.split(' - ');
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: event.currentTarget.innerText
          });
          this.props.getDate(id[0]);
    }
    render() {
        let suggestionsListComponent;
        if(this.state.showSuggestions && this.state.userInput){
            if(this.state.filteredSuggestions.length){
                suggestionsListComponent = (
                    <ListGroup>
                        {this.state.filteredSuggestions.map((suggestion, index) =>{
                            return(
                                <ListGroup.Item action key={suggestion.id} id={suggestion.id} onClick={this.onClick} active={index == this.state.activeSuggestion}>
                                    {suggestion.id + ' - ' + suggestion.itemId + ' - ' + suggestion.itemDetails.item_name + ' - ' + suggestion.userDetails.usr_fname + " " + suggestion.userDetails.usr_lname}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                );
            }
            else(
                suggestionsListComponent = (
                <ListGroup>
                    <ListGroup.Item>
                        <em>No suggestions</em>
                    </ListGroup.Item>
                </ListGroup>
                )
            )
        }
        return (
            <React.Fragment>
                <Form.Control type="text" name="borrow_ID" onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.userInput} placeholder="Borrow ID - Item ID - Item Name - Borrower" autoComplete="off"></Form.Control>
                {suggestionsListComponent}
            </React.Fragment>
        );

    }
}
 
export default AutocompleteReturn;