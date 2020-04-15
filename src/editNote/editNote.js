import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import ErrMsg from '../errorMessage';
import config from '../config'
import './editNote.css'

export default class EditNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            note_name: null,
            modified: null,
            folderid: null,
            content: null,
            formValid: false,
            titleValid: false,
            contentValid: false,
            folderSelectValid: false,
            errMsg: ''
        }
    }

    static contextType = NotefulContext;

    componentDidMount() {
        
        const noteLocation = config.API_NOTES + '/' + this.props.location.theNoteId;
        console.log('fetch for edit: ' + noteLocation)

        fetch(noteLocation, {
            method: 'GET',
        })
        .then(res => {
            if(!res.ok) {
                return res.json()
                    .then(error => Promise.reject(error))
            }
            return res.json()
        })
        .then(responseData => {
            this.setState({
                id: responseData.id,
                note_name: responseData.note_name,
                modified: responseData.modified,
                folderid: responseData.folderid,
                content: responseData.content
            })
        })
        .catch(error => {
            console.log(error)
            this.setState({ error })
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    updateFormEntry(event) {
        const name = event.target.name;
        const value = event.target.value;
        if(event.target.selectedOptions) {
            this.id = event.target.selectedOptions[0].id;
            this.setState({
                'folderid': this.id
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

    handleSubmit = (editedNote, callback) => {
        
        // event.preventDefault();

        this.setState({ error: null })

        const { note_name, folderid, content } = this.state;

        const note = {
            note_name: note_name,
            modified: new Date().toISOString(),
            folderid: folderid,
            content: content
        }

        fetch(config.API_NOTES, {
            method: 'PATCH',
            body: JSON.stringify(editedNote),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res
                    .json()
                    .then(error =>
                        Promise.reject(error))
                }
            })
            .then(() => {
                callback(callback)
                this.context.updateNote(note)
                this.props.history.push('/')
            })
            .catch(error => {
                console.log(error)
                this.setState({ error })
            })
    }

    render() {

        const { note_name, modified, folderid, content } = this.state
        const noteToEdit = { note_name, modified, folderid, content }
        console.log('folder name is:' + this.folder_name)
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

        return (

            <div className='addNote__div'>
                <h2>Edit Note</h2>
                <NotefulForm
                onSubmit={ () => this.handleSubmit }
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
                            value={note_name}
                            onChange={e => this.updateFormEntry(e)}/>
                    </div>
                    <ErrMsg msg={''} />
                    <div className='addNote__field'>
                        <label htmlFor='content'>Content</label>
                        <textarea
                            className='field'
                            name='content'
                            id='content'
                            value={content}
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
                            value={this.folder_name}
                            onChange={event => this.updateFormEntry(event, this.folder_name)}>
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
                                Edit
                        </button>
                    </div>
                </NotefulForm>
            </div>
        )
    }
}