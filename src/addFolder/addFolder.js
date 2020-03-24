import React, { Component } from 'react';
import NotefulContext from '../NotefulContext'
import config from '../config'
import './addFolder.css'
import NotefulForm from '../NotefulForm/NotefulForm';

export default class AddFolder extends Component {

    static contextType = NotefulContext;
    
        state = {
            folderName: '',
            nameValid: false,
            validation: '',
            success:false,
            successMessage: '',
            folders: [this.props.folders]
        };

    validationCheck = name => {
        const validationMessage = this.state.validation;
        let hasError = false;

        const checkFolderNames = this.context.folders.filter(folderName => name === folderName.name);

        if (name.length === 0) {
            hasError = true;
            validationMessage = 'Please enter a folder name.'
        }

        if (checkFolderNames.length !== 0) {
            hasError =true;
            validationMessage = 'Error! This folder name already exists.'
        }

        else {
            validationMessage = '';
        }

        this.setState({
            nameValid: !hasError,
            validation: validationMessage,
            folderName: name
        })
    }

    generateNewFolderId = () => {
        // b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1
        const id = Math.random().toString(36).substr(2, 8)
        const idTotal = id + '-ffaf-11e8-8eb2-f2801f1b9fd1'
        return idTotal
    }

    handleAddFolder = event => {
        event.preventDefault();
        const newId = this.generateNewFolderId();
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: newId,
                name: this.state.folderName
            })
        };
        fetch(config.ADD_FOLDER, options)
        .then(response => {
            if (!response.ok) {
                throw new Error ('Something went wrong!');
            }
            return response;
        })
        .then(response => response.json())
        .then(data => {
            this.context.handleAddFolder(data);
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({
                error: error.message
            });
        });
    };
    
    handleClickCancel = () => {
        this.props.history.push('/')
    };
        
    updateNewFolderName = event => {
        this.setState({name: event});
        console.log(event)
    }
    
    render() {

        return (

            <div className='addFolder__div'>
            <h2>New Folder</h2>
            <NotefulForm
                onSubmit={event => {
                    this.handleAddFolder(event);
                }}
            >
                <div className='addFolder__field'>
                    <label htmlFor='add-folder-name'>Name</label>
                    <input
                        type='text'
                        id='add-folder-name-input'
                        name='folder'
                        placeholder = 'ex. New Folder'
                        onChange={event => {
                            this.updateNewFolderName(event.target.value);
                        }}
                    />
                </div>
                        {!this.state.nameValid && (
                            <div>
                                <p>{this.state.errorMessage}</p>
                            </div>
                        )}
                <div className='AddFolder__buttons'>
                        <button 
                            type='button' 
                            onClick={this.handleClickCancel} 
                        >
                            Cancel
                        </button>
                        {' '}
                        <button
                            type='submit'
                            className='addNewFolder__button'
                            disabled={!this.state.nameValid}
                        >
                            Create
                        </button>
                </div>
            </NotefulForm>
            <section className="error-box" id="error-box">
                {this.state.validation}
            </section>
            <section className="error-box" id="error-box">
                {this.state.successMessage}
            </section>
            </div>
        )
    }
}