import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import ErrMsg from '../errorMessage';
import config from '../config'
import './editNote.css'

export default class EditNote extends Component {

    static contextType = NotefulContext;

    state = {
        id: {
            value: null
        },
        note_name: {
            value: '',
            touched: false
        },
        content: {
            value: '',
            touched: false
        },
        folder: {
            folderSelected: '',
            folderid: '',
            touched: false
        },
        modified: {
            value: ''
        },
    };

    updateName = (note_name) => {
        this.setState({
            note_name: {
                value: note_name,
                touched: true
            }
        })
    };

    updateContent = (content) => {
        this.setState({
            name: {
                value: content,
                touched: true
            }
        })
    };

    updateFolder = (folder_name, folder_id) => {
        this.setState({
            folder: {
                folderSelected: folder_name,
                folderid: folder_id,
                touched: true
            }
        })
    };

    validateEntry(key, value) {

        if (value !== '') {
            value = value.trim();
        }

        if ((key === 'note_name') || (key === 'content')) {
            if (value.length < 1) {
                return 'Note name and content are required'
            }
        } else if ( (key === 'folderSelect') && (value === 'Select') ) {
            return 'Folder must be selected'
        }

    }

    componentDidMount() {

        console.log("THIS IS PASSED IN: " + this.props.noteId)
        console.log("also this!!! " + this.props.value.location.theNoteId)

        const passedInNoteId = this.props.noteId

        console.log(parseInt(passedInNoteId))

        const noteLocation = config.API_NOTES + '/' + passedInNoteId

        console.log("Note Location: " + noteLocation)

        fetch(noteLocation, {method: 'GET'})
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => Promise.reject(error))
                }
                return res.json()
                })
            .then(resData => {
                this.setState({
                    id: { value: resData.id},
                    note_name: { value: resData.note_name },
                    modified: { value: resData.modified },
                    folder: { folderid: resData.folderid },
                    content: { value: resData.content },
                })
            })

    }

    goBack = () => {
        this.props.history.goBack();
    }

    handleSubmit = e => {
        
        e.preventDefault();

        const updatedNote = {
            id: this.state.id.value,
            note_name: this.state.note_name.value,
            content: this.state.content.value,
            folderid: this.state.folder.folderid
        }

        console.log(updatedNote)

        fetch((config.API_NOTES + '/' + this.state.id.value), {
            method: 'PATCH',
            body: JSON.stringify(updatedNote),
            headers: { 'content-type': 'application/json' }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))}
        })
        .then((note) => {
            console.log(note)
            this.context.editNote(note);
            // this.props.history.push('/')
            window.location.href = '/'
        })
        .catch(error => {
            console.log(error)
            this.setState({ error })
        })
    }

    render() {

        // const noteToEdit = { note_name, modified, folderid, content }
        const folders = this.context.folders;
        const folderOptions = []
        folderOptions.push(folders.find(folder => folder.id == this.state.id.value))
        const newFolders = folders.filter( folder => folder.id !== this.state.id.value) 
            newFolders.forEach(folder => {
                folderOptions.push(

                    <option
                        key={folder.id}
                        id={folder.id}>
                        {folder.folder_name}
                    </option>
    
                    )
            })
            // Find the right folder and then return it as the first option


        console.log("Here is the state name: " + this.state.note_name.value)

        return (

            <div className='addNote__div'>
                <h2>Edit Note</h2>
                <NotefulForm
                onSubmit={ this.handleSubmit }
                >
                    <div className='addNote__field'>
                        <label htmlFor='note-name-input'>Name</label>
                            
                        <input
                            id='note-name-input'
                            name='note-name'
                            type='text'
                            className='field'
                            aria-label='Name'
                            aria-required='true'
                            defaultValue={this.state.note_name.value}
                            onChange={e => this.updateName(e.target.value)}/>
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='note-content-input'>Content</label>
                            {this.state.content.touched && ( <ErrMsg msg={this.validateEntry()} /> )}
                        <textarea
                            id='note-content-input'
                            name='note-content'
                            className='field'
                            defaultValue={this.state.content.value}
                            rows={4}
                            onChange={e => this.updateContent(e.target.value)}/>
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='note-folder-select'>Folder</label>
                            
                        <select 
                            id="note-folder-select"
                            name="note-folder-id"
                            ref={this.state.folder.folderSelected}
                            type="text"
                            className="field"
                            defaultValue={this.state.folder.folderSelected}
                            onChange={e => this.updateFolder(e.target.value, e.target.ref)}>
                                
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
                        >   
                                Save changes
                        </button>
                    </div>
                </NotefulForm>
            </div>
        )
    }
}

EditNote.defaultProps = {
    history: {
        goBack: () => {}
    }
}