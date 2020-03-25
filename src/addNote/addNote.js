import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import config from '../config'
import './addNote.css'

export default class AddNote extends Component {

    state = {
        title: "",
        content: "",
        folderSelect: "",
        folderId: "",
        formValid: false,
        titleValid: false,
        contentValid: false,
        folderSelectValid: false,
        validationMessage: null
        }

    static contextType = NotefulContext;

    goBack = () => {
        this.props.history.goBack();
    }

    generateNewNoteId = () => {
        // d26e01a6-ffaf-11e8-8eb2-f2801f1b9fd1
        const idFront = Math.random().toString(36).substr(2, 8);
        const idTotal = idFront + '-ffaf-11e8-8eb2-f2801f1b9fd1'
        return idTotal
    }

    updateFormEntry(event) {
        const name = event.target.name;
        const value = event.target.value;
        let id = event.target.value;
        if(event.target.selectedOptions) {
            id = event.target.selectedOptions[0].id;
            this.setState({
                'folderId': id
            })
        }
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {this.validateEntry(name,value)});
    }

    validateEntry(name, value) {
        let hasErrors = false;

        value= value.trim();

        if ((name === 'title') || (name === 'content')) {
            if (value.length < 1) {
                hasErrors = true
            }
            else {
                hasErrors = false
            }
        }

        else if ( (name === 'folderSelect') && (value === 'Select') ) {
            hasErrors = true
        }

        else {
            hasErrors = false
        }

        this.setState({
            [`${name}Valid`] : !hasErrors 
            }, this.formValid
            );
    }

    formValid() {
        const { titleValid, contentValid, folderSelectValid } = this.state;
        if (titleValid && contentValid && folderSelectValid === true) {
            this.setState({
                    formValid: true,
                    validationMessage: null
            });
        }
        else {this.setState({
            formValid: !this.formValid,
            validationMessage: 'All fields are required!'
        })}
    }

    handleSubmit(event) {
        event.preventDefault();

        const { title, content, folderId } = this.state;

        const note = {
            name: title,
            content: content,
            folderId: folderId,
            modified: new Date().toISOString(),
        }

        this.setState({
            error: null
        })

        fetch(config.ADD_NOTE, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error ('Something went wrong!');
                }
                return response.json();
            })
            .then(data => {
                this.goBack()
                this.context.addNote(data);
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    render() {

        const folders = this.context.folders;
        const folderOptions = folders.map( folder => {
            return (
                <option
                    key={folder.id}
                    id={folder.id}>
                {folder.name}
                </option>
                )
        })

        return (

            <div className='addNote__div'>
                <h2>New Note</h2>
                <NotefulForm
                onSubmit={event => {
                    this.handleSubmit(event)
                }}
                >
                    <div className='addNote__field'>
                        <label htmlFor='note-name-input'>Title</label>
                        <input
                            type='text'
                            className='field'
                            name='title'
                            id='title'
                            aria-label='Title'
                            aria-required='true'
                            placeholder="ex. New Note"
                            onChange={e => this.updateFormEntry(e)}/>
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='content'>Content</label>
                        <textarea
                            className='field'
                            name='content'
                            id='content'
                            onChange={e => this.updateFormEntry(e)}/>
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='folder-select'>Folder</label>
                        <select 
                            type="text"
                            className="field"
                            name="folderSelect"
                            id="folder-select"
                            ref={this.folderSelect}
                            onChange={event => this.updateFormEntry(event)}>
                                <option>Select</option>
                            { folderOptions }
                        </select>
                    </div>
                    <div
                        className='AddNote__buttons'    
                    >
                        <button
                            type='button'
                            className='addNote__button'
                            onClick={ () => this.goBack() } >
                                Cancel
                        </button>
                        <button
                            type='submit'
                            className='addNote__button'    
                            disabled={ !this.state.formValid } >   
                                Create
                        </button>
                    </div>
                </NotefulForm>
            </div>
        )
    }
}