import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

class Autocomplete extends Component {
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
            (suggestion) => suggestion.item_name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
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
            userInput: filteredSuggestions[activeSuggestion].id + ' - ' + filteredSuggestions[activeSuggestion].item_name + ' - ' + filteredSuggestions[activeSuggestion].supplierDetails.supplier_name
          });
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
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: event.currentTarget.innerText
          });
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
                                    {suggestion.id + ' - ' + suggestion.item_name + ' - ' + suggestion.supplierDetails.supplier_name}
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
                <Form.Control type="text" name="new_item_borrowed" onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.userInput} placeholder="Item ID - Item Name - Supplier/Author" autoComplete="off"></Form.Control>
                {suggestionsListComponent}
            </React.Fragment>
        );

    }
}
 
export default Autocomplete;