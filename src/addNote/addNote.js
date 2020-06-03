import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import ErrMsg from '../errorMessage';
import config from '../config'
import './addNote.css'

export default class AddNote extends Component {

    state = {
        title: "",
        content: "",
        folderSelect: "",
        folderid: null,
        formValid: false,
        titleValid: false,
        contentValid: false,
        folderSelectValid: false,
        validationMessage: '',
        errMsg: ''
        }

    static contextType = NotefulContext;

    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(event) {
        const name = event.target.name;
        const value = event.target.value;
        let id = event.target.value;
        if(event.target.selectedOptions) {
            id = event.target.selectedOptions[0].id;
            this.setState({
                'folderid': id
            })
        }
        this.setState({
            [event.target.name]: event.target.value,
        }, () => {this.validateEntry(name,value)});
    }

    validateEntry(name, value) {
        let hasErrors = false;
        value= value.trim();
        if ((name === 'note_name') || (name === 'content')) {
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
        if (titleValid && folderSelectValid === true) {
            this.setState({
                    formValid: true,
                    validationMessage: null
            });
        } else if (!titleValid && !folderSelectValid) {
            this.setState({ formValid: false, validationMessage: 'Title and Folder are required' })
        } else if (!titleValid) {
            this.setState({ formValid: false, validationMessage: 'Title is required' })
        } else if (!folderSelectValid) {
            this.setState({ formValid: false, validationMessage: 'Folder is required' })
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const { title, content, folderid } = this.state;

        const note = {
            note_name: title,
            modified: new Date().toISOString(),
            folderid: folderid,
            content: content
        }

        this.setState({
            error: null
        })

        fetch(config.API_NOTES, {
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
                    {folder.folder_name}
                </option>
                )
        })
        const validationMessage = this.state.validationMessage
        return (
            <div className='addNote__div'>
                <h2>New Note</h2>
                <NotefulForm
                onSubmit={event => {
                    this.handleSubmit(event)
                }}
                >
                    <div className='addNote__field'>
                        <label htmlFor='note-name-input'>Name</label>
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
                    { validationMessage ? <ErrMsg msg={validationMessage} /> : <div></div> }
                    <div className='addNote__field'>
                        <label htmlFor='content'>Content</label>
                        <textarea
                            className='field'
                            name='content'
                            id='content'
                            placeholder='(Optional)'
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