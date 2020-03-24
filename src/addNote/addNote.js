import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import config from '../config'
import './addNote.css'

class AddNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            modified: '',
            folderId: '',
            content: '',
            error: null,
            nameValid: false,
            idValid: false,
            errorMessage: '',
            folders: [this.props.folders]
        }
    }

    static contextType = NotefulContext;

    static defaultProps = {
        folders: []
    };

    validationCheck = name => {
        name.preventDefault();
        if (!this.state.name) {
            this.setState({
                errorMessage: 'Note name required',
                nameValid: false
            });
        } else if (!this.state.folderId) {
            this.setState({
                errorMessage: 'Choose a folder',
                idValid: false
            });
        } else {
            this.setState({
                errorMessage: '',
                nameValid: true,
                idValid: true
            },
            () => {
                this.handleAddNote();
            });
        }
    }

    handleAddNote = () => {
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                modified: new Date().toISOString(),
                folderId: this.state.folderId,
                content: this.state.content
            })
        };

        fetch(config.ADD_NOTE, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error ('Something went wrong!');
                }
                return response;
            })
            .then(response => response.json())
            .then(data => {
                this.context.addNote(data);
            })
            .catch(error => {
                this.setState({
                    error: error.message
                });
            });
    }

    handleNameChange = event => {
        this.setState({
            name: event
        });
    };

    handleContentChange = event => {
        this.setState({
            content: event
        });
    };

    handleIdChange = event => {
        this.setState({
            folderId: event
        });
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    };

    
    generateNewNoteId = () => {
        // d26e01a6-ffaf-11e8-8eb2-f2801f1b9fd1
        const idFront = Math.random().toString(36).substr(2, 8);
        const idTotal = idFront + '-ffaf-11e8-8eb2-f2801f1b9fd1'
        return idTotal
    }
    
    render() {
        
        const folderOptions = this
                .props
                .folders
                .map(
                (folder, i) => <option value={folder.id} key={i}>{folder.name}</option>
                )

        return (

            <div className='addNote__div'>
                <h2>New Note</h2>
                <NotefulForm
                onSubmit={event => {
                    this.validationCheck(event)
                }}
                >
                    <div className='addNote__field'>
                        <label htmlFor='note-name-input'>Name</label>
                        <input
                            type='text'
                            id='add-note-name-input'
                            name='note'
                            onChange={event => {
                                this.handleNameChange(event.target.value);
                            }}
                        />
                    </div>
                        {!this.state.nameValid && (
                            <div>
                                <p>{this.state.errorMessage}</p>
                            </div>
                        )}
                    <div className='addNote__field'>
                        <label htmlFor='notee-contet-input'>Content</label>
                        <textarea
                            id='add-note-content-input'
                            name='content'
                            onChange={event => {
                                this.handleContentChange(event.target.value);
                            }}
                        />
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='note-folder-select'>Folder</label>
                        <select 
                            id='add-note-folder-select'
                            name='folder'
                            onChange={event => {
                                this.handleIdChange(event.target.value);
                            }}
                        >
                            <option value={null}>...</option>
                            { folderOptions }
                        </select>
                        {!this.state.nameValid && (
                            <div>
                                <p>{this.state.errorMessage}</p>
                            </div>
                        )}
                    </div>
                    <div
                        className='AddNote__buttons'    
                    >
                        <button
                            type='button'
                            className='addNote__button'
                            onClick={this.handleClickCancel}    
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='addNote__button'    
                            
                        >   
                            Create
                        </button>
                    </div>
                </NotefulForm>
                {this.state.error && (
                    <div>
                        <p>{this.state.error}</p>
                    </div>
                )}
            </div>
        )
    }
}

export default AddNote;