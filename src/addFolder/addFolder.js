import React, { Component } from 'react';
import NotefulContext from '../NotefulContext'
import config from '../config'
import PropTypes from 'prop-types';
import './addFolder.css'

export default class AddFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        hasErrors: false,
        title: "",
        formValid: false,
        titleValid: false,
        validationMessage: "",
        error: '',
        };
    }

    static contextType = NotefulContext;
    
    goBack = () => {
        this.props.history.push('/');
    }

    updateFormEntry(e) {           
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        }, () => {this.validateEntry(name, value)});
    }

    validateEntry() {

        const title = this.state.title;

        if ( title.length === 0) {
            this.setState({
                error: 'Error! Name is required'
            })
            } else {
                this.setState({
                    formValid: true
                })
            }
    }


    handleSubmit(e) {
        e.preventDefault();
        this.validateEntry();
        console.log('handleSubmit ran!')
        if ( this.state.title.length === 0) {
        this.setState({
            error: 'Error! Name is required'
        })
        } else {

        const { title } = this.state;
        const folder = {
            folder_name: title
        }

        this.setState({error: null})
        fetch( config.API_FOLDERS , {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    console.log(`Error is: ${error}`)
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            console.log(this.props)
            console.log(this.context)
            this.context.addFolder(data)
            this.goBack()
        })
        .catch(error => {
            this.setState({ error })
        })
    }
    }

    render() {
        
        return (
            <form 
                className="Noteful-form"
                onSubmit={e => this.handleSubmit(e)}>
                <h2 className="title">Add Folder</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    className="field"
                    name="title" 
                    id="title" 
                    placeholder="Folder Title"
                    onChange={e => this.updateFormEntry(e)}/>
                </div>
                <div className='errorValidation'>
                    <p>{ this.state.error }</p>
                </div>
                <div className="buttons">
                 <button 
                    type="button" 
                    className="button"
                    onClick={() => this.goBack()}>
                     Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="button"
                >
                    Save
                 </button>
                 {}
                </div>
            </form> 
        )
    }
}


AddFolder.propType = {
    push: PropTypes.func.isRequired
};