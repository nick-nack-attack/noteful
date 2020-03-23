import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import FolderSelector from '../folderSelector/folderSelector'
import ValidationError from '../validationError'
import config from '../config'
import './addNote.css'

class AddNote extends Component {

    static contextType = NotefulContext;

    constructor(props) {
        super(props);
        this.state = {
            note: {
                name: '',
                id: '',
                modified: '',
                folderId: '',
                content: ''
            },
            error: null,
        }
    }

    generateNewNoteId = () => {
        // d26e01a6-ffaf-11e8-8eb2-f2801f1b9fd1
        const idFront = Math.random().toString(36).substr(2, 8);
        const idTotal = idFront + '-ffaf-11e8-8eb2-f2801f1b9fd1'
        return idTotal
    }

    // Handle

    handleClickCancel = () => {
        this.props.history.push('/')
    }

    handleSubmit = e => {
        e.preventDefault();
        
        const newNoteModified = new Date().toISOString()
        const newNoteId = this.generateNewNoteId();

        const { nameInput, folderId, content } = e.target
        const newNote = {
            id: newNoteId,
            name: nameInput.value,
            modified: newNoteModified,
            folderId: folderId.value,
            content: content.value,
        }
        console.log('ID: ' + newNote.id)
        console.log('NAME: ' + newNote.name)
        console.log('MODIFIED: ' + newNote.modified)
        console.log('FOLDERID: ' + newNote.folderId)
        console.log('CONTENT: ' + newNote.content)
    }

    // UPDATE FUNCTIONS

    updateNewNoteName = noteName => {
        console.log('updateNewNoteName ran with argument: ' + noteName)
        this.setState({note: {name: noteName}})
        console.log('state note name is : ' + this.state.note.name)
    }

    updateNewNoteContent = noteContent => {
        this.setState({note: {content: noteContent}})
    }

    render() {

        return (
            <div
                className='addNote__div'
            >
                <h3>New Note</h3>
                <form
                    className='addNote__form'
                    onSubmit={this.handleSubmit}
                >
                    <FolderSelector /><br/>
                    <label
                        htmlFor='name'
                    >
                        Name
                    </label><br/>
                    <input
                        type='text'
                        className='addNote__nameInput'
                        name='nameInput'
                        id='nameInput'
                        placeholder='ex. New Note'
                        onSubmit={ e=>this.updateNewNoteName(e.target.value) }
                    /><br/>
                    <label
                        htmlFor='content'
                    >
                        Content
                    </label><br/>
                    <input
                        type='text'
                        className='addNote__contentInput'    
                        name='content'
                        id='content'
                        placeholder='ex. (in a raspy voice) When I was a child...'
                        onSubmit={ e=>this.updateNewNoteContent(e.target.value) }
                    />
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
                </form>
            </div>
        )
    }
}

export default AddNote;